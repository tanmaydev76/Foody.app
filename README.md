# Foody – Food Delivery App (Frontend)

A production-grade Next.js 14 (App Router) frontend for a food delivery app, with:

- Header & Footer with logo, navigation, theme toggle, cart icon
- Landing page (hero, categories, popular items, app promo)
- Menu page with 50 food items, search, category filter & veg-only filter
- Cart with quantity controls, delivery fee & GST calculation (INR)
- Checkout with delivery form, payment method selection & order success screen
- Offers and About pages
- Light & Dark theme (toggle in header, persisted to localStorage)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Generate a ZIP of the project

From the parent directory of `foody/`:

```bash
zip -r foody.zip foody -x "foody/node_modules/*" "foody/.next/*"
```
