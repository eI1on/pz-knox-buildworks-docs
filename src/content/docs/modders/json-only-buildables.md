---
title: JSON-only buildables
description: Build custom Knox objects without an entity script, including materials, tools, stages, geometry, placement, callbacks, light sources and timed actions.
---

## The short answer

Yes: an add-on can define a complete ordinary buildable using only Knox JSON.
`entityCompat` is optional. A JSON-only buildable can have custom sprites,
multi-tile geometry, stages, variants, materials, tools, consumables, skill and
knowledge gates, placement rules, health, XP, sounds, animations, callbacks,
light-source behavior, containers and wall finishes.

An entity script is required only when the finished object needs a native
engine component such as `Resources`, `CraftBench`, `CraftLogic`,
`DryingCraftLogic`, `CraftBenchSounds`, `SpriteOverlayConfig`,
`FluidContainer` or `ContextMenuConfig`.

:::tip[Choose the smallest sufficient model]
Start with JSON only. Add `entityCompat` only when the object actually needs an
engine-owned component. Custom materials or custom tile packs do not, by
themselves, require an entity script.
:::

## Complete JSON-only example

This example deliberately has no `entityCompat`:

~~~json
{
  "schemaVersion": 1,
  "buildables": [
    {
      "id": "myaddon.work_lamp",
      "translationKey": "IGUI_MyAddon_WorkLamp",
      "tooltipKey": "Tooltip_MyAddon_WorkLamp",
      "category": "Lighting",
      "subcategory": "Standing lights",
      "materialTags": ["Metal", "Electrical"],
      "tags": ["indoor", "light"],
      "iconItem": "Base.Torch",
      "placement": {
        "kind": "object",
        "requiresFloor": true,
        "maxDistance": 10
      },
      "construction": {
        "time": 120,
        "timedAction": "BuildWallMetal",
        "sound": "BuildMetalStructureMedium",
        "completionSound": "BuildMetalStructureMedium",
        "actionAnim": "BlowTorchFloor",
        "animVariable": {
          "key": "BuildType",
          "value": "Low"
        },
        "canWalk": false,
        "category": "Welding",
        "tags": ["CanBeDoneInDark"],
        "xp": {
          "MetalWelding": 12
        }
      },
      "stages": [
        {
          "id": "built",
          "health": 180,
          "skillBaseHealth": 15,
          "bonusHealth": 40,
          "object": {
            "isThumpable": true,
            "dismantable": true,
            "blockAllSquare": false,
            "canPassThrough": true,
            "canBePadlocked": false,
            "thumpDamage": 8,
            "breakSound": "BreakObject",
            "buildLow": true,
            "drawFloorGrid": true
          },
          "callbacks": {
            "onAddToMenu": "MyAddon.BuildLamp.OnAddToMenu",
            "onIsValid": "MyAddon.BuildLamp.OnIsValid",
            "timedActionOnIsValid": "MyAddon.BuildLamp.TimedActionOnIsValid",
            "onCreate": "MyAddon.BuildLamp.OnCreate"
          },
          "lightSource": {
            "radius": 8,
            "item": "Base.Torch",
            "tags": ["base:flashlight"],
            "fuel": "Battery",
            "debugItem": "Base.Torch",
            "offsets": {
              "N": { "x": 0, "y": 0, "z": 0 },
              "E": { "x": 0, "y": 0, "z": 0 },
              "S": { "x": 0, "y": 0, "z": 0 },
              "W": { "x": 0, "y": 0, "z": 0 }
            }
          },
          "requirements": {
            "inputs": [
              {
                "id": "welder",
                "role": "tool",
                "mode": "keep",
                "tags": ["base:weldingmask"],
                "flags": ["Prop1"]
              },
              {
                "id": "torch",
                "role": "tool",
                "mode": "drain",
                "items": ["Base.BlowTorch"],
                "uses": 2,
                "flags": ["Prop2", "MayDegradeVeryLight"]
              },
              {
                "id": "bars",
                "role": "material",
                "mode": "consume",
                "items": ["Base.MetalBar", "MyAddon.ReinforcedBar"],
                "amount": 2
              },
              {
                "id": "wire",
                "role": "material",
                "mode": "consume",
                "tags": ["myaddon:electrical_wire"],
                "amount": 1
              },
              {
                "id": "battery",
                "role": "component",
                "mode": "consume",
                "items": ["Base.Battery"],
                "amount": 1
              }
            ],
            "skills": {
              "MetalWelding": 3,
              "Electricity": 2
            },
            "knowledge": {
              "needToBeLearned": true,
              "recipes": ["Make Work Lamp"],
              "sources": ["MyAddon.WorkLampMagazine"]
            }
          },
          "geometry": {
            "faces": {
              "S": {
                "layers": [
                  { "rows": [["myaddon_lights_01_0"]] }
                ]
              },
              "W": {
                "layers": [
                  { "rows": [["myaddon_lights_01_1"]] }
                ]
              },
              "N": {
                "layers": [
                  { "rows": [["myaddon_lights_01_2"]] }
                ]
              },
              "E": {
                "layers": [
                  { "rows": [["myaddon_lights_01_3"]] }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
~~~

The example demonstrates the available surface; omit fields that do not apply.
Templates and material groups should hold repeated data in production add-ons.
The distributable mod also includes
`media/KnoxBuildworks/json-only-buildable.example.json`, which is intentionally
not listed in the manifest and can be copied into an add-on project.

## Vanilla construction features represented in Knox JSON

Knox uses semantic JSON groups instead of reproducing the entity-component
syntax. The following features work for JSON-only stages:

| Vanilla source concept | Knox JSON | Runtime behavior |
| --- | --- | --- |
| `SpriteConfig` faces, layers and rows | `stage.geometry.faces` | Directional 2D/3D matrix, empty cells and multi-tile placement. |
| Directional and open sprites | `stage.sprites`, `directionalSprites`, `spritePattern` | W/N/E/S previews and `W_open`/`N_open` object sprites. |
| `health` | `stage.health` | Base maximum health. |
| `skillBaseHealth` | `stage.skillBaseHealth` | Extra health per relevant skill level. |
| `bonusHealth` | `stage.bonusHealth` | Sandbox-scaled construction bonus. |
| `previousStage` | `stage.previousStage` | One predecessor name or an array of accepted predecessors. |
| thumpable/prop/padlock/corner/break flags | `stage.object` | Configures the Knox-built world object. |
| frame, pole and wall rules | `placement` | Server-authoritative placement validation. |
| `OnAddToMenu`, `OnCreate`, `OnIsValid`, `TimedActionOnIsValid` | `stage.callbacks` | Named Lua callback integration using the documented Knox payload. |
| light radius, source item/tag, fuel and face offsets | `stage.lightSource` | Creates a light source on the built thumpable. |
| `CraftRecipe.time` | `construction.time` | Build timed-action duration. |
| `CraftRecipe.timedAction` | `construction.timedAction` | Imports action animation, variables, hand models and sounds from a registered timed-action script. |
| build/completion sounds | `construction.sound`, `construction.completionSound` | Explicit sound overrides. |
| animation fields | `construction.actionAnim`, `construction.animVariable` | Explicit build animation override. |
| `CanWalk` | `construction.canWalk` | Controls whether walking/running cancels the queued build action. |
| recipe category and tags | `construction.category`, `construction.tags` | Catalogue metadata, including `CanBeDoneInDark` and `AnySurfaceCraft`. |
| recipe XP awards | `stage.xp` or `construction.xp` | Server-applied perk XP after a successful build. Stage XP wins. |
| recipe inputs | `requirements.inputs` | Items and tags, alternatives, counts, uses, keep/consume/drain/destroy modes and input flags. |
| required skills and learning | `requirements.skills`, `requirements.knowledge` | Catalogue status plus authoritative validation. |
| UI name, tooltip and icon | buildable/stage translation and icon fields | Localized catalogue and planning presentation. |

These are Knox-owned equivalents. They do **not** register a native
`SpriteConfig` or `CraftRecipe` component on the finished object.

## Object configuration

`stage.object` accepts:

| Field | Effect |
| --- | --- |
| isThumpable | Sets the construction object's thumpable behavior flag. |
| isProp | Places a moveable-style world prop rather than a normal built thumpable. |
| dismantable | Marks the built object as dismantleable. Defaults to true. |
| blockAllSquare | Overrides full-square placement blocking. |
| canPassThrough | Overrides walk-through behavior. |
| hoppable | Overrides the hoppable flag after sprite-property discovery. |
| canBarricade | Overrides automatic door/window barricade support. |
| canBePadlocked | Enables padlock support. |
| thumpDamage | Damage dealt while thumping. |
| breakSound | Sound used when the object breaks. |
| cornerSprite | Corner sprite used by vanilla corner checks. |
| buildLow | Uses the low build animation when no explicit animation is selected. |
| drawFloorGrid | Enables or disables the floor placement grid. |

Sprite properties still supply automatic collision, door, window, floor,
stairs, stackability and barricade discovery. Explicit object fields override
the corresponding derived flags where supported.

## Placement configuration

`placement` may be declared on the buildable and overridden by a stage:

| Field | Effect |
| --- | --- |
| kind | `object`, `wall`, `floor`, `stairs`, `overlay` or `wallCovering`. |
| requiresFloor | Require an existing floor. Floors themselves use adjacency support instead. |
| maxDistance | Optional Knox-specific maximum placement distance. Omit it to use normal cursor/path behavior. |
| againstWall / needToBeAgainstWall | Require a supporting wall in the facing direction. |
| dontNeedFrame | Allows a door-like sprite without an existing door frame. |
| needWindowFrame | Requires an empty window frame on the selected edge. |
| isPole | Uses vanilla pole/wall support rules. |
| wallCoveringType | `plaster`, `paint`, `paintThump`, `wallpaper` or `paintSign`. |
| sign | Sign index/name for a paint-sign covering definition. |

## Construction metadata

`construction` may also be overridden per stage. If `timedAction` names a
registered Build 42 timed-action script, Knox reads its action animation,
animation variable, tool props, looping sound and completion sound. Explicit
JSON values win over those defaults.

`construction.tags` uses the same strings shown by the vanilla recipe UI. For
example, `CanBeDoneInDark` removes the “requires light” indicator and allows
authoritative construction while the player is in reading-level darkness.
`AnySurfaceCraft` currently advertises surface behavior in the catalogue. A
tag is metadata unless Knox documents a runtime check for it.

Input `flags` are the construction-safe subset documented under
[Requirements, items and tags](../requirements-and-tags/). Generic
`CraftRecipe` input/output inheritance flags that require native
`CraftRecipeData` are not simulated by JSON construction.

## Callback contract

Callbacks are names such as `MyAddon.BuildObject.OnIsValid`; they are not code
strings. `onAddToMenu` controls catalogue visibility and receives `player`,
`definition`, `stage`, `shouldShowAll`, and `recipe` (the native recipe object
when an entity reference exists, otherwise nil). `shouldShowAll` follows the
player's **Show all versions** tick box; do not hardcode your callback around
one value.

`onIsValid` receives:

~~~lua
{
    square = targetSquare,
    tileInfo = tileInfoAdapter,
    north = boolean,
    canBuildOverWater = false,
    testCollisions = true,
    facing = "w" | "n" | "e" | "s"
}
~~~

It may return false to reject placement and may set `canBuildOverWater` or
`testCollisions` on the payload. `onCreate` receives:

~~~lua
{
    thumpable = builtPart,
    craftRecipeData = recipeData,
    character = player,
    facing = "w" | "n" | "e" | "s"
}
~~~

For JSON-only inputs, `craftRecipeData` is a Lua compatibility object populated
from the concrete items Knox selected and consumed. It supports the
construction-facing query methods `getRecipe`, `getCharacter`,
`getAllInputItems`, `getAllConsumedItems`,
`getAllRecordedConsumedItems`, `getAllKeepInputItems`, `getInputItems`,
`getAllInputItemsWithFlag`, `getFirstInputItemWithFlag`,
`getFirstInputItemWithTag`, and `getAllDestroyInputItems`. Returned item lists
are Java `ArrayList` objects, matching the list shape used by vanilla Lua.

This compatibility object is intended for Lua callbacks. It is not a Java
`CraftRecipeData` instance and cannot be passed to a native Java method whose
signature explicitly requires that class. Use an entity-backed native recipe
for that case. Put custom callbacks in shared Lua when both placement preview
and server validation need them. Callbacks remain server-authoritative and
must be deterministic.

## What JSON alone cannot create

The following are native engine components, not ordinary construction fields:

- resource channels, slots and synchronization from `Resources`;
- workstation lifecycle from `CraftBench`, `CraftLogic`,
  `DryingCraftLogic`, `FurnaceLogic` and related logic components;
- state-driven mappings from `CraftBenchSounds` such as `AddInput`,
  `RemoveInput`, `StartCraft`, `AddFuel`, `LightFire` and `Running`;
- engine-managed progress layers and mappings from `SpriteOverlayConfig`;
- native fluid storage, context-menu component behavior, power/energy
  channels and component-specific networking.
- generic native crafting execution such as recipe outputs, mappers, batch
  crafting, `OnTest`, `OnStart`, `OnUpdate`, `OnFailed` and callbacks that
  require `CraftRecipeData`.

To use those features, register one entity script and point the stage to it
with `entityCompat`. Do not copy the component data into JSON. See
[Build 42 entity compatibility](../entity-compatibility/).

## JSON-only or entity-backed?

| Requirement | Recommended form |
| --- | --- |
| Custom sprite, materials, tools, skills, stages or multi-tile shape | JSON only. |
| Custom placement callback, light source, health, XP or build animation | JSON only. |
| Container capacity handled by Knox | JSON only with `stage.container`. |
| Plaster, paint or wallpaper mapping handled by Knox | JSON only with `finishes`. |
| Existing vanilla workstation or complex entity | JSON plus `entityCompat`. |
| New custom workstation with native resource/logic/overlay components | Entity script plus a compact JSON reference. |
