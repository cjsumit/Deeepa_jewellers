# Deepa Jewellers

A jewellery storefront built with TanStack Start, TypeScript, React, and Tailwind CSS.

## Development

Requires Node.js and npm.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Shop updates

- **WhatsApp number:** replace `91XXXXXXXXXX` in `src/lib/whatsapp.ts` with the shop's country code and phone digits.
- **Products and product photographs:** edit the 12 entries in `src/data/products.ts`. Each entry has an Unsplash image URL that can be replaced with the chosen jewellery photo.
- **Other photographs:** the hero, craft, and Instagram-style gallery photos are selected in `src/routes/index.tsx` using Unsplash photo IDs.
- **Address and visiting hours:** update the Visit section in `src/routes/index.tsx` when these details are confirmed.

The WhatsApp number, address, and visiting hours remain placeholders because the supplied brief did not include the shop's real details.
