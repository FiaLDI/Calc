# Backend

Express API on TypeScript for user products, diary entries, auth, and XML data transfer.

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
- `POST /api/v1/products`
- `POST /api/v1/products/import`
- `GET /api/v1/products/:id`
- `GET /api/v1/product-sources`
