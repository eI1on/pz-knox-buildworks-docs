---
title: Plaster, paint and wallpaper
description: Extend normal wall finishes or define safe standalone wall-covering actions for custom tile packs.
---

## Two supported finish paths

1. Build a normal plasterable wall with a selected final finish.
2. Use a standalone wall-covering action on an existing wall.

Do not treat finishOptions as a universal arbitrary action system. It can add
visible choices, but a new finish type needs a server-validated implementation.

## Normal plasterable walls

Mark a stage plasterable with one of:

- canBePlastered true;
- a definition tag named plasterable;
- imported BuildRecipeCode.canBePlastered.OnCreate metadata;
- finishes.enabled true.

Vanilla wall types wall, doorframe, windowsframe and pillar are bridged from
Build 42 Painting and WallPaper tables. Tile packs can use an inline map:

~~~json
{
  "canBePlastered": true,
  "finishes": {
    "wallType": "myaddon.limestone",
    "paints": ["PaintWhite", "PaintRed"],
    "wallpapers": ["Wallpaper_GreenDiamond"],
    "mapping": {
      "plaster": {
        "W": "my_walls_01_10",
        "N": "my_walls_01_11"
      },
      "paints": {
        "PaintWhite": {
          "W": "my_walls_01_12",
          "N": "my_walls_01_13"
        }
      },
      "wallpapers": {
        "Wallpaper_GreenDiamond": {
          "W": "my_walls_01_16",
          "N": "my_walls_01_17"
        }
      }
    },
    "surface": {
      "canPlaster": true,
      "canPaint": true,
      "canWallpaper": true,
      "paintRequiresPlaster": true,
      "wallpaperRequiresPlaster": true
    }
  }
}
~~~

Finishes.enabled false disables finishes even if another plasterable marker
exists. Omit paints/wallpapers to allow every mapped name. Set one to false to
disable that selection family.

## Surface capabilities and direct finishes

Paint and wallpaper require plaster by default. A tile pack can opt a surface
out independently without changing planner code:

~~~json
{
  "finishes": {
    "wallType": "myaddon.sealed_masonry",
    "surface": {
      "canPlaster": true,
      "canPaint": true,
      "canWallpaper": false,
      "paintRequiresPlaster": false,
      "wallpaperRequiresPlaster": true
    },
    "mapping": {
      "plaster": { "W": "smooth_01_0", "N": "smooth_01_1" },
      "paints": {
        "PaintWhite": { "W": "smooth_01_2", "N": "smooth_01_3" }
      },
      "directPaints": {
        "PaintWhite": { "W": "sealed_rough_01_2", "N": "sealed_rough_01_3" }
      },
      "wallpapers": {}
    }
  }
}
~~~

`directPaints` and `directWallpapers` are optional. When omitted, the normal
paint/paper mapping is reused. This allows a surface to offer both a direct
rough finish and an optional plastered/smooth finish. Knox stores `wallType`
on Knox-built objects, so mappings continue to resolve after construction.

For map objects or walls created by another framework, give the tile a matching
`PaintingType` property or register its sprites from shared Lua:

~~~lua
WallFinishes.registerWallType("myaddon.sealed_masonry", {
    baseSprites = { "my_walls_01_0", "my_walls_01_1" },
    surface = { paintRequiresPlaster = false },
    paints = {},
    directPaints = {
        PaintWhite = { W = "sealed_rough_01_2", N = "sealed_rough_01_3" }
    }
})
~~~

KBW previews the final mapping, builds the wall, then queues plaster before
paint or wallpaper. The requirements are:

| Finish | Tools | Used item uses |
| --- | --- | --- |
| Plaster | plastering trowel | plaster bucket |
| Paint | paintbrush | selected paint |
| Wallpaper | paintbrush and scissors | selected wallpaper plus wallpaper paste |

## Register a map from Lua

Register a custom mapping in shared Lua when many stages use the same wall
type:

~~~lua
local WallFinishes = require("KnoxBuildworks/Validation/WallFinishes")

WallFinishes.registerWallType("myaddon.limestone", {
    plaster = {
        W = "my_walls_01_10",
        N = "my_walls_01_11"
    },
    paints = {
        PaintRed = {
            W = "my_walls_01_14",
            N = "my_walls_01_15"
        }
    },
    wallpapers = {}
})
~~~

Then a stage needs only a finishes.wallType value plus optional allowlists.
Register shared data on server and client.

## Standalone wall-covering actions

~~~json
{
  "placement": {
    "kind": "wallCovering",
    "requiresFloor": false,
    "wallCoveringType": "paintThump"
  },
  "stages": [
    {
      "id": "paint",
      "entityCompat": {
        "module": "Base",
        "entity": "Paint_Wall"
      }
    }
  ]
}
~~~

| Type | Selection | Validation |
| --- | --- | --- |
| plaster | none | plastering trowel and plaster bucket |
| paintThump | paintType | paintbrush and selected paint |
| paintSign | paintType and sign | paintbrush, selected paint, sign 32-36 |
| wallpaper | wallpaperType | paintbrush, selected paper, paste and scissors |

When an entity reference is present, Knox reads `WallCoveringConfig.type` and
the sign variant from the registered entity script. Do not mirror that
component in JSON. `placement.wallCoveringType` remains a Knox planning hint
and must agree with the referenced script. KBW currently validates only these
four action kinds.

Standalone plaster, paint and wallpaper entries can also be placed in a
blueprint. The planner targets one exact N/W wall edge, renders the mapped
result sprite, rejects empty/incompatible tiles, and orders plaster before
paint or wallpaper. The server rechecks the blueprint permission, target tile,
and expected completed sprite before consuming the planned action.
