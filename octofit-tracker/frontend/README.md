# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Environment configuration

The frontend expects `VITE_CODESPACE_NAME` to be defined before making API requests. Copy `.env.example` to `.env.local` and set the value to your GitHub Codespace name:

```bash
cp .env.example .env.local
```

Example:

```bash
VITE_CODESPACE_NAME=my-codespace-name
```

When `VITE_CODESPACE_NAME` is present, the app calls the Codespaces API using the URL format `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/...`. If it is unset, the application falls back to `http://localhost:8000/api/...`.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
