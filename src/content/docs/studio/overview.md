---
title: Add-on Studio
description: Use the local-first visual IDE to author, validate, preview, and export Knox Buildworks add-ons without hand-editing every JSON file.
---

Knox Buildworks Add-on Studio is a separate static web application maintained
in the companion `pz-knox-buildworks-addon-studio` repository. It creates the
same schema-version 1 manifests and definition bundles documented in the
add-on guides; it is not a second runtime format.

The application runs entirely in the browser. It does not require an account,
backend, database, or asset service. Selected game and mod files remain local,
and generated projects never embed Project Zomboid sprite pixels or absolute
machine paths.

## What it edits

- projects, definition-file organization, and manifest order;
- templates and material groups;
- buildables, stages, grouped families, variants, and material options;
- directional, multi-tile, irregular, and multi-level geometry;
- items, tags, tools, consumables, skills, knowledge, and input flags;
- placement, construction, object properties, callbacks, lights, and containers;
- normal-wall and standalone plaster, paint, and wallpaper data;
- compact `entityCompat` references and read-only entity metadata;
- English `IG_UI.json` and `Tooltip.json` translations;
- raw JSON with a synchronized resolved/effective preview.

It can export individual project data, a portable `.kbwproject.json`, a
validation report, or a deterministic complete Build 42 add-on ZIP.

## What it does not do

The Studio does not execute Lua, register native entity components, write
Project Zomboid `.tiles` files, or reproduce the complete game renderer. It
does not generate custom entity scripts in the current release. A browser
preview cannot prove pathfinding, collision flags, native component lifecycle,
callback behavior, or multiplayer load order.

Use it as an authoring and static-validation tool, then test the exported mod
inside Project Zomboid.

## Run it locally

Clone or download the Add-on Studio repository, then run it from the repository
root:

~~~powershell
cd pz-knox-buildworks-addon-studio
npm install
npm run dev
~~~

Vite prints the local URL. Node.js 22 or newer is required. A Chromium-based
browser offers the best directory-selection API; other browsers use recursive
file-input fallbacks.

For a production build:

~~~powershell
npm run check
npm run build
npm run preview
~~~

The static output is written to `dist/` and uses relative assets, so it can be
hosted at a GitHub Pages project subpath.

## Recommended first project

1. Create a project with a stable Mod ID and short ASCII namespace.
2. Add the game `media` folder as an asset source if you need vanilla sprites.
3. Add vanilla or mod script folders as reference sources for items, tags,
   entities, recipes, perks, and timed actions.
4. Create one JSON-only object with two directions and three input rows.
5. Add routed English name and description keys.
6. Validate, export the ZIP, and test it in a clean Build 42 save.

Continue with [Local sources and assets](../local-sources/) and the
[authoring workflow](../authoring-workflow/).

:::caution[Local data stays local]
Do not commit or deploy imported vanilla sprite sheets, compiled packs,
decompiled source, or extracted game data. The Studio indexes them only in the
current local browser context.
:::
