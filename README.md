# Knox Buildworks Documentation

This repository contains the public documentation site for Knox Buildworks, a
Project Zomboid Build 42 construction framework. It covers player workflows,
server configuration, add-on development, the JSON definition model, runtime
integration, and the companion Add-on Studio.

The site is built with [Astro](https://astro.build/) and
[Starlight](https://starlight.astro.build/) and deploys as a static website.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Local development

```powershell
cd pz-knox-buildworks-docs
npm install
npm run dev
```

The development server prints its local address. Source content lives in
`src/content/docs`, while reusable components and styles live under `src`.

## Verification and production build

```powershell
npm run check
npm run build
npm run preview
```

The production site is written to `dist/`.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the
site whenever `main` is updated. After publishing the repository:

1. Open the repository's **Settings > Pages** page.
2. Select **GitHub Actions** as the deployment source.
3. Push to `main` or run the workflow manually from the **Actions** tab.

The Astro configuration derives the owner and repository name from GitHub
Actions, so the source does not contain a personal account name. For a custom
domain, set the `SITE` repository variable to the full site URL and set
`BASE_URL` only when the site is hosted below a nonstandard path.

## Related repositories

- `pz-knox-buildworks`: Project Zomboid mod and runtime
- `pz-knox-buildworks-addon-studio`: local-first visual add-on authoring tool

## Documentation policy

Runtime Lua is the source of truth for Knox Buildworks behavior. Update the
documentation alongside changes to the Build 42 runtime, schema, definitions,
options, or extension APIs. Clearly label browser-only previews, runtime-only
checks, native entity requirements, and features that are not yet supported.

Do not commit Project Zomboid assets, decompiled sources, local absolute paths,
or imported add-on data to this repository.
