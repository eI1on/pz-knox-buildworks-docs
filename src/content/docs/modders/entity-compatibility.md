---
title: Build 42 entity compatibility
description: Reference registered Project Zomboid entity scripts without duplicating their component tags in Knox JSON.
---

## One native source of truth

`entityCompat` is an entity-script reference, not a metadata mirror. A stage
stores only the registered module and entity name:

~~~json
"entityCompat": {
  "module": "MyAddon",
  "entity": "MyDryingRack"
}
~~~

Do **not** copy `SpriteConfig`, `CraftRecipe`, `Resources`, `CraftBench`,
`CraftBenchSounds`, `DryingCraftLogic`, `SpriteOverlayConfig`,
`WallCoveringConfig`, or any other entity component into JSON. The schema
rejects additional `entityCompat` fields.

Knox resolves `MyAddon.MyDryingRack` through `ScriptManager`, reads the parsed
`GameEntityScript`, and derives the pre-construction metadata needed by the
catalogue, planner, cursor and validation code. When construction completes,
Knox passes that same script to
`GameEntityFactory.CreateIsoObjectEntity`. The engine then creates every
component declared by the entity, including multi-tile master-only components.

## Why an add-on may still contain two files

:::caution[Native components still require an entity script]
JSON can reference a registered entity, but it cannot register a new
`GameEntityScript`. A new custom workstation therefore needs:

1. one Project Zomboid entity script under `media/scripts` defining its native
   components;
2. one Knox JSON buildable defining catalogue and planning data and pointing to
   that entity.

The component tags are written only once-in the entity script.
:::

The files serve different systems:

| Source | Owns |
| --- | --- |
| PZ entity script | Native components and their lifecycle: sprites, recipe, resources, workbench logic, sounds, overlays, fluids, context actions and synchronization. |
| Knox JSON | Knox identity, category/search metadata, grouping, variants, optional overrides, custom placement rules and finish mappings. |

For a vanilla entity, do not copy its script. Reference the existing `Base`
entity. For a custom entity, use a unique module and entity name so it cannot
collide with vanilla or another add-on.

## Complete custom workstation example

Register the native entity once:

~~~text
module MyAddon
{
    entity MyDryingRack
    {
        component UiConfig
        {
            xuiSkin = default,
            entityStyle = ES_MyDryingRack,
            uiEnabled = true,
        }
        component Resources
        {
            group craft_inputs
            {
                craft_inputs_0 = Item@Input@20,
            }
            group craft_outputs
            {
                craft_outputs_0 = Item@Output@20@StackAny,
            }
        }
        component CraftBenchSounds
        {
            AddInput = DryingRackPlantsInsert,
            RemoveInput = DryingRackPlantsRemove,
            StartCraft = DryingRackPlantsCraft,
        }
        component DryingCraftLogic
        {
            Recipes = MyDryingRecipes,
            StartMode = Manual,
            inputGroup = craft_inputs,
            outputGroup = craft_outputs,
            actionAnim = Untie_High,
        }
        component SpriteConfig
        {
            health = 150,
            skillBaseHealth = 10,
            face S
            {
                layer
                {
                    row = myaddon_drying_01_0,
                }
            }
        }
        component CraftRecipe
        {
            timedAction = BuildByTyingHigh,
            time = 50,
            category = Farming,
        }
    }
}
~~~

The Knox stage can contain only the reference:

~~~json
{
  "id": "built",
  "entityCompat": {
    "module": "MyAddon",
    "entity": "MyDryingRack"
  }
}
~~~

During normalization, Knox derives the geometry, directional/open sprites,
health, skill health, recipe inputs, item tags, input flags, uses/counts,
required skills and learned-recipe gate from `MyAddon.MyDryingRack`. Those
values feed the catalogue, planner, cursor and server validation without being
stored in the JSON file.

### Optional Knox overrides

You may still place `geometry`, `sprites`, health/XP fields, `requirements`,
`object`, `callbacks`, `lightSource`, `placement` or `construction` beside
`entityCompat` when Knox must intentionally see a value different from the
native entity script. Explicit JSON wins; omitted portions continue to come
from the entity. This is an override mechanism, not a requirement and not a
reason to copy the whole script.

## What Knox derives from the reference

Knox reads these values directly from the parsed entity script when needed:

- `SpriteConfig`: health, skill health, thumpable/prop flags, frame rules,
  predecessor stages, callbacks, corner and break sound, padlock support,
  light-source settings, full face/layer/row geometry and open-state sprites;
