# RetailBox Builder

A constrained visual storefront editor built on [Craft.js](https://craft.js.org/) + Next.js (Pages Router) + TypeScript.

Customers build custom storefronts for their RetailBox stores using a drag-and-drop block editor — but only within boundaries you define. No custom code, no plugins, no arbitrary components.

---

## Stack

| Layer | Tech |
|---|---|
| Editor engine | [Craft.js](https://craft.js.org/) `^0.2.x` |
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Inline styles + global CSS (no extra CSS-in-JS dep) |
| Persistence | `localStorage` (swap for API later) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/editor/home`.

---

## Project Structure

```
retailbox-builder/
├── components/
│   ├── blocks/              # Craft.js blocks (each has component + settings panel)
│   │   ├── AnnouncementBar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── NewsletterSignup.tsx
│   │   ├── StubBlocks.tsx   # ProductDetails, CartSummary, CheckoutForm, ContactForm
│   │   └── RootContainer.tsx
│   └── editor/              # Editor UI chrome
│       ├── Toolbar.tsx       # Top bar: page tabs, undo/redo, save, preview
│       ├── ComponentPanel.tsx # Left sidebar: block palette
│       └── SettingsPanel.tsx  # Right sidebar: selected block settings
├── lib/
│   ├── pagesConfig.ts       # ⭐ Core constraint system — pages + allowed blocks
│   ├── craftResolver.ts     # Maps component names → components (for serialization)
│   └── storage.ts           # Save/load page JSON (localStorage today, API tomorrow)
├── pages/
│   ├── _app.tsx
│   ├── index.tsx            # Redirects to /editor/home
│   ├── editor/[pageId].tsx  # Main editor page
│   └── preview/[pageId].tsx # Read-only preview
└── styles/
    └── editor.css           # Global styles + settings form styles
```

---

## The Constraint System

The core of the "restrictive but extensible" design lives in **`lib/pagesConfig.ts`**.

### Adding a new block to a page

```ts
// lib/pagesConfig.ts
export const PAGE_ALLOWED_BLOCKS: Record<PageId, string[]> = {
  home: [
    'AnnouncementBar',
    'HeroBanner',
    'ProductGrid',
    'NewsletterSignup',
    'ContactForm',
    'TestimonialRow',  // ← just add the name here
  ],
  ...
};
```

### Adding a new block type

1. Create `components/blocks/MyBlock.tsx` with the component + settings panel + `.craft` config
2. Add it to `lib/craftResolver.ts`
3. Add its label + icon to `lib/pagesConfig.ts`
4. Add it to the allowed list for whichever pages should have it

That's it. No other changes needed.

---

## Persistence

Currently uses `localStorage` — fine for development and early demos.

To switch to a real backend, edit `lib/storage.ts`:

```ts
// Replace savePageData / loadPageData with API calls:
export async function savePageData(pageId: PageId, json: string): Promise<void> {
  await fetch(`/api/storefront/${storeId}/pages/${pageId}`, {
    method: 'PUT',
    body: JSON.stringify({ content: json }),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

The Craft.js serialized format is plain JSON — store it in any column (TEXT / JSONB in Postgres works great).

---

## Rendering on the Live Storefront

The editor saves JSON. Your customer-facing storefront renders it read-only:

```tsx
// In your storefront app (separate Next.js/Remix app):
import { Editor, Frame, Element } from '@craftjs/core';
import { craftResolver } from '@retailbox/blocks'; // shared package

export default function StorefrontPage({ pageJson }) {
  return (
    <Editor resolver={craftResolver} enabled={false}>
      <Frame data={pageJson}>
        <Element is={RootContainer} canvas id="root" />
      </Frame>
    </Editor>
  );
}
```

The `enabled={false}` flag disables all editing — same components, zero editor overhead.

---

## Roadmap / Growth Path

| Now | Later |
|---|---|
| 5 fixed pages | Unlimited pages |
| Your blocks only | Merchant-uploaded component packs |
| No custom CSS | Expose a style manager panel |
| localStorage | PostgreSQL / Supabase |
| Asset size limits enforced at upload | Tiered plans |
| Fixed page structure | Free-form canvas |

Because Craft.js is just an engine, opening up any of the above is **additive** — you expose more, not rip anything out.
