---
title: Local sources and assets
description: Select game and mod folders, index compiled tile packs and scripts, and understand the Studio's local-file and copyright boundaries.
---

Browsers cannot scan a Project Zomboid installation automatically. Every game,
tile-pack, or source folder must be selected explicitly. The Studio keeps each
selection as a removable source set so vanilla and multiple add-on sources can
be indexed together.

## Asset sources

Open **Assets** and choose **Import folder**. Selecting the game's `media`
folder is the simplest complete vanilla source because it includes texture
packs and tile-definition metadata.

The importer recursively recognizes:

- Build 42 `.pack` texture archives, versions 0 and 1;
- compiled `.tiles` definitions, versions 0 and 1;
- TileZed `*.tiles.txt` and `TileProperties.txt` exports;
- `tileDepthTextureAssignments.txt`;
- loose transparent PNG sprite sheets.

The current parsers were implemented independently from the inspected Build 42
Java and TileZed format behavior. No TileZed source or Project Zomboid asset is
copied into the application.

For compiled packs, the Studio uses each subtexture's runtime sprite name,
trimmed rectangle, offset, and original cell size. For loose PNGs it chooses
grid dimensions in this order:

1. associated tile-definition columns and rows;
2. an explicit author-selected preset or custom cell size;
3. `JUMBO_`, `JUMBOXL_`, or `JUMBOXXL_` naming conventions;
4. standard 2x (128x256) or 1x (64x128) inference.

The sprite inspector reports which rule supplied the dimensions. It does not
guess collision, wall, material, or gameplay behavior from pixels.

## Script and game-data sources

Use the source manager to add one or more folders. Useful vanilla roots include:

~~~text
ProjectZomboid/media/scripts/entities
ProjectZomboid/media/scripts/generated/entities
ProjectZomboid/media/scripts/generated/items
ProjectZomboid/media/lua
ProjectZomboid/media/lua/shared/Translate/EN
~~~

Add the equivalent folders from dependency mods when a buildable references
their sprites, items, tags, entities, callbacks, or timed actions. Removing a
source rebuilds the index so stale entries do not remain available for
autocomplete.

The source parser is static and non-executing. It can index entity blocks,
SpriteConfig faces, CraftRecipe inputs, items, tags, perks, recipes, timed
actions, and related metadata. It never executes imported Lua or entity data.

## Source precedence and conflicts

Records resolve by runtime sprite/entity/item identity, not by local path.
Later source sets may shadow earlier sources of the same kind, while all owners
remain visible as conflicts. A compiled pack subtexture is preferred over an
inferred PNG slice of the same sprite because it includes exact trim and anchor
metadata.

Do not use source order to hide a dependency mistake. Exported definitions
must still declare every supplying mod, and only the game can prove the final
active-mod load order.

## Browser support

Chromium can use the File System Access API for directory handles. When that
API is unavailable, the Studio opens a recursive directory-upload input. The
fallback may require selecting the folder again after reopening the browser.

Directory handles, when remembered at all, are browser-local. Portable
`.kbwproject.json` files contain logical references and authoring metadata, not
absolute paths or image bytes.

## Renderer boundary

The isometric preview uses the verified Build 42 2:1 projection and sprite
bottom-center/trim offsets. It supports pan, zoom, direction, Z-level capping,
grid/cell bounds, ghost opacity, origin markers, and deterministic ordering.

It intentionally does not reproduce lighting, shaders, weather, dynamic
cutaways, native depth-buffer occlusion, characters, attached animations, or
special per-object tree scaling. Treat it as geometry and sprite verification,
not an in-game screenshot generator.

