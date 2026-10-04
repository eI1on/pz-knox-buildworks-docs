---
title: JSON definition format
description: Reference the bundle, buildable, stage, template, icon and construction fields used by the Knox registry.
---

## Bundle shape

Each definition file is a bundle:

~~~json
{
  "schemaVersion": 1,
  "templates": {},
  "materialGroups": {},
  "buildables": []
}
~~~

| Field | Type | Behaviour |
| --- | --- | --- |
| schemaVersion | number | Required. Must be 1. |
| templates | object | Named definition fragments used by extends. |
| materialGroups | object | Named arrays of requirement rows. |
| buildables | array | Required array of buildables. |
| other fields | any | Author metadata unless explicitly consumed by KBW. |

The shipped buildables.schema.json is an editor-validation guide. Runtime
Schema.normalize validates registry-specific requirements, item types, skill
names, directions and material groups.

## Buildable fields

| Field | Type | Behaviour |
| --- | --- | --- |
| id | string | Required unique ID. Letters, numbers, dot, underscore and hyphen. |
| extends | string | Template name. |
| translationKey | string | Display-name translation key. Must start with IGUI_ (getText routes keys by prefix); defaults to IGUI_KBW_Buildable_(id). |
| displayName | string | Fallback/debug display name. |
| description | string | Catalogue-description fallback. |
| descriptionKey | string | Preferred translated description key. Use a routed `Tooltip_` key. |
| tooltipKey | string | Tooltip/final description fallback key. Must start with `Tooltip_`; vanilla `Tooltip_craft_*` keys work and stay localized. |
| icon, iconTexture | string | Explicit texture path/name. |
| iconName | string | Vanilla/entity UI icon name. |
| iconSprite | string | Sprite icon source. |
| iconItem | string | Item icon source. |
| category | string | Required catalogue category. |
| subcategory | string | Type filter. Defaults to General. |
| material | string | Convenience source for default materialTags. |
| materialTags | array | Catalogue material filter metadata. |
| styleTags | array | General style metadata for integrations. |
| tags | array | General metadata; plasterable enables a finish discovery path. |
| aliases | array | Alternative lookup IDs. |
| allowSpriteReuse | boolean | Opt in when this definition intentionally shares sprites with other definitions that also opt in. Real unapproved collisions still warn. |
| tools | array | Requirement rows added to every stage. |
| placement | object | Knox placement and validation rules. Works without an entity script. |
| construction | object | Knox build-action time, timed-action, sound, animation, recipe metadata and XP defaults. |
| spritePattern | object | Directional sprite generation. |
| spritePrefix, spriteSuffix | string | Pattern defaults. |
| directionalSprites | object | W/N/E/S fallback sprite map. |
| rotations | array | Direction order for numeric sprite patterns. |
| variants | array | Selectable merged definition fragments. |
| materialOptions | array | Selectable merged definition fragments. |
| group | object | Related-buildable grouping. |
| postBuildActions | array | Catalogue description metadata only. |
| stages | array | Required non-empty stage array. |

When missing, KBW derives a translation key from the sanitized ID:

~~~text
IGUI_KBW_Buildable_<sanitized-id>
Tooltip_KBW_Buildable_<sanitized-id>
~~~

## Templates

Templates contain any ordinary definition field:

~~~json
{
  "templates": {
    "myaddon.wallCommon": {
      "category": "Walls",
      "subcategory": "My Mod Walls",
      "materialTags": ["Wood"],
      "placement": { "kind": "wall" },
      "tools": [
        {
          "id": "hammer",
          "role": "tool",
          "mode": "keep",
          "tags": ["base:hammer"]
        }
      ]
    }
  }
}
~~~

Use `extends` on a buildable. Templates may extend other templates. Object maps
merge recursively and non-empty arrays replace completely. Therefore a child
with a non-empty `stages` array replaces template stages. The current Lua merge
detects arrays through index 1, so an empty JSON array does **not** clear an
inherited array; do not use `[]` as a clearing operator. `extends` cannot target
another buildable ID.

## Material groups

Material groups eliminate repeated material arrays:

~~~json
{
  "materialGroups": {
    "myaddon.masonry": [
      {
        "id": "stone",
        "role": "material",
        "mode": "consume",
        "items": ["MyAddon.CutStone"],
        "amount": 8
      },
      {
        "id": "mortar",
        "role": "consumable",
        "mode": "drain",
        "tags": ["myaddon:mortar"],
        "uses": 2
      }
    ]
  }
}
~~~

Reference it from a stage with:

~~~json
{
  "requirements": {
    "materials": "myaddon.masonry"
  }
}
~~~

Prefix templates/material groups. They share a registry namespace across all
active provider manifests.

## Per-save/server overrides

Knox reads `Zomboid/Lua/KnoxBuildworks/overrides.json` outside the mod files.
The file may be a direct buildable-ID map or wrap that map in `buildables`:

~~~json
{
  "buildables": {
    "myaddon.stone_wall": {
      "construction": { "time": 240 },
      "stages": [
        {
          "id": "built",
          "requirements": {
            "inputs": [
              {
                "id": "stone",
                "role": "material",
                "mode": "consume",
                "items": ["MyAddon.CutStone"],
                "amount": 12
              }
            ]
          }
        }
      ]
    }
  }
}
~~~

