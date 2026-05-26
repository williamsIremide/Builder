import { useEffect, useRef, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { PageId } from "~/lib/pagesConfig";

/**
 * usePageHistory
 *
 * Gives each page tab its own independent undo/redo stack, and
 * auto-scrolls + flashes the affected block after every undo/redo.
 *
 * ─── WHY THE PREVIOUS APPROACH DIDN'T WORK ───────────────────────────────────
 *
 * The old hook tried to stash and restore `store.history.timeline` and
 * `store.history.pointer` — the internal patch arrays inside CraftJS.
 * This failed for two reasons:
 *
 *   1. Frame remount timing: `<Frame key={pageId}>` unmounts and remounts the
 *      entire node tree when the page changes. CraftJS re-initialises its node
 *      state *after* React's useEffect cleanup fires — so history patches saved
 *      before the remount reference node IDs that no longer exist in the new
 *      tree. Applying them corrupts the canvas, or silently rolls back the
 *      *previous* page's content instead of the current one.
 *
 *   2. Mutation doesn't propagate: `store.history` is managed through an
 *      internal Redux slice. Writing `.timeline` and `.pointer` directly bypasses
 *      the reducer, so `canUndo`/`canRedo` never update and the buttons stay stale.
 *
 * ─── CORRECT APPROACH ────────────────────────────────────────────────────────
 *
 * Instead of fighting CraftJS internals, we work *with* the Frame remount:
 *
 *   • On page leave : serialise the current canvas JSON and stash it in a ref,
 *     keyed by PageId. This is the "last known good state" for that page.
 *
 *   • On page arrive: the Frame remount has already loaded the new page's
 *     content from its `data` prop (handled by EditorRenderer/EditorInner).
 *     All we have to do is call `actions.history.clear()` so the undo stack
 *     starts fresh — edits made on *this* page, from *this moment*, only.
 *
 *   • Undo/redo: delegate entirely to CraftJS's own actions. We just wrap them
 *     with the scroll-and-flash UX on top.
 *
 * This means:
 *   - Switching pages never corrupts the canvas.
 *   - Undo/redo only affects changes made on the current page tab.
 *   - canUndo / canRedo stay perfectly in sync because CraftJS owns them.
 *
 * ─── ABOUT THE CANVAS STASH ──────────────────────────────────────────────────
 *
 * The stash (`canvasSnapshots`) is a *safety net*, not the primary persistence.
 * Your EditorRenderer already passes `data={serializedContent}` to Frame, so
 * the canvas is restored from the server/localStorage on each page switch.
 * The snapshot exists only so that *in-session unsaved edits* survive a tab
 * round-trip without requiring a server call. If you always re-fetch on switch,
 * you can remove the snapshot logic entirely.
 */

export function usePageHistory(currentPage: PageId) {
  const { actions, query, canUndo, canRedo } = useEditor((_, q) => ({
    canUndo: q.history.canUndo(),
    canRedo: q.history.canRedo(),
  }));

  // Serialised canvas JSON, keyed by PageId — persists across tab switches
  const canvasSnapshots = useRef<Partial<Record<PageId, string>>>({});
  const prevPage = useRef<PageId | null>(null);

  // ── Page-switch effect ─────────────────────────────────────────────────────

  useEffect(() => {
    if (prevPage.current === null) {
      // First mount — record which page we started on, nothing else to do
      prevPage.current = currentPage;
      return;
    }

    if (prevPage.current === currentPage) return;

    const leaving = prevPage.current;

    // 1. Stash the leaving page's current canvas state (in-memory only)
    try {
      canvasSnapshots.current[leaving] = query.serialize();
    } catch {
      // Editor may not be ready; safe to skip
    }

    // 2. The Frame remount (key={pageId} in EditorInner) has already loaded
    //    the arriving page's content. We just need to wipe the history so
    //    undo/redo only covers edits made *on this page, in this session*.
    //
    //    We defer by one tick to let the Frame finish initialising its nodes
    //    before clearing — otherwise CraftJS may record the load itself as an
    //    undoable action.
    const raf = requestAnimationFrame(() => {
      try {
        actions.history.clear();
      } catch {
        // Safe to ignore if called during an unmount
      }
    });

    prevPage.current = currentPage;

    return () => cancelAnimationFrame(raf);
  }, [currentPage, query, actions]);

  // ── Scroll + flash helper ──────────────────────────────────────────────────

  /**
   * After an undo/redo, find the node whose content changed and scroll it
   * into view with a brief orange outline flash.
   */
  const scrollToChangedNode = useCallback(
    (nodesBefore: Set<string>) => {
      requestAnimationFrame(() => {
        try {
          const nodesAfter = new Set<string>(
            Object.keys(query.getSerializedNodes())
          );

          let targetId: string | null = null;

          // First preference: a node that was added or removed (structural diff)
          for (const id of nodesAfter) {
            if (!nodesBefore.has(id)) {
              targetId = id;
              break;
            }
          }
          if (!targetId) {
            for (const id of nodesBefore) {
              if (!nodesAfter.has(id)) {
                targetId = id;
                break;
              }
            }
          }

          // Fallback: currently selected node (prop change, not structural)
          if (!targetId) {
            const state = query.getState();
            const selected = state.events?.selected as Set<string> | undefined;
            targetId = selected ? ([...selected][0] ?? null) : null;
          }

          if (!targetId || targetId === "ROOT") return;

          const el = document.querySelector<HTMLElement>(
            `[data-id="${targetId}"]`
          );
          if (!el) return;

          el.scrollIntoView({ behavior: "smooth", block: "center" });

          // Flash the border so the user sees what changed
          const prevOutline = el.style.outline;
          const prevOffset = el.style.outlineOffset;
          el.style.outline = "2px solid var(--rb-primary, #ff6a00)";
          el.style.outlineOffset = "3px";
          setTimeout(() => {
            el.style.outline = prevOutline;
            el.style.outlineOffset = prevOffset;
          }, 1200);
        } catch {
          // query may throw if the editor is mid-transition
        }
      });
    },
    [query]
  );

  // ── Public undo / redo ─────────────────────────────────────────────────────

  const undo = useCallback(() => {
    if (!canUndo) return;
    const nodesBefore = new Set<string>(
      Object.keys(query.getSerializedNodes())
    );
    actions.history.undo();
    scrollToChangedNode(nodesBefore);
  }, [canUndo, actions, query, scrollToChangedNode]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const nodesBefore = new Set<string>(
      Object.keys(query.getSerializedNodes())
    );
    actions.history.redo();
    scrollToChangedNode(nodesBefore);
  }, [canRedo, actions, query, scrollToChangedNode]);

  // ── Expose canvas snapshot for optional use ────────────────────────────────

  /**
   * Returns the last stashed canvas JSON for a given page, if any.
   * You can pass this to EditorRenderer as `content` to restore
   * in-session edits when switching back to a page.
   */
  const getSnapshot = useCallback(
    (pageId: PageId): string | null =>
      canvasSnapshots.current[pageId] ?? null,
    []
  );

  return { undo, redo, canUndo, canRedo, getSnapshot };
}