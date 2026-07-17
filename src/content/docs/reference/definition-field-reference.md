---
title: Definition field reference
description: Complete field-level reference for the schema-version 1 values consumed by the current Knox Buildworks Lua runtime.
---

This page follows the current runtime implementation in `Schema.lua`,
`Types.lua`, `StageConfig.lua`, `Requirements.lua`, `Matrix.lua`, and the
finish modules. The shipped JSON Schema catches the stable structural core;
the runtime also consumes a few compatibility and extension fields called out
below.

## Bundle

| Field | Type | Notes |
| --- | --- | --- |
| `schemaVersion` | integer | Required; currently `1`. |
| `templates` | object map | Reusable buildable fragments. Templates may extend templates. |
| `materialGroups` | object map | Reusable arrays of requirement inputs. |
| `buildables` | array | Required. Invalid entries are logged and skipped individually. |

## Buildable

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Required, unique, and limited to letters, digits, `.`, `_`, and `-`. |
| `extends` | string | Template ID; cannot name another buildable. |
| `translationKey` | string | Routed `IGUI_` name key. |
| `displayName` | string | Development fallback name. |
| `descriptionKey` | string | Preferred routed `Tooltip_` description key. |
| `description` | string | Description fallback. |
| `tooltipKey` | string | Tooltip fallback key; normalization derives one when omitted. |
| `icon`, `iconTexture` | string | Explicit texture source. |
| `iconName` | string | Entity/vanilla UI icon name. |
| `iconSprite` | string | Sprite used as icon. |
| `iconItem` | string | Item full type used as icon. |
| `category` | string | Required catalogue category. |
| `subcategory` | string | Catalogue type filter; defaults to `General`. |
| `material` | string | Convenience fallback used to create one `materialTags` entry. |
| `tags` | string array | General/runtime metadata; `plasterable` is recognized by finish discovery. |
| `materialTags` | string array | Material filter metadata. |
| `styleTags` | string array | Style/integration metadata. |
| `aliases` | string array | Alternative registry lookup IDs. |
| `allowSpriteReuse` | boolean | Suppresses a sprite-reuse warning only when every owner opts in. |
| `group` | object | `{ id, name?, translationKey?, level? }`. |
| `variants` | array | Selectable merged buildable fragments. |
| `materialOptions` | array | Selectable material-specific merged fragments. |
| `tools` | input array | Shared tools appended to every stage's requirements. |
| `placement` | object | Buildable placement defaults. |
| `construction` | object | Buildable timed-action defaults. |
| `finishes` | object | Buildable wall-surface defaults and mappings. |
| `directionalSprites` | object | W/N/E/S shorthand used when a stage has no explicit sprites. |
| `spritePattern` | object | Numeric/directional sprite generator. |
| `spritePrefix`, `spriteSuffix` | string | Pattern defaults. |
| `rotations` | array | Pattern direction order; defaults to W/N/E/S. |
| `postBuildActions` | array | Displayed as catalogue post-build guidance; not executed as callbacks. |
| `stages` | array | Required non-empty construction-stage list. |

## Stage

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Defaults to its 1-based array position as text. |
| `level` | integer | Defaults to its 1-based array position. |
| `translationKey`, `labelKey` | string | Routed stage name key. |
| `displayName`, `label` | string | Stage name fallbacks. |
| `previousStage` | string or array | Accepted predecessor entity/buildable/stage names. |
| stage icon fields | string | Same icon fields as the buildable; stage values win. |
| `health` | number | Base maximum health. |
| `skillBaseHealth` | number | Health contribution tied to required skill. |
| `bonusHealth` | number | Sandbox-scaled bonus construction health. |
| `xp` | object map | Stage perk-to-XP awards; wins over construction XP. |
| `object` | object | Finished object/cursor flags listed below. |
| `callbacks` | object | Named Lua callback paths. |
| `lightSource` | object | Buildable light behavior. |
| `allowSpriteReuse` | boolean | Stage-level shared-sprite opt-in. |
| `finishes` | object | Stage finish override. |
| `finishOptions` | array | Additional visible `WallFinish` choices; not a generic action API. |
| `canBePlastered` | boolean | Runtime plasterability marker. |
| `entityCompat` | object | Only `module?` and required `entity`. |
| `sprites` | object | Direction map including optional `_open` entries. |
| `geometry` | object | Directional layer/row/cell matrix. |
| `footprints` | object | Legacy normalized cell lists; prefer `geometry`. |
| stage sprite shorthands | mixed | `directionalSprites`, `spritePattern`, and `rotations` are runtime-consumed stage overrides. |
| `requirements` | object | Inputs, materials, tools, skills, and knowledge. |
| `placement` | object | Stage placement override merged over buildable placement. |
| `construction` | object | Stage construction override merged over buildable construction. |
| `container` | object | Built-in registered property: `{ type?, capacity? }`. |
| custom property | any | Runs only when a shared Lua handler registered that exact stage key. |

Unknown fields are preserved by JSON and the Studio, but they have no gameplay
behavior unless Knox core or a registered property handler consumes them.

