# Backend

Express API on TypeScript that aggregates products from multiple source catalogs and exposes them to the frontend.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`

## Environment

Use `.env.example` as a template:

- `PORT` default: `4000`
- `FRONTEND_ORIGIN` default: `http://localhost:3000`

## Routes

- `GET /health`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `GET /api/v1/product-sources`
