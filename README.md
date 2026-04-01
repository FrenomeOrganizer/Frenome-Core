# Frenome Core

Frenome Core is the foundational web application for `Frenome.org`, an open-source AGI standards body focused on interoperable protocols, transparent governance, and accountable collaboration.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev -- --hostname 127.0.0.1 -p 3001
```

Open [http://127.0.0.1:3001](http://127.0.0.1:3001).

## Local Database

This project uses PostgreSQL with Prisma.

Start the local database with Docker Compose:

```bash
docker compose up -d
```

The default local connection string is configured in `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/frenome_core?schema=public"
```

Apply the initial Prisma migration:

```bash
unset npm_config_devdir && npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
unset npm_config_devdir && npx prisma generate
```

Useful database commands:

```bash
docker compose logs -f postgres
docker compose down
docker compose down -v
```

## Project Structure

- `app/`: Next.js App Router UI
- `prisma/schema.prisma`: Frenome PostgreSQL data model
- `prisma.config.ts`: Prisma 7 datasource configuration
- `compose.yaml`: Local PostgreSQL service

## Notes

- Prisma 7 reads the datasource URL from `prisma.config.ts`, not from `schema.prisma`.
- If npm prints a `devdir` warning in older shells, open a fresh terminal session before running Prisma commands.
