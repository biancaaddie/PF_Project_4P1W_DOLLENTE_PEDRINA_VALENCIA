# Iteration 6 Launch Checklist

This checklist covers polish, QA, and demo readiness for the current build.

## Demo Seed Accounts

- Player: `player@4pics.dev` / `Player123!`
- Admin: `admin@4pics.dev` / `Admin123!`

These users are seeded automatically by `auth-api` startup when the in-memory DB is empty.

## What Was Polished

- Guess input normalization is enforced on submit flow.
- Request validation added on auth and resource DTOs.
- Basic rate limits added for auth endpoints and gameplay/public reads.
- Player UI now has clearer loading/error/empty handling for packs/profile/play.
- Login and register pages now prevent double-submit and show progress labels.

## Local Smoke Test Steps

1. Run `auth-api`.
2. Run `resource-api`.
3. Run `web-app`.
4. Log in as player and verify:
   - Packs page loads randomized published packs.
   - Play page allows answer submit and score updates.
   - Completed pack shows restart and back-to-packs options.
   - Profile shows progress and recent puzzles.
5. Log in as admin and verify:
   - Admin pages are accessible.
   - CMS write actions are protected by admin role.

## CI

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Pipeline includes:
  - `dotnet restore/build` for `auth-api`
  - `dotnet restore/build` for `resource-api`
  - `npm ci`, `npm test`, and `npm run build` for `web-app`