## Requirement input

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable manual-choice/blueprint key. Strongly recommended. |
| `role` | enum | `material`, `tool`, `consumable`, `component`, or `resource`. |
| `mode` | enum | `consume`, `keep`, `drain`, or `destroy`. |
| `resourceType` | enum | `Item`, `Fluid`, or `Energy`; current active consumption supports Item rows. |
| `label`, `labelKey` | string | Fallback and translated row label. |
| `icon` | string | UI icon override. |
| `items` | string array | Exact item full types. |
| `tags` | string array | Item-tag alternatives. Items and tags are alternatives, not cumulative. |
| `amount` | number | Item count; defaults to 1. |
| `amountMax` | number | Range/display metadata, not randomized consumption. |
| `uses` | number | Drainable uses. |
| `flags` | string array | Item state, hand-prop, degradation, and recipe-data flags. |
| `materialTags` | string array | UI/filter metadata. |

`requirements.inputs` comes first, followed by `requirements.materials`,
buildable `tools`, then stage `requirements.tools`. `materials` may be an
inline input array or the name of a material group.

## Requirement set

| Field | Type | Notes |
| --- | --- | --- |
| `inputs` | input array | Preferred complete input rows. |
| `materials` | input array or string | Inline rows or a material-group reference. |
| `tools` | input array | Stage-specific tool rows. |
| `skills` | object map | Perk ID to minimum level. |
| `recipes` | string array | Required known recipe names. |
| `knowledge.recipes` | string array | Additional recipe gates. |
| `knowledge.sources` | string array | UI source metadata. |
| `knowledge.needToBeLearned` | boolean | `false` displays the recipe without blocking an unknown recipe. |
| `debugOnly` | boolean | Blocks outside debug mode. This gate is checked separately from Build Cheat. |

## Placement

| Field | Type | Notes |
| --- | --- | --- |
| `kind` | enum | `object`, `wall`, `floor`, `stairs`, `overlay`, or `wallCovering`. |
| `requiresFloor` | boolean | Requires a floor at the target. |
| `maxDistance` | number | Positive Knox-specific cap; omit for normal cursor/path behavior. |
| `againstWall`, `needToBeAgainstWall` | boolean | Require matching wall support. |
| `dontNeedFrame` | boolean | Allows applicable door-like placement without a frame. |
| `needWindowFrame` | boolean | Requires an empty compatible window frame. |
| `isPole` | boolean | Uses pole/wall support behavior. |
| `wallCoveringType` | enum | `plaster`, `paint`, `paintThump`, `wallpaper`, or `paintSign`. |
| `sign` | integer/string | Standalone paint-sign variant. |

## Construction

| Field | Type | Notes |
| --- | --- | --- |
| `time` | number | Non-negative action duration. |
| `timedAction` | string | Registered Build 42 timed-action script name. |
| `sound`, `completionSound` | string | Explicit looping/completion sounds. |
| `actionAnim` | string | Explicit action animation. |
| `animVariable` | object | Required string `key` and `value`. |
| `canWalk` | boolean | Whether walking is allowed during the action. |
| `category` | string | Recipe/category metadata. |
| `tags` | string array | Includes runtime-relevant tags such as `CanBeDoneInDark`. |
| `xp` | object map | Perk-to-XP awards. |

## Object, callbacks, and light

`object` supports `isThumpable`, `isProp`, `dismantable`, `blockAllSquare`,
`canPassThrough`, `hoppable`, `canBarricade`, `canBePadlocked`, `thumpDamage`,
`breakSound`, `cornerSprite`, `buildLow`, and `drawFloorGrid`.

`callbacks` supports `onAddToMenu`, `onCreate`, `onIsValid`, and
`timedActionOnIsValid`. Values are namespaced Lua function paths, never code
strings. `onAddToMenu` receives the player's persisted **Show all versions**
choice as `shouldShowAll`.

`lightSource` requires `radius >= 1` plus at least one of `item`, `tags`, or
`debugItem`. It also supports `fuel` and directional `offsets` containing
`x`, `y`, and `z`.

## Geometry

`geometry.faces` accepts W, N, E, and S. A face contains `layers`; each layer
contains `rows`; each row contains cells. Layers may carry `x`, `y`, and `z`
offsets even though the current static schema does not enumerate all three.

| Cell token | Normalized meaning |
| --- | --- |
| sprite string | Visible blocking cell. |
| `false` | Gap; no cell. |
| `true` | Invisible blocking cell. |
| object | `sprite?`, `empty?`, `blocks?`, `kind?`, `properties?`, `dx?`, `dy?`, `dz?`. |

Cell `kind` may be `object`, `wall`, `floor`, or `overlay` for planning
intersection behavior. The same normalized cells drive cursor previews,
blueprint ghosts, conflicts, and construction.

## Finish configuration

`finishes` supports `enabled`, `wallType`, paint/wallpaper allowlists,
`surface`, and `mapping`. Surface fields are `canPlaster`, `canPaint`,
`canWallpaper`, `paintRequiresPlaster`, and `wallpaperRequiresPlaster`.
Mappings support `plaster`, `paints`, `wallpapers`, `directPaints`,
`directWallpapers`, `baseSprites`, and optional surface metadata.

Read [Plaster, paint and wallpaper](../../modders/finishes/) before defining a
custom wall type; standalone wall-covering actions have a separate selection
and validation path.

## Merge behavior

Knox recursively merges map-like tables. A **non-empty** array replaces the
inherited array. Because the current Kahlua merge detects arrays with
`value[1]`, an empty JSON array is treated as a map-like table and does not
clear an inherited non-empty array. Avoid relying on `[]` as a clearing
operator.

Resolution order is template inheritance, buildable, selected variant, then
selected material option. Stage placement and construction maps are then
merged over their buildable-level maps. An option with a non-empty `stages`
array replaces the complete stage list.