The override is merged into the raw buildable before template normalization.
It follows the same map/non-empty-array merge rules, so replacing one stage's
requirements normally requires supplying the intended replacement stage list.
The raw override file hash is part of multiplayer integrity; server and clients
must use identical text. This is an administrator/development mechanism, not a
way for an add-on to override another provider's duplicate ID.

## Stage fields

| Field | Type | Behaviour |
| --- | --- | --- |
| id | string | Stage key. Defaults to its 1-based position. |
| level | number | Display level. Defaults to position. |
| label, displayName | string | Optional stage presentation text. |
| previousStage | string or array | Predecessor names for an upgrade. |
| sprites | object | Direction-to-sprite map. |
| geometry | object | Multi-tile/multi-layer matrix. |
| footprints | object | Legacy direct cell map; use geometry in new content. |
| directionalSprites, spritePattern, rotations | mixed | Runtime-consumed stage-level overrides for buildable sprite shorthands. |
| stage icon fields | string | Stage-specific icon override. |
| health | number | Base built health. Default 100. |
| skillBaseHealth | number | Health per highest required skill level. |
| bonusHealth | number | Sandbox-scaled bonus construction health. |
| object | object | Thumpable/prop, `hoppable`, padlock, collision, barricade, break-sound and cursor flags. A legacy top-level stage `hoppable` is also read, but new definitions should use `object.hoppable`. |
| callbacks | object | Optional namespaced `onAddToMenu`, `onCreate`, `onIsValid` and `timedActionOnIsValid` overrides. JSON-only floors receive Knox lifecycle defaults automatically; specialized custom or vanilla callbacks can still require exact native recipes, object types, sprites, or world systems. |
| lightSource | object | Radius, source item/tags, fuel, debug item and directional offsets. |
| placement | object | Stage-level override of buildable placement fields. |
| construction | object | Stage-level override of buildable construction fields. |
| container | object | Built-in container property. |
| nativeObject | object | Requests a supported engine-owned world-object class. `fireplace` creates `IsoFireplace`; `generator` creates `IsoGenerator` and also requires an item full type. Fireplace sprites carrying B42's `IsoType=IsoFireplace` or `container=fireplace` metadata are detected per geometry cell even when this field is omitted. |
| xp | object | Perk-to-XP award map. |
| requirements | object | Inputs, materials, tools, skills and knowledge. |
| finishes | object | Normal-wall plaster/paint/wallpaper configuration. |
| finishOptions | array | Extra visible finish choices. |
| canBePlastered | boolean | Explicit plasterable stage marker. |
| entityCompat | object | Reference to an already-registered PZ entity script. It accepts only `module` and required `entity`; native component metadata is derived from the script. |
| custom property | any | A registered property-handler value. Unknown fields are otherwise preserved but have no behavior. |

### Registered entity reference

~~~json
"entityCompat": {
  "module": "Base",
  "entity": "WoodenWallLvl3"
}
~~~

`module` defaults to `Base`. `entity` may instead contain the full
`Module.Entity` name. Both forms resolve the same registered
`GameEntityScript`. Adding component-shaped fields to this object is a schema
error; edit the actual entity script when defining a custom entity component.

An entity-backed stage may omit `sprites`, `geometry`, `health`,
`skillBaseHealth`, and `requirements`. Knox hydrates them from `SpriteConfig`
and `CraftRecipe` during normalization. If one of those fields is explicitly
present, it overrides the native value only for Knox's catalogue, planner and
validation model; it does not rewrite the registered entity script.

See [Build 42 entity compatibility](../entity-compatibility/) for the derived
metadata and construction lifecycle.

For a buildable with no entity reference, see the complete
[JSON-only buildables](../json-only-buildables/) contract. Custom sprites,
materials, tools, stages, geometry, callbacks and finishes do not require an
entity script.

## Icons

KBW resolves an icon from:

1. stage iconTexture/icon, then definition iconTexture/icon;
2. stage iconName, definition iconName, then imported craft-recipe icon;
3. stage/definition iconSprite;
4. stage/definition iconItem;
5. the first stage sprite.

Use iconName for an existing vanilla Entity UI icon. Use iconSprite or the
automatic sprite fallback for custom tile packs.

## Construction fields

| Field | Behaviour |
| --- | --- |
| construction.time | Timed-action duration. Overrides imported craft-recipe time. |
| construction.timedAction | Registered timed-action script used for animation, props and sound defaults. |
| construction.sound | Explicit looping/build sound. |
| construction.completionSound | Explicit completion sound. |
| construction.actionAnim | Explicit action animation. |
| construction.animVariable | Object with string `key` and `value`. |
| construction.canWalk | Whether walking/running cancels the build action. |
| construction.category | Recipe-category metadata shown/used by Knox. |
| construction.tags | Recipe metadata such as `CanBeDoneInDark` and `AnySurfaceCraft`. |
| construction.xp | Default perk-to-XP map. |
| stage.xp | Stage-specific perk-to-XP map; wins over construction/native recipe XP. |

PostBuildActions currently informs the catalogue only. It is not a generic
callback or remote-code mechanism.
