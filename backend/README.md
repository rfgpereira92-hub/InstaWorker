AutoVenda Backend (NestJS)

Quick start

- Copy `.env.example` to `.env` and adjust values
- Install deps: `npm i`
- Run dev: `npm run start:dev`
- Run migrations: `npm run migration:run`

Environment variables

- `DATABASE_URL` Postgres connection string
- `JWT_SECRET` JWT signing secret
- `PORT` HTTP port (default 4000)

Structure

- `src/config` TypeORM DataSource and config
- `src/auth` Auth module (signup/login/JWT)
- `src/workspaces` Workspaces + settings + Instagram
- `src/products` Products + images
- `src/stories` Story batches + generation + publish
- `src/ai` AI abstraction (mocked)
- `src/storage` Storage abstraction (mocked)

