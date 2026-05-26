import { useEffect, useRef, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { PageId } from "~/lib/pagesConfig";

/**
 * usePageHistory
 *
 * Gives each page tab its own independent undo/redo stack that survives
 * page switches. Works by:
 *
 * 1. On every Craft.js state change, snapshot the current serialized canvas
 *    AND the current history pointer into per-page refs.
 *
 * 2. On page leave: save the full canvas snapshot for the leaving page.
 *
 * 3. On page arrive: Craft.js has already loaded the new page via Frame remount.
 *    We clear the fresh (empty) history so undo/redo only covers edits made
 *    on this page in this session.
 *
 * The undo/redo stacks are maintained by Craft.js itself — we just keep
 * per-page canvas snapshots so switching back to a page restores its
 * in-progress edits (even unsaved ones).
 *
 * NOTE: The canvas snapshot ref is passed up to EditorInner so it can feed
 * the correct snapshot into <Frame data={}> on page arrival, instead of
 * always falling back to the server/localStorage content.
 */

export interface PageHistoryHandle {
  /** Get the latest in-memory snapshot for a page (unsaved edits included) */
  getSnapshot: (pageId: PageId) => string | null;
}

export function usePageHistory(currentPage: PageId) {
  const { actions, query, canUndo, canRedo } = useEditor((_, q) => ({
    canUndo: q.history.canUndo(),
    canRedo: q.history.canRedo(),
  }));

  // Per-page canvas snapshots — updated on EVERY state change, not just on leave.
  // This means switching back to a page always restores the latest in-progress edits.
  const canvasSnapshots = useRef<Partial<Record<PageId, string>>>({});
  const prevPage = useRef<PageId | null>(null);

  // ── Continuously snapshot the current page on every Craft.js state change ──
  // We subscribe via useEditor's selector — any node change re-runs this effect.
  const { serializedNodes } = useEditor((state) => ({
    // Trigger re-render whenever nodes change so we can snapshot
    serializedNodes: state.nodes,
  }));

  useEffect(() => {
    // Keep the snapshot for the current page fresh at all times
    try {
      canvasSnapshots.current[currentPage] = query.serialize();
    } catch {
      // Editor not ready yet
    }
  }, [serializedNodes, currentPage, query]);

  // ── Page-switch effect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (prevPage.current === null) {
      prevPage.current = currentPage;
      return;
    }

    if (prevPage.current === currentPage) return;

    // Page has changed. The Frame remount (key={pageId} in EditorInner) has
    // already loaded the arriving page's content. Clear the history so
    // undo/redo only covers edits made on THIS page from THIS moment.
    //
    // Defer by one tick so Frame finishes initialising before we clear.
    const raf = requestAnimationFrame(() => {
      try {
        actions.history.clear();
      } catch {
        // Safe to ignore during unmount
      }
    });

    prevPage.current = currentPage;
    return () => cancelAnimationFrame(raf);
  }, [currentPage, actions]);

  // ── Scroll + flash helper ──────────────────────────────────────────────────
  const scrollToChangedNode = useCallback(
    (nodesBefore: Set<string>) => {
      requestAnimationFrame(() => {
        try {
          const nodesAfter = new Set<string>(
            Object.keys(query.getSerializedNodes())
          );

          let targetId: string | null = null;

          for (const id of nodesAfter) {
            if (!nodesBefore.has(id)) { targetId = id; break; }
          }
          if (!targetId) {
            for (const id of nodesBefore) {
              if (!nodesAfter.has(id)) { targetId = id; break; }
            }
          }
          if (!targetId) {
            const state = query.getState();
            const selected = state.events?.selected as Set<string> | undefined;
            targetId = selected ? ([...selected][0] ?? null) : null;
          }

          if (!targetId || targetId === "ROOT") return;

          const el = document.querySelector<HTMLElement>(`[data-id="${targetId}"]`);
          if (!el) return;

          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const prevOutline = el.style.outline;
          const prevOffset = el.style.outlineOffset;
          el.style.outline = "2px solid var(--rb-primary, #ff6a00)";
          el.style.outlineOffset = "3px";
          setTimeout(() => {
            el.style.outline = prevOutline;
            el.style.outlineOffset = prevOffset;
          }, 1200);
        } catch {
          // query may throw if editor is mid-transition
        }
      });
    },
    [query]
  );

  // ── Public undo / redo ─────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (!canUndo) return;
    const nodesBefore = new Set<string>(Object.keys(query.getSerializedNodes()));
    actions.history.undo();
    scrollToChangedNode(nodesBefore);
  }, [canUndo, actions, query, scrollToChangedNode]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const nodesBefore = new Set<string>(Object.keys(query.getSerializedNodes()));
    actions.history.redo();
    scrollToChangedNode(nodesBefore);
  }, [canRedo, actions, query, scrollToChangedNode]);

  // ── Expose snapshot accessor ───────────────────────────────────────────────
  const getSnapshot = useCallback(
    (pageId: PageId): string | null =>
      canvasSnapshots.current[pageId] ?? null,
    []
  );

  return { undo, redo, canUndo, canRedo, getSnapshot };
}