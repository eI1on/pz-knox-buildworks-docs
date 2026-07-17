---
title: JSON schema reference
description: Fast lookup for the schema-version 1 bundle, input, stage, geometry and requirement shapes.
---

## Schema version

The current core constant is **KBW.SCHEMA_VERSION = 1**. A definition bundle
must use schemaVersion 1 and contain a buildables array.

## Required core

~~~json
{
  "schemaVersion": 1,
  "buildables": [
    {
      "id": "myaddon.example",
      "category": "Furniture",
      "stages": [
        {
          "id": "built",
          "sprites": {
            "W": "my_tiles_01_0"
          }
        }
      ]
    }
  ]
}
~~~

## Input contract

An input requires at least items or tags:

~~~json
{
  "id": "tool",
  "role": "tool",
  "mode": "keep",
  "resourceType": "Item",
  "items": ["Base.Hammer"],
  "tags": ["base:hammer"],
  "amount": 1,
  "flags": ["Prop1"]
}
~~~

Allowed role values are material, tool, consumable, component and resource.
Allowed mode values are consume, keep, drain and destroy. ResourceType values are Item,
Fluid and Energy, though current active consumption is item-oriented.

## Geometry contract

~~~json
{
  "geometry": {
    "faces": {
      "S": {
        "layers": [
          {
            "rows": [
              ["sprite_1", false, { "sprite": "sprite_2", "blocks": false }]
            ]
          }
        ]
      }
    }
  }
}
~~~

Face keys are W, N, E and S. A cell may be a sprite string, boolean, or object
with sprite/empty/blocks/kind/properties. Runtime matrix normalization also
supports layer `x`/`y`/`z` and cell `dx`/`dy`/`dz` offsets. These runtime fields
are more complete than the current static schema's geometry annotations.

## Complete static contract

The shipped static schema enumerates the built-in JSON-only construction
surface, including:

- variants;
- materialOptions;
- group;
- finishes;
- canBePlastered;
- container;
- health, skill health, bonus health and XP;
- object flags, callbacks and light sources;
- placement and construction metadata;
- registered custom stage properties;
- an `entityCompat` reference containing only `module` and `entity`.

When `entityCompat` is present, runtime normalization hydrates omitted stage
sprites/geometry, health and construction requirements from the registered
`SpriteConfig` and `CraftRecipe`. The schema therefore does not require those
fields on an entity-backed stage; explicit values are optional overrides.

Use [definition format](../../modders/definitions/) for the supported runtime
contract, [JSON-only buildables](../../modders/json-only-buildables/) for the
complete independent construction surface, and
[entity compatibility](../../modders/entity-compatibility/) for the registered
entity-script bridge and its runtime-derived metadata.

For a field-by-field runtime list, including runtime-consumed compatibility
fields not fully enumerated by the static schema, use the
[definition field reference](../definition-field-reference/).
