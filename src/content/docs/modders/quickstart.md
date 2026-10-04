---
title: Add-on quickstart
description: Create a Build 42 Knox Buildworks add-on with a manifest, routed translations, and one JSON-only buildable.
---

## Create an add-on

Knox add-ons are ordinary Build 42 mods with a manifest, JSON definitions, and
translations. You can edit and validate these files with your preferred text
editor; in-game testing is still necessary.

For a normal data-only add-on you need:

1. A Build 42 mod whose `mod.info` requires `KnoxBuildworks`.
2. `media/KnoxBuildworks/manifest.json`.
3. One or more schema-version 1 definition bundles listed by the manifest.
4. English display-name entries in `IG_UI.json` and description/tooltip entries
   in `Tooltip.json`.

Knox discovers the manifest of every active mod. No Build Menu patch and no
Lua provider registration are required for ordinary add-ons.

:::caution[Native workstations need an entity script]
JSON can define ordinary construction, including custom materials, stages,
geometry, callbacks, containers, and wall finishes. It cannot register native
engine components such as `Resources`, `CraftBench`, `DryingCraftLogic`,
`CraftBenchSounds`, `SpriteOverlayConfig`, or `FluidContainer`.

For those components, define a uniquely named Project Zomboid entity under
`media/scripts`, then point the Knox stage to it with an `entityCompat` object
containing only `module` and `entity`. See
[Build 42 entity compatibility](../entity-compatibility/).
:::

## Folder layout

~~~text
MyKBWAddon/
└── 42/
    ├── mod.info
    └── media/
        ├── KnoxBuildworks/
        │   ├── manifest.json
        │   └── definitions/
        │       └── myaddon_buildables.json
        ├── scripts/
        │   └── myaddon_entities.txt       # only when native components are required
        └── lua/shared/Translate/EN/
            ├── IG_UI.json
            └── Tooltip.json
~~~

`mod.info`:

~~~ini
name=My KBW Add-on
id=MyKBWAddon
versionMin=42.0
require=KnoxBuildworks
~~~

Add every tile-pack or item mod used by the definitions to the add-on's
dependencies as well. Knox requires ElyonLib itself, so an add-on normally
depends on `KnoxBuildworks` rather than declaring a second direct ElyonLib
dependency.

## Manifest

`media/KnoxBuildworks/manifest.json`:

~~~json
{
  "schemaVersion": 1,
  "definitions": [
    "media/KnoxBuildworks/definitions/myaddon_buildables.json"
  ]
}
~~~

Manifest paths are relative to the active **versioned mod root** passed to
Project Zomboid's mod file reader. They therefore include the leading
`media/`. The loader processes the listed files in manifest order. Keep that
order stable because later template/material-group declarations can replace
earlier names, while duplicate buildable IDs are skipped.

Every successfully read definition file contributes its raw-text hash to the
multiplayer registry identity. Changing data, whitespace, a source path, or
the per-save override file can change that identity. Server and clients need
the same active providers and raw files.

## First definition bundle

`media/KnoxBuildworks/definitions/myaddon_buildables.json`:

~~~json
{
  "schemaVersion": 1,
  "buildables": [
    {
      "id": "myaddon.wooden_noticeboard",
      "translationKey": "IGUI_MyAddon_WoodenNoticeboard",
      "descriptionKey": "Tooltip_MyAddon_WoodenNoticeboard",
      "displayName": "Wooden Noticeboard",
      "description": "A simple player-built noticeboard.",
      "category": "Furniture",
      "subcategory": "Decor",
      "materialTags": ["Wood"],
      "placement": {
        "kind": "object"
      },
      "construction": {
        "time": 120,
        "sound": "HammeringIn"
      },
      "stages": [
        {
          "id": "built",
          "sprites": {
            "W": "my_tiles_01_0",
            "N": "my_tiles_01_1"
          },
          "requirements": {
            "inputs": [
              {
                "id": "hammer",
                "role": "tool",
                "mode": "keep",
                "tags": ["base:hammer"],
                "flags": ["Prop1", "MayDegradeVeryLight"]
              },
              {
                "id": "planks",
                "role": "material",
                "mode": "consume",
                "items": ["Base.Plank"],
                "amount": 4
              },
              {
                "id": "nails",
                "role": "material",
                "mode": "consume",
                "items": ["Base.Nails"],
                "amount": 8
              }
            ]
          }
        }
      ]
    }
  ]
}
~~~

Replace the sprite names with sprites supplied by an active tile pack. Use
stable, namespaced machine IDs; do not derive IDs from translated text.

## English translations

`media/lua/shared/Translate/EN/IG_UI.json`:

~~~json
{
  "IGUI_MyAddon_WoodenNoticeboard": "Wooden Noticeboard"
}
~~~

`media/lua/shared/Translate/EN/Tooltip.json`:

~~~json
{
  "Tooltip_MyAddon_WoodenNoticeboard": "A simple player-built noticeboard."
}
~~~

Project Zomboid routes translations by key prefix. `IGUI_` keys belong in
`IG_UI.json`; `Tooltip_` keys belong in `Tooltip.json`. An arbitrary file such
as `MyKBWAddon.json`, or a key without a routed prefix, will not resolve.
`displayName` and `description` are useful development fallbacks, not a
replacement for release translations. See
[Translations and packaging](../translations-and-packaging/).

## Test the result

Enable Knox Buildworks, ElyonLib, your add-on, and every supplying tile/item
mod. Turn on Knox debug logging, open the catalogue with F7, and verify:

- the bundle and buildable register without validation errors;
- the translated name, description, category, icon, and sprites resolve;
- the hammer tag and exact material items show valid alternatives;
- rotation and placement work in every authored direction;
- materials are consumed, the tool is retained, and its action prop appears;
- the same files pass a hosted or dedicated-server integrity handshake.

Continue with [JSON definition format](../definitions/) and the
[testing and release checklist](../testing-and-release/).
