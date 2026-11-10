# Britefoto Store (React + Vite)

The Britefoto photo-paper storefront as a React 18 + Vite app, with a new
editorial hero section. Everything else (catalogue, mega menu, search with
suggestions, shop filters and sorting, product pages, cart drawer with bulk
discounts, checkout with validation, bulk/contact forms) works as before.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Where things live

```
src/
  main.jsx                 boot: procedural images, --logo var, global CSS
  App.jsx                  layout + hash router (#shop, #product-<id>, #checkout ...)
  context/StoreContext.jsx routing, cart (saved to localStorage), filters, drawers, toast, checkout draft
  data/catalog.js          finishes, sizes, GSM bands, products, prices, states
  lib/helpers.js           formatting, filtering/sorting, cart maths
  lib/scenes.js            procedural landscape images used on pack mockups
  components/
    hero/Hero.jsx          NEW editorial hero
    hero/hero.css          hero styles (Playfair Display + DM Sans, royal blue)
    hero/photos.js         hero photography (swap for your own images here)
    Header.jsx, Footer.jsx, Overlays.jsx (cart + menu drawers, toast), ui.jsx
  pages/                   Home, Shop, Product, Checkout, Done, Bulk/About/Contact
  styles/global.css        the existing Britefoto design system
```

## Hero photography

`src/components/hero/photos.js` uses Unsplash images (free under the Unsplash
licence). To use your own, drop files in `public/hero/` and replace the
`photo(...)` entries with `{ src: '/hero/landscape.jpg', alt: '...', fallback: 1 }`.
If an image fails to load, the print falls back to a built-in procedural scene.