- `CraftRecipe`: timed action, time, category, tags, learning flag, tooltip,
  icon, walkability, XP awards, `OnAddToMenu`, inputs, item tags, input flags,
  drainable uses, tools, required skills and recipe knowledge;
- `WallCoveringConfig`: plaster, paint, sign or wallpaper action and sign
  variant;
- declared component types, used to verify that the engine instanced the
  expected native components.

Other components do not need Lua mirrors. After construction the engine runs
them directly:

- `Resources` creates all declared resource groups and slots;
- `CraftBench`, `CraftLogic`, `DryingCraftLogic`, `FurnaceLogic` and related
  logic retain their recipe queries, channels, groups and simulation;
- `CraftBenchSounds` retains all mappings such as `AddInput`, `RemoveInput`,
  `StartCraft`, `AddFuel`, `LightFire` and `Running`;
- `SpriteOverlayConfig` retains styles, faces, layers, progress thresholds and
  recipe overlay mapping;
- `FluidContainer`, `ContextMenuConfig`, durability and other declared
  components are created by the same native factory path.

The derived compatibility view is cached in memory. It is not written back to
JSON and is not serialized into blueprint files. The bundled vanilla
definitions use this compact reference-only form as well.

## Validation and failure behavior

At definition load, Knox rejects a stage when:

- `entityCompat.entity` is missing or empty;
- `module` is present but invalid;
- an extra field is placed inside `entityCompat`;
- the referenced `module.entity` is not registered.

After construction, Knox compares the components on the built object with the
components declared by the entity script. Multi-tile slave cells are handled
using the component script's native `isoMasterOnly` rule.

## When no entity reference is needed

`entityCompat` is not required for custom materials, tools, consumables,
skills, learned recipes, sprites, directional or multi-tile geometry, stages,
variants, health, XP, placement rules, build sounds/animations, Lua placement
callbacks, light sources, containers or Knox wall finishes. Those are all
supported directly by the JSON construction path.

| Buildable | Use |
| --- | --- |
| Ordinary object fully handled by Knox data | JSON only; omit `entityCompat`. |
| Existing vanilla component-backed object | JSON plus a reference to `Base.EntityName`. |
| New custom component-backed object | Custom entity script plus JSON reference. |

See [JSON-only buildables](../json-only-buildables/) for the full field list,
complete example and the precise boundary between Knox-owned construction data
and native engine components.

## Entity-hydrated callbacks

Callbacks are not themselves native components. JSON-only stages can declare
the same named Lua paths explicitly under `stage.callbacks`; no entity script
is required merely to call `OnIsValid` or `OnCreate`. Entity-backed stages
instead inherit these names from `SpriteConfig` unless JSON deliberately
overrides them. See the JSON-only floor lifecycle under
[JSON-only buildables](../json-only-buildables/#reusing-vanilla-construction-callbacks).

`SpriteConfig.OnIsValid` is resolved from the entity script and receives the
same Knox compatibility payload used by the placement validator:

~~~lua
{
    square = targetSquare,
    tileInfo = { getSpriteName = ..., isBlocking = ... },
    north = boolean,
    canBuildOverWater = false,
    testCollisions = true,
    facing = "w" | "n" | "e" | "s"
}
~~~

`SpriteConfig.OnCreate` is also resolved from the entity script and receives:

~~~lua
{
    thumpable = builtPart,
    craftRecipeData = nativeCraftRecipeData,
    character = player,
    facing = "w" | "n" | "e" | "s"
}
~~~

When the JSON stage leaves `requirements.inputs` omitted, Knox uses the
referenced entity's real `CraftRecipe` through Build 42 `BuildLogic`. Native
selection, consumption, recipe callbacks, destroy/used-item processing and the
real Java `CraftRecipeData` are therefore available to `SpriteConfig.OnCreate`,
including callbacks such as the vanilla barricade handler.

That distinction is mandatory for `BuildRecipeCode.barricade.OnCreate`. It
calls a Java method whose parameter type is the native `CraftRecipeData` class.
If `requirements.inputs` overrides the entity recipe, Knox supplies its Lua
compatibility object instead and rejects construction before consumption.
Other specialized `BuildRecipeCode` callbacks may still depend on exact
sprites, object types, global definitions, or world systems; an available
callback name is not automatically portable.

If a stage intentionally overrides `requirements.inputs`, Knox uses its custom
input rules and supplies the Lua compatibility recipe-data object documented
under [JSON-only buildables](../json-only-buildables/). That object is suitable
for Lua inspection but is not accepted by Java methods typed specifically as
`CraftRecipeData`.
