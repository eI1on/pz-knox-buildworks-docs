---
title: Translations and add-on packaging
description: Route Project Zomboid translation keys correctly, organize definition files, declare dependencies, and ship a deterministic Knox add-on.
---

## Translation routing

Knox sends player-facing text through Project Zomboid's `getText` lookup.
Build 42 routes a key to a translation file by its prefix:

| Content | Key prefix | English file |
| --- | --- | --- |
| Buildable, group, stage, variant, material, category, and requirement labels | `IGUI_` | `media/lua/shared/Translate/EN/IG_UI.json` |
| Descriptions and tooltips | `Tooltip_` | `media/lua/shared/Translate/EN/Tooltip.json` |

Do not put routed keys in an add-on-named file. A valid-looking key in
`MyAddon.json` is not loaded into the `IGUI_` or `Tooltip_` route.

Use ASCII-safe, namespaced, stable keys:

~~~json
{
  "translationKey": "IGUI_ExampleAddon_ReinforcedWall",
  "descriptionKey": "Tooltip_ExampleAddon_ReinforcedWall",
  "displayName": "Reinforced Wall",
  "description": "A reinforced wall for exposed positions."
}
~~~

Keep the key unchanged when the English text changes. Never derive a stable
machine ID or translation key from localized display text.

## Which localization field is used

| JSON field | Runtime use |
| --- | --- |
| `translationKey` | Buildable, group, stage, variant, or material-option name. |
| `descriptionKey` | Preferred translated catalogue description. Falls back to `description`. |
| `tooltipKey` | Tooltip fallback when no description is available; may reuse a vanilla `Tooltip_` key. |
| `labelKey` | Requirement or selectable-option label. |
| `displayName`, `description`, `label`, `name` | Development fallback text. |

If `translationKey` is omitted, normalization derives
`IGUI_KBW_Buildable_<sanitized-id>`. If `tooltipKey` is omitted it derives
`Tooltip_KBW_Buildable_<sanitized-id>`. Those defaults are valid, but an
add-on-owned prefix is easier to manage and less likely to collide.

Category, subcategory, and material-filter labels can use Knox's conventional
fallback keys:

~~~text
IGUI_KBW_Category_<ASCII-safe category>
IGUI_KBW_Subcategory_<ASCII-safe subcategory>
IGUI_KBW_MaterialTag_<ASCII-safe material tag>
~~~

Skill names use the game's `IGUI_perks_<perk-id>` translations.

## Recommended file organization

Use several focused bundles instead of one very large JSON file:

~~~text
media/KnoxBuildworks/
├── manifest.json
└── definitions/
    ├── templates.json
    ├── walls.json
    ├── floors.json
    ├── furniture.json
    └── workstations.json
~~~

The manifest can list any organization you choose:

~~~json
{
  "schemaVersion": 1,
  "definitions": [
    "media/KnoxBuildworks/definitions/templates.json",
    "media/KnoxBuildworks/definitions/walls.json",
    "media/KnoxBuildworks/definitions/furniture.json"
  ]
}
~~~

Templates and material groups are collected before buildables normalize, so a
buildable can reference a template declared in another listed bundle.
Names are global across every active Knox provider: namespace templates,
material groups, buildables, aliases, groups, and translations.

Later template declarations with the same name replace earlier ones and log a
warning. Material-group names also share the global loader map. A duplicate
buildable ID is not an override: the later registration is skipped. Use the
per-save override system for intentional server-specific balance changes.

## Manifest and integrity consequences

Each manifest definition path is read relative to the versioned mod root and
must include `media/`. The registry identity includes:

- schema version;
- every successfully read source key (`modId:path`) and its raw-text hash;
- the raw override-file hash, or `none`.

The source entries are sorted before the composite identity is calculated, but
manifest order still affects loader replacement and duplicate behavior. Keep
both paths and order deterministic. Whitespace changes alter a file's raw hash.

The current hash is a deterministic 32-bit rolling content hash implemented in
plain Kahlua-compatible arithmetic. It is not CRC32 or Adler-32. Treat the
value as an identity token, not a cryptographic signature.

## Dependencies and `mod.info`

~~~ini
name=Example Buildworks Pack
id=ExampleKBWPack
versionMin=42.0
require=KnoxBuildworks,ExampleTilePack,ExampleItems
~~~

Declare every mod that supplies referenced sprites, items, tags, entities, or
Lua callbacks. A locally installed dependency is not enough if it is absent
from a dedicated server or another player's active mod list.

## Release folder

~~~text
ExampleKBWPack/
└── 42/
    ├── mod.info
    └── media/
        ├── KnoxBuildworks/
        │   ├── manifest.json
        │   └── definitions/*.json
        ├── lua/shared/Translate/EN/
        │   ├── IG_UI.json
        │   └── Tooltip.json
        ├── lua/shared/ExampleKBWPack/
        └── scripts/                     # only when custom native entities exist
~~~

Use UTF-8 JSON, two-space indentation, no comments, and a trailing newline.
Do not ship local absolute paths, game/decompiled source, or vanilla sprite
sheets. The [Add-on Studio](../../studio/overview/) can generate the manifest,
translation files, `mod.info`, validation report, and complete add-on ZIP.

## Before publishing

Validate syntax and the shipped schema, then test every stage/variant/material
combination in single-player and multiplayer. A browser or schema cannot prove
sprite availability, Lua callback behavior, native entity lifecycle,
pathfinding, or server load order. Use the full
[testing and release checklist](../testing-and-release/).
