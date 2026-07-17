---
title: Geometry, stages, groups and variants
description: Define directional sprite patterns, 3D multi-tile matrices, wall upgrades, grouped families, variants and material options.
---

## Directional sprites

A basic stage can use a direct W/N/E/S map:

~~~json
{
  "sprites": {
    "W": "my_tiles_01_0",
    "N": "my_tiles_01_1",
    "E": "my_tiles_01_2",
    "S": "my_tiles_01_3"
  }
}
~~~

Door/gate stages may add W_open, N_open, E_open and S_open. Missing faces
fall back to a compatible supplied direction, but all real directions should be
authored explicitly.

For regular tile sequences:

~~~json
{
  "spritePrefix": "my_tiles_01_",
  "spritePattern": {
    "start": 40,
    "step": 1
  },
  "rotations": ["W", "N", "E", "S"]
}
~~~

This yields W=40, N=41, E=42 and S=43. A pattern may instead use a direction
token map.

## Multi-tile 3D matrix

Use geometry.faces. Each face contains layers, layers contain rows, and each
row column becomes an X offset. Layer index becomes Z unless an explicit z is
provided.

~~~json
{
  "geometry": {
    "faces": {
      "S": {
        "layers": [
          {
            "rows": [
              ["my_cabinet_01_0", "my_cabinet_01_1"],
              ["my_cabinet_01_2", false]
            ]
          },
          {
            "z": 1,
            "rows": [
              [false, { "sprite": "my_cabinet_01_3", "blocks": false }]
            ]
          }
        ]
      }
    }
  }
}
~~~

| Token | Meaning |
| --- | --- |
| sprite string | Visible blocking cell. |
| false | Empty gap. |
| true | Occupied/blocking cell with no sprite. |
| object | Advanced sprite, empty, blocks, dx, dy, dz, kind and properties data. |

Layer x/y/z offsets move an entire layer. A cell dx/dy/dz is added to its
matrix position. This supports L shapes, deliberate spaces and raised pieces.
Cell kind can be floor, wall, overlay or object to control blueprint layer
conflict handling.

The normalized matrix is the one source for cursor preview, ghost rendering,
planning intersections, collisions, final construction and stack offsets.
`entityCompat` never contains geometry; it only identifies a registered entity.
For an entity-backed stage, Knox creates this same normalized matrix from the
native `SpriteConfig` faces, layers and rows. Write JSON geometry only for a
JSON-only object or as an intentional Knox override.

## Previous stages

~~~json
{
  "id": "finished",
  "previousStage": ["MyAddonWallFrame", "myaddon.wall_frame"],
  "sprites": {
    "W": "my_wall_01_4",
    "N": "my_wall_01_5"
  }
}
~~~

KBW matches vanilla entity names, KBW buildable IDs, stage IDs and compatible
entity names. The predecessor must use the same wall direction. This rule is
also used by the planning intersection/upgrade checks.

## Group related buildables

Grouping combines separate buildables into one catalogue entry:

~~~json
{
  "id": "myaddon.stone_wall_good",
  "displayName": "Stone Wall (Good)",
  "group": {
    "id": "myaddon.stone_wall",
    "name": "Stone Wall",
    "level": 3
  },
  "stages": []
}
~~~

Give every family member the same group ID and an ordered group level. Two or
more members appear in one stage carousel. Use groups for separate entities
such as shoddy/poor/good walls.

## Variants and material options

Variants/materialOptions are merged definition fragments:

~~~json
{
  "variants": [
    {
      "id": "oak",
      "displayName": "Oak bookcase",
      "stages": []
    }
  ],
  "materialOptions": [
    {
      "id": "reclaimed",
      "requirements": {
        "materials": [
          { "id": "wood", "items": ["Base.Plank"], "amount": 10 }
        ]
      }
    }
  ]
}
~~~

KBW resolves base, selected variant, then selected material option. Object maps
merge recursively; non-empty arrays replace. An option that supplies a
non-empty `stages` array replaces the base stage list. An empty array does not
clear an inherited array under the current Kahlua merge because it has no index
1. Use variants/material options for one construction whose data changes by
selection; use groups for different buildables.
