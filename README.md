# REST API with TypeScript

Production-ready REST API built with TypeScript, Express, Prisma ORM and JWT authentication.

> TypeScript · Express · Prisma · PostgreSQL · Zod · JWT · Jest · Docker

## Features
- Full TypeScript — strict mode, typed everything
- Prisma ORM with PostgreSQL
- Zod validation on all inputs
- JWT authentication with role-based access
- Jest tests with Prisma mocking
- Helmet + rate limiting security
- Docker ready

## Quick start
```bash
cp .env.example .env        # Windows: copy .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

## Run tests
```bash
npm test
```

## Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/profile | ✅ | My profile |
| GET | /api/posts | — | All posts |
| GET | /api/posts/:id | — | Single post |
| POST | /api/posts | ✅ | Create post |
| PUT | /api/posts/:id | ✅ | Update post |
| DELETE | /api/posts/:id | ✅ | Delete post |
| GET | /api/posts/mine | ✅ | My posts |

## License
