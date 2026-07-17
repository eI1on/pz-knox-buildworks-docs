---
title: "Tutorial: creating buildables"
description: A progressive, fully worked walkthrough from a one-stage object to templates, staged construction, grouped families and container storage.
---

This tutorial builds one add-on step by step and explains *why* each field
exists. Every example uses only fields the Knox loader actually understands;
[Add-on quickstart](../quickstart/) covers the surrounding mod folder,
manifest and translations. Use [JSON definition format](../definitions/) for
the model explanation and the
[definition field reference](../../reference/definition-field-reference/) for
the exhaustive runtime-consumed field list.

This tutorial covers JSON-driven buildables. A new workstation or other object
that requires native B42 entity components cannot be implemented by this JSON
alone. It must also have a uniquely named Project Zomboid entity script and an
`entityCompat` reference; read [Build 42 entity compatibility](../entity-compatibility/)
before starting that kind of add-on. Component tags, native sprite geometry and
craft requirements are defined once in the entity script. The JSON stage needs
only its module and entity name, plus any intentional Knox-only overrides.

For ordinary construction, the entity script is optional. JSON alone supports
custom materials/tools, stages, geometry, placement, health, XP, sounds,
animations, callbacks, light sources, containers and Knox wall finishes. The
full surface is listed in [JSON-only buildables](../json-only-buildables/).

## Step 0 - what you need before writing JSON

For a JSON-only buildable, collect:

1. **A unique ID** such as `myaddon.reinforced_crate`. IDs may contain
   letters, digits, `_`, `.` and `-`. Prefix everything with your add-on name;
   Knox registers by ID, never by sprite, and rejects duplicate IDs.
2. **Sprite names** for each facing direction, from your tile pack or the
   vanilla sheets (for example `carpentry_01_16`).
3. **Item full types or item tags** for requirements, such as `Base.Plank`
   or the tag `base:hammer`.
4. **A category** shown in the catalogue (`Walls`, `Floors`, `Furniture`, or
   your own).

For an entity-backed buildable, points 2 and 3 are read from the entity's
`SpriteConfig` and `CraftRecipe`; do not copy them into the JSON stage.

## Step 1 - the smallest valid buildable

A definition bundle needs `schemaVersion: 1` and a `buildables` array. A
buildable needs `id`, `category` and at least one stage with sprites:

~~~json
{
  "schemaVersion": 1,
  "buildables": [
    {
      "id": "myaddon.reinforced_crate",
      "displayName": "Reinforced Crate",
      "category": "Furniture",
      "subcategory": "Storage",
      "placement": { "kind": "object" },
      "construction": { "time": 150, "sound": "HammeringIn" },
      "stages": [
        {
          "id": "built",
          "sprites": {
            "W": "carpentry_01_16",
            "N": "carpentry_01_17"
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
                "amount": 3
              },
              {
                "id": "nails",
                "role": "material",
                "mode": "consume",
                "items": ["Base.Nails"],
                "amount": 6
              }
            ]
          }
        }
      ]
    }
  ]
}
~~~

List the file in your `media/KnoxBuildworks/manifest.json` and it appears in
the catalogue under Furniture > Storage.

## Step 2 - what the loader fills in for you

Knox normalizes every definition before registering it, so several fields are
optional:

| You omit | Knox uses |
| --- | --- |
| `translationKey` | `IGUI_KBW_Buildable_<id>` with non-alphanumerics replaced by `_` |
| `tooltipKey` | `Tooltip_KBW_Buildable_<id>` in the same pattern |
| `subcategory` | `General` |
| `materialTags` | a single entry copied from `material`, if set |
| stage `id` | the stage's position (`"1"`, `"2"`, ...) |
| stage `level` | the stage's position as a number |

Translation keys must start with a prefix the game routes: the engine's
getText only checks the translation map matching the key prefix, so a display
name key must start with `IGUI_` (loaded from `Translate/<LANG>/IG_UI.json`)
and a tooltip key with `Tooltip_` (from `Translate/<LANG>/Tooltip.json`). A
key with any other prefix never resolves, in any language. Reusing a vanilla
key (for example `Tooltip_craft_kilnSmallDesc`) is fine and inherits every
vanilla localization.

