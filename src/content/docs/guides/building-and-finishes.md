---
title: Building and wall finishes
description: Understand placement previews, construction stages, requirements, plastering, paint, wallpaper and signs.
---

## Placement cursor

The Knox cursor is a real construction cursor, not a visual-only ghost. It
uses the selected buildable's directional sprite data and multi-tile footprint
to preview the object before placing it.

It checks Build 42-style constraints including:

- floor and wall support;
- wall edge direction;
- predecessor construction stages;
- door/window frame requirements;
- multi-tile collisions;
- vehicle and stair conflicts;
- stackable furniture placement;
- safehouse, distance and server-access restrictions.

The character walks to an appropriate adjacent square before performing the
timed action. Large and wall-like objects use their footprint/direction to find
the appropriate interaction position.

## Construction levels and upgrades

Some buildables are related by groups. A group presents wall quality or a
similar family as one catalogue entry; the selected carousel item resolves to
the real underlying recipe.

Other stages are upgrades. An upgrade can require a prior wall/frame/object and
will only replace it when the required stage and direction match. This permits
frame-to-wall construction without treating a valid frame as a collision.

## Finish selection for new walls

Plasterable normal walls can be built as:

1. Bare wall.
2. Plastered wall.
3. Plastered wall plus an allowed paint colour.
4. Plastered wall plus an allowed wallpaper type.

The finish selector previews the final mapped sprite. Knox first builds the
wall, then queues the finish actions in order: plaster first, then paint or
wallpaper.

| Finish action | Tools retained | Items used |
| --- | --- | --- |
| Plaster | plastering trowel | plaster bucket use |
| Paint | paintbrush | selected paint use |
| Wallpaper | paintbrush and scissors | selected wallpaper and paste uses |

The trowel may degrade. Every finish requirement appears in the catalogue and
blueprint totals before construction.

## Standalone wall-covering actions

The converted wall-covering catalogue also supports actions on existing walls:

- plaster;
- wall painting;
- wallpaper;
- paintable sign variants.

These actions use the same item/tool gates as their Build 42 counterparts.
The available paint, wallpaper or sign selector is validated against the
selected action rather than accepting a generic client-side choice.

In planning mode, a finish ghost belongs to one wall edge rather than the whole
tile. Empty tiles and incompatible surfaces render as invalid. A plaster plan
may be followed by paint or wallpaper on the same edge; the build queue applies
them in that order. Tile-pack surfaces can also explicitly permit direct paint
or wallpaper without plaster.

:::caution[Finishes are not cosmetic-only]
A selected finish changes planned requirements and triggers separate actions
after wall construction. Missing finish materials can block a build that would
otherwise have enough materials for the bare wall.
:::
