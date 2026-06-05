# Portal S4RAS

A React-based portal application integrated with Keycloak SSO for `portal.s4ras.site`.

## Overview

- Keycloak authentication via `keycloak-js`
- Structured React pages under `src/pages`
- Shared context in `src/context`
- UI components in `src/components`

## Project structure

- `src/App.js` - root application and routing
- `src/context/KeycloakContext.js` - Keycloak provider and authentication state
- `src/pages` - page components like `Beranda`, `Akun`, `Pengumuman`, `Login`
- `src/components` - reusable UI components

## Scripts

### `npm start`

Run the app in development mode.

### `npm run build`

Build the app for production.

### `npm test`

Run tests.

## Deployment

Build the app with `npm run build` and deploy the `build` folder to your web server.

## Local CI/CD with PM2

This project includes a simple local CI/CD workflow that builds the app and restarts the `portal-prod` PM2 process after each Git commit.

To enable it:

```bash
npm run install-hooks
```

After that, every local commit will trigger:

1. `npm run build`
2. `pm2 restart portal-prod`

If `portal-prod` does not exist yet, the deploy script will start it with:

```bash
pm2 start serve --name portal-prod -- -s build -l 3000
```

You can also run deployment manually:

```bash
npm run deploy
```

## GitHub CI

A GitHub Actions workflow is included to build and test the app automatically on every push and pull request to `main`.

The workflow file is located at `.github/workflows/ci.yml`.

If you want deployment from GitHub to the server, you can extend the workflow with SSH or deploy secrets.

## Remote deployment from GitHub

A secondary workflow is included at `.github/workflows/deploy.yml`.
It builds the app on every push to `main`, copies the `build` folder to the remote server, and restarts the `portal-prod` PM2 process.

To use it, configure these GitHub repository secrets:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_TARGET_PATH`
- `SSH_PORT` (optional, default `22`)

Then push to `main` and GitHub Actions will deploy automatically.

## License

This project is available under the MIT License.