Normalization also *verifies* the definition: every referenced item full type
must exist in the loaded game scripts, every skill name must be a real perk,
every requirement row must offer at least one item or tag, and every stage
must end up with sprites. Failures are logged with the exact stage and field,
and the definition is skipped rather than crashing the catalogue - so keep
the Knox debug log open while iterating (Mod Options > Knox Buildworks >
Debug).

## Step 3 - requirement inputs in depth

Each entry in `requirements.inputs` describes one row of the requirement
panel:

| Field | Values | Meaning |
| --- | --- | --- |
| `role` | `material`, `tool`, `consumable`, `component`, `resource` | How the row is presented and grouped. |
| `mode` | `consume`, `keep`, `drain`, `destroy` | Consumed on build, kept, drained by `uses`, or recorded as a destroyed input. |
| `items` | array of full types | Exact accepted items. |
| `tags` | array of item tags | Any item carrying the tag is accepted - prefer tags when vanilla uses them. |
| `amount` | number > 0 | How many are needed. |
| `uses` | number > 0 | Charges taken from a drainable. |
| `flags` | array | Build 42 flags such as `Prop1` or `MayDegradeVeryLight` for equip/degrade behaviour. |
| `label`, `labelKey`, `icon` | strings | Optional fallback label, routed label translation, and icon overrides. |

When an input accepts several items or a tag, players see all alternatives in
the *Available Ingredients / Possible Items* drawer and may select one
specific full type. That choice travels with the build request, and the
server re-validates it against this same input - an arbitrary item can never
be smuggled through the UI.

## Step 4 - share boilerplate with templates and material groups

Bundles may declare `templates` (merged into any buildable that `extends`
them) and `materialGroups` (named requirement lists referenced by name).
Templates may extend other templates; cycles are detected and rejected.

~~~json
{
  "schemaVersion": 1,
  "templates": {
    "myaddonWood": {
      "category": "Furniture",
      "material": "wood",
      "placement": { "kind": "object" },
      "construction": { "time": 150, "sound": "HammeringIn" },
      "tools": [
        {
          "id": "hammer",
          "role": "tool",
          "mode": "keep",
          "tags": ["base:hammer"],
          "flags": ["Prop1", "MayDegradeVeryLight"]
        }
      ]
    }
  },
  "materialGroups": {
    "crateBase": [
      { "id": "planks", "role": "material", "mode": "consume", "items": ["Base.Plank"], "amount": 3 },
      { "id": "nails", "role": "material", "mode": "consume", "items": ["Base.Nails"], "amount": 6 }
    ]
  },
  "buildables": [
    {
      "id": "myaddon.reinforced_crate",
      "extends": "myaddonWood",
      "displayName": "Reinforced Crate",
      "subcategory": "Storage",
      "stages": [
        {
          "id": "built",
          "sprites": { "W": "carpentry_01_16", "N": "carpentry_01_17" },
          "requirements": { "materials": "crateBase" }
        }
      ]
    }
  ]
}
~~~

`requirements.materials` accepts either a string (a material-group name,
resolved at load time) or an inline array of inputs. Definition-level `tools`
from the template apply to construction without repeating them per stage.
Use stable IDs even though the runtime can generate positional fallbacks; the
IDs persist manual ingredient choices in cursors and blueprint placements.

## Step 5 - staged construction

Multiple stages turn one buildable into upgradeable construction - a frame
that later becomes a finished piece. `level` orders the stages and
`previousStage` states what the upgrade builds on:

~~~json
"stages": [
  {
    "id": "frame",
    "level": 1,
    "sprites": { "W": "carpentry_01_14", "N": "carpentry_01_15" },
    "requirements": { "materials": "crateBase" }
  },
  {
    "id": "reinforced",
    "level": 2,
    "previousStage": "frame",
    "sprites": { "W": "carpentry_01_16", "N": "carpentry_01_17" },
    "health": 400,
    "skillBaseHealth": 60,
    "requirements": {
      "inputs": [
        { "id": "sheetmetal", "role": "material", "mode": "consume", "items": ["Base.SheetMetal"], "amount": 2 },
        { "id": "screws", "role": "material", "mode": "consume", "items": ["Base.Screws"], "amount": 8 }
      ],
      "skills": { "Woodwork": 3 }
    }
  }
]
~~~

`skills` maps perk names to required levels; names must match real Build 42
perks (`Woodwork`, `MetalWelding`, ...). `health` and `skillBaseHealth`
control the object's durability and the per-skill-level bonus.

## Step 6 - grouped families

Separate buildables can present as **one catalogue entry with a level
carousel** - how the vanilla shoddy/poor/good wall qualities are grouped.
Each member declares the same group ID:

~~~json
{
  "id": "myaddon.crate_shoddy",
  "extends": "myaddonWood",
  "group": { "id": "myaddon.crate", "name": "Reinforced Crate", "level": 1 },
  "stages": [ ... ]
},
{
  "id": "myaddon.crate_sturdy",
  "extends": "myaddonWood",
  "group": { "id": "myaddon.crate", "name": "Reinforced Crate", "level": 2 },
  "stages": [ ... ]
}
~~~

Members are ordered by `group.level`, and the catalogue shows the group
`name` with a stage carousel selecting the member. Grouping changes only
presentation - each member stays an independent, individually validated
buildable.

## Step 7 - sprite shorthands

Explicit `sprites` win, but two shorthands save repetition. A
`spritePattern` with `start` numbers rotations along the sheet
(default rotation order `W`, `N`, `E`, `S`):

~~~json
"spritePattern": { "prefix": "myaddon_tiles_01_", "start": 4, "step": 1 }
~~~

produces `myaddon_tiles_01_4` through `myaddon_tiles_01_7`. Alternatively a
`directions` map names each token explicitly:

~~~json
"spritePattern": {
  "prefix": "myaddon_tiles_01_",
  "directions": { "W": 4, "N": 5 }
}
~~~

Doors and gates may add `W_open` / `N_open` sprite keys for their open
state. Multi-tile footprints and full 3D geometry matrices are covered in
[Geometry, stages, groups and variants](../geometry-and-groups/).

## Step 8 - make it store items

Stage properties add behaviour to the finished object. The built-in
`container` property turns the crate into working storage:

~~~json
{
  "id": "built",
  "sprites": { "W": "carpentry_01_16", "N": "carpentry_01_17" },
  "container": { "type": "crate", "capacity": 50 },
  "requirements": { "materials": "crateBase" }
}
~~~

Player-built containers are marked explored, so they never spawn world loot.
Add-ons can register their own namespaced stage properties with validation
and server-side apply logic - see [Extension APIs](../extension-apis/).

## Step 9 - variants and material options

`variants` and `materialOptions` are option lists the player picks in the
catalogue's *Variant* and *Material set* dropdowns. Each option merges over
the base definition and may carry its own `stages`; Knox normalizes option
stages with the same rules as base stages. Use variants for visual styles of
one thing, material options for "the same thing built from other materials".
The full model, including how the resolver merges selections, is documented
in [Geometry, stages, groups and variants](../geometry-and-groups/).

## Step 10 - test it

1. Enable ElyonLib, Knox Buildworks, your add-on, and any tile/item mods it
   uses.
2. Turn on Knox debug logging and watch for `stage ... references missing
   item`, `has no sprites`, or `unknown template` messages.
3. In the catalogue, confirm category/subcategory, icon, translations, the
   stage carousel (if grouped/staged) and requirement rows.
4. Build it: cursor rotation, placement rules, material consumption, tool
   retention, XP, and the finished object's health and behaviour.
5. For containers: open the built object, add and remove items, and reload
   the save.
6. Repeat the construction test on a dedicated server - the server
   revalidates everything, and definition files must match the server's hash
   exactly.

The full release checklist lives in
[Testing and release](../testing-and-release/).
