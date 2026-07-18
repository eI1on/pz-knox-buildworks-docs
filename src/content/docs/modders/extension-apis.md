---
title: Extension APIs
description: Extend Knox Buildworks with safe stage-property handlers, wall mappings, registry lookups and blueprint helpers.
---

## Stage property handlers

Register a property from a shared Lua file that loads before definitions
normalize:

~~~lua
local Properties = require("KnoxBuildworks/Definitions/Properties")

Properties.register("myaddon.powerRequirement", {
    normalize = function(value, stage, definition, addError)
        if type(value) ~= "table" then
            addError("must be an object")
            return value
        end
        if type(value.watts) ~= "number" or value.watts <= 0 then
            addError("watts must be a positive number")
        end
        return value
    end,

    applyToCursor = function(buildObj, stage, definition)
        buildObj.myAddonWatts = stage["myaddon.powerRequirement"].watts
    end,

    applyToObject = function(part, buildObj, stage, context)
        local data = part:getModData()
        data.MyKBWAddon = data.MyKBWAddon or {}
        data.MyKBWAddon.watts = stage["myaddon.powerRequirement"].watts
    end
})
~~~

| Callback | Runs | Purpose |
| --- | --- | --- |
| normalize(value, stage, definition, addError) | Definition normalization | Validate/default JSON. Non-nil return replaces stored value. |
| applyToCursor(buildObj, stage, definition) | Cursor creation | Derive cursor/build-object fields. |
| applyToObject(part, buildObj, stage, context) | Per finished part, server-authoritative | Persist custom world-object state. |

Context contains square, spriteConfig, tileIndex and isFloor. Handlers run in
sorted property-name order only when their stage has that property.
The registration name is one literal JSON key; a dot does not create nested Lua
tables, so access a namespaced key with bracket syntax as shown above.

The built-in container property is the reference:

~~~json
{
  "container": {
    "type": "crate",
    "capacity": 50
  }
}
~~~

It marks a cursor as a container and applies capacity to non-floor thumpable
parts. Player-built containers are marked explored so they do not generate
world loot.

## JSON build callbacks

A JSON-only stage may name shared Lua functions in `callbacks`. Knox resolves
the function by its namespaced path; it never executes Lua stored inside JSON.

| Hook | Runtime | Important payload |
| --- | --- | --- |
| `onIsValid` | Client preview and authoritative placement validation, once per footprint cell | `square`, `tileInfo`, `north`, `facing`, `character`, `definition`, `stage`, `placement`, `buildObject`, `tile`, `tileIndex`, `spriteName`, `x`, `y`, `z` |
| `onCreate` | Authoritative construction, after each world part is created | `thumpable`, `square`, `character`, `facing`, `north`, `definition`, `stage`, `buildObject`, `tile`, `tileIndex`, `x`, `y`, `z`; `craftRecipeData` exists only for an entity-backed native recipe |
| `timedActionOnIsValid` | Timed-action recheck | Vanilla's `square` and `facing` payload |
| `onAddToMenu` | Client catalogue filtering | `player`, `recipe`, `definition`, `stage`, `shouldShowAll` |

Do not retain the payload or `buildObject` after the callback returns. Treat
client callback results as preview feedback only; the server repeats placement
and requirement validation before construction.

JSON floors automatically receive Knox-owned `onIsValid` and `onCreate`
lifecycle handlers. Ordinary walls and window frames need no callback. Door
frame stair-connection safety is inferred from the selected sprite's tile type.
Plasterability belongs in `finishes`, `surface`, `canBePlastered`, or the
`plasterable` tag rather than an `onCreate` callback. An explicit stage callback
overrides the corresponding entity or automatic callback.

### Callback compatibility policies

An add-on that exposes a callback requiring native Java recipe data must declare
that boundary from a shared Lua file loaded before definitions are normalized:

~~~lua
local LuaCallback = require("KnoxBuildworks/Util/LuaCallback")

LuaCallback.registerPolicy("MyAddon.Build.OnCreate", {
    requiresNativeRecipe = true
})
~~~

Knox then rejects that callback on a JSON-only stage instead of allowing a late
runtime error. A policy does not load or register the callback function itself;
the named global Lua function must still exist. Use this restriction only when
the implementation actually consumes native `CraftRecipeData`. Ordinary JSON
inputs use Knox's own recorded-recipe data and should not claim native support.

## Shared module map

| Module | Key functions | Use |
| --- | --- | --- |
| Definitions/Loader | registerProvider, startAsync, loadAll, isLoading | Exceptional provider setup/loading. |
| Definitions/Registry | get, getStage, list | Look up registered normalized definitions. |
| Definitions/Resolver | resolve, resolveStage, validateChoices | Resolve base plus selected variant/material and validate choices. |
| Validation/Requirements | evaluate, getInputs, possibleItems, handModels | Read the exact normalized requirement model. |
| Validation/WallFinishes | registerWallType, entriesFor, previewSprite, statusRows | Finish mappings and status data. |
| Planning/Blueprints | create, list, get, setActive, addPlacement, addRoom, totals, exportJSON, importBlueprintItem | Blueprint model. |

Use require with the names shown above. Do not replace module tables or
monkey-patch their methods.

## Blueprint placement data

~~~json
{
  "id": "placement_...",
  "buildableId": "myaddon.stone_wall",
  "stageId": "built",
  "variantId": "",
  "materialId": "",
  "direction": 1,
  "x": 100,
  "y": 200,
  "z": 1,
  "finish": null,
  "inputChoices": {
    "fasteners": "MyAddon.Rivet"
  }
}
~~~

KBW creates/validates placements itself. Advanced code should call Blueprints
methods instead of writing directly into ModData. Server mutation checks still
enforce access, limits, radius, intersections and definition integrity.

## API boundaries

There is no generic public UI widget-registration API. Add standard content via
JSON. If a new gameplay/UI behaviour is needed, implement a small namespaced
extension with:

1. a normalized JSON property;
2. client preview/UI behaviour where needed;
3. server-side validation and final object behaviour;
4. documented multiplayer and persistence tests.

Do not use a client-only callback as authorization to create or alter world
state.
