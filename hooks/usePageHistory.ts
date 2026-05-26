import { useEffect, useRef, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { PageId } from "~/lib/pagesConfig";

/**
 * usePageHistory
 *
 * Maintains a fully independent per-page undo/redo stack using canvas
 * snapshots. We do NOT rely on Craft.js's internal history at all, because
 * it resets every time <Frame key={pageId}> remounts on a page switch.
 *
 * Architecture:
 * - Each page has its own stack: string[] of serialized canvas JSON
 * - A pointer into that stack (current position)
 * - On every Craft.js node change we push a new snapshot onto the stack
 * - Undo: move pointer back and call actions.deserialize(snapshot)
 * - Redo: move pointer forward and call actions.deserialize(snapshot)
 * - On page switch: freeze the stack for the leaving page, resume for arriving page
 * - getSnapshot(pageId): returns the latest snapshot for any page (for Frame data)
 */

interface PageStack {
  snapshots: string[];   // oldest → newest
  pointer: number;       // index of current position in snapshots
}

// Module-level store so stacks survive across hook re-instantiations.
// Safe because only one editor is ever mounted at a time.
const pageStacks: Partial<Record<PageId, PageStack>> = {};

function getStack(pageId: PageId): PageStack {
  if (!pageStacks[pageId]) {
    pageStacks[pageId] = { snapshots: [], pointer: -1 };
  }
  return pageStacks[pageId]!;
}

// Whether the next Craft.js state-change event should be ignored.
// We set this true while we're deserializing (undo/redo) so we don't
// push the restored snapshot onto the stack as a new entry.
let _ignoreNextChange = false;

export function usePageHistory(currentPage: PageId) {
  const { actions, query } = useEditor();

  // Track the last serialized state so we can detect real changes
  const lastSerializedRef = useRef<string>("");
  const currentPageRef = useRef<PageId>(currentPage);
  const isApplyingRef = useRef(false); // true while undo/redo deserialization runs

  // Keep currentPageRef in sync
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // ── Subscribe to Craft.js state changes ───────────────────────────────────
  // We watch via a polling useEffect on the serialized nodes.
  // useEditor's selector fires on every state update.
  const { nodes } = useEditor((state) => ({ nodes: state.nodes }));

  useEffect(() => {
    // Skip if we're mid-undo/redo (we caused this change ourselves)
    if (isApplyingRef.current) return;

    let serialized: string;
    try {
      serialized = query.serialize();
    } catch {
      return;
    }

    // Skip if nothing actually changed
    if (serialized === lastSerializedRef.current) return;
    lastSerializedRef.current = serialized;

    const page = currentPageRef.current;
    const stack = getStack(page);

    // Truncate any redo history above the current pointer
    stack.snapshots = stack.snapshots.slice(0, stack.pointer + 1);

    // Push the new snapshot
    stack.snapshots.push(serialized);
    stack.pointer = stack.snapshots.length - 1;

    // Cap stack size to avoid unbounded memory use
    const MAX = 100;
    if (stack.snapshots.length > MAX) {
      const overflow = stack.snapshots.length - MAX;
      stack.snapshots.splice(0, overflow);
      stack.pointer = Math.max(0, stack.pointer - overflow);
    }
  }, [nodes, query]);

  // ── Derived can-undo / can-redo ───────────────────────────────────────────
  const stack = getStack(currentPage);
  const canUndo = stack.pointer > 0;
  const canRedo = stack.pointer < stack.snapshots.length - 1;

  // ── Apply a snapshot to the canvas ───────────────────────────────────────
  const applySnapshot = useCallback((snapshot: string) => {
    isApplyingRef.current = true;
    lastSerializedRef.current = snapshot; // prevent re-push
    try {
      actions.deserialize(snapshot);
    } catch (e) {
      console.error("[PageHistory] deserialize failed", e);
    }
    // Allow a tick for Craft.js to settle before re-enabling tracking
    requestAnimationFrame(() => {
      isApplyingRef.current = false;
    });
  }, [actions]);

  // ── Scroll + flash the affected node ─────────────────────────────────────
  const flashNode = useCallback((nodesBefore: Set<string>) => {
    requestAnimationFrame(() => {
      try {
        const nodesAfter = new Set(Object.keys(query.getSerializedNodes()));
        let targetId: string | null = null;
        for (const id of nodesAfter) { if (!nodesBefore.has(id)) { targetId = id; break; } }
        if (!targetId) for (const id of nodesBefore) { if (!nodesAfter.has(id)) { targetId = id; break; } }
        if (!targetId) {
          const sel = query.getState().events?.selected as Set<string> | undefined;
          targetId = sel ? ([...sel][0] ?? null) : null;
        }
        if (!targetId || targetId === "ROOT") return;
        const el = document.querySelector<HTMLElement>(`[data-id="${targetId}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const prev = el.style.outline;
        el.style.outline = "2px solid var(--rb-primary, #ff6a00)";
        el.style.outlineOffset = "3px";
        setTimeout(() => { el.style.outline = prev; el.style.outlineOffset = ""; }, 1200);
      } catch {}
    });
  }, [query]);

  // ── Public undo ───────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    const s = getStack(currentPageRef.current);
    if (s.pointer <= 0) return;
    s.pointer -= 1;
    const nodesBefore = new Set(Object.keys(query.getSerializedNodes()));
    applySnapshot(s.snapshots[s.pointer]);
    flashNode(nodesBefore);
  }, [applySnapshot, flashNode, query]);

  // ── Public redo ───────────────────────────────────────────────────────────
  const redo = useCallback(() => {
    const s = getStack(currentPageRef.current);
    if (s.pointer >= s.snapshots.length - 1) return;
    s.pointer += 1;
    const nodesBefore = new Set(Object.keys(query.getSerializedNodes()));
    applySnapshot(s.snapshots[s.pointer]);
    flashNode(nodesBefore);
  }, [applySnapshot, flashNode, query]);

  // ── getSnapshot: latest canvas for any page ───────────────────────────────
  const getSnapshot = useCallback((pageId: PageId): string | null => {
    const s = pageStacks[pageId];
    if (!s || s.pointer < 0) return null;
    return s.snapshots[s.pointer] ?? null;
  }, []);

  return { undo, redo, canUndo, canRedo, getSnapshot };
}