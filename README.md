# WarmHeart

Backend / REST API for the WarmHeart e-commerce storefront — auth, product catalog and cart management on Express + Prisma.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=flat&logo=postgresql&logoColor=white)

**Frontend repo:** [WarmHeart_FE](https://github.com/metwoOSha/WarmHeart_FE)

## Highlights

- **MVC structure** — `routes/` → `controllers/` → Prisma models, with a shared `middleware/` layer for auth.
- **Prisma schema split by domain** (`prisma/models/*.prisma`) covering `Users`, `Blankets` (catalog), and `Cart`/`CartItem`.
- **Cookie-based JWT auth** — `bcrypt` password hashing, JWTs signed on register/login and set as an `httpOnly` cookie (falls back to a `Bearer` header), verified per-request in [auth.middleware.ts](src/middleware/auth.middleware.ts).
- **Neon serverless Postgres** via `@prisma/adapter-pg`, a driver adapter built for connecting to Postgres from serverless/edge runtimes.
- **CORS locked to the frontend origin** with credentials enabled, so the auth cookie flows between the two repos.

## Stack

- **Runtime:** Node.js, TypeScript (ESM)
- **Framework:** Express 5
- **ORM:** Prisma 7 (`prisma-client` generator) + `@prisma/adapter-pg`
- **Database:** PostgreSQL (Neon)
- **Auth:** `jsonwebtoken`, `bcrypt`, `cookie-parser`
- **Dev tooling:** `tsx`, `nodemon`, ESLint (flat config, `typescript-eslint`), Prettier, Husky pre-commit hook

## Project structure

```
prisma/
  models/            # schema split by domain: blankets, cart, users
  migrations/         # SQL migration history
  seed.ts             # seeds Blankets from db.json
src/
  controllers/        # auth, blankets, cart
  routes/              # auth, blankets, cart
  middleware/          # JWT auth guard
  lib/prisma.ts        # Prisma client singleton (pg adapter)
  config.ts            # env-driven config (SERVER_PORT)
  index.ts             # app entrypoint
```

## Prerequisites & running locally

- Node.js
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) instance)

**Environment variables** (`.env`):

| Variable | Description |
|---|---|
| `SERVER_PORT` | Port the Express server listens on (defaults to `3000`) |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret used to sign/verify auth JWTs |
| `NEXT_PUBLIC_APP_URL` | Frontend origin, used for the CORS allow-list |

**Setup:**

```bash
npm install

# apply migrations to your database
npx prisma migrate dev

# optional: seed the Blankets table from db.json
npm run seed

# start the dev server (tsx + nodemon, auto-reload)
npm run dev
```

Production build:

```bash
npm run build   # prisma generate && tsc
npm start       # node dist/index.js
```

## API endpoints

### `/api/auth`

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create a user, sets auth cookie | — |
| POST | `/login` | Authenticate, sets auth cookie | — |
| POST | `/logout` | Clear auth cookie | — |
| GET | `/me` | Get the current authenticated user | Required |

### `/api/blankets`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/` | List all blankets | — |
| GET | `/:id` | Get a single blanket by id | — |

### `/api/cart`

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/` | Get the current user's cart with items | Required |
| POST | `/` | Add an item to the cart (merges quantity if already present) | Required |
| PATCH | `/:id` | Update a cart item's quantity | Required |
| DELETE | `/:id` | Remove an item from the cart | Required |

## Lint & testing

```bash
npm run eslint       # lint
npm run eslint:fix   # lint with autofix
```

ESLint runs automatically on commit via Husky (`.husky/pre-commit`). No automated test suite is set up yet — `npm test` is a placeholder.
