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

## License

This project is available under the MIT License.
