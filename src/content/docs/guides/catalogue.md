---
title: Using the catalogue
description: Browse, filter, inspect, favorite, pin, and select the exact inputs for a Knox buildable.
---

## Browse and filter

The catalogue has grid and detailed-list views:

- **Grid** for quick visual browsing.
- **Detailed list** for clearer names, categories, status, favorites and pins.

Use the search mode selector to match recipe names, required items, or both.
Choose a category, then a subcategory within it. The visible filters narrow
the results by material, required skill, or local readiness. Sorting supports
natural registry order or alphabetical order; pinned entries stay easy to find.

**All qualities** mirrors Build 42's Building Menu tick box. Normally,
each stage's `OnAddToMenu` callback may hide versions the current character
should not see, such as lower or higher skill variants. Enabling the option
passes `shouldShowAll = true` to that callback and exposes those versions in
both the Buildworks catalogue and Planning catalogue. The choice is saved per
player.

Favorites are player-local catalogue choices. Recently used entries update
after selection or building. Favorite and pin controls are available on the
result and in the selected buildable's inspector. The magnifier on a result
enlarges its sprite only while hovered. Compact mode shows details on hover
without occupying the full inspector width.

To copy something already in the world, right-click its tile and choose
**Find this piece in Knox Buildworks**. For an empty frame, **Find doors/windows
for this opening** lists compatible pieces.

## Inspector selections

The inspector owns the exact construction selection:

| Control | Meaning |
| --- | --- |
| Stage carousel | Chooses a grouped buildable member or a construction level. |
| Variant | Merges a selected variation into the base definition. |
| Material set | Merges selected material-specific data into the result. |
| Finish | Chooses a supported plaster/paint/wallpaper or wall-covering action. |

The selected IDs are stored on the cursor and any planned ghost. They are
resolved and rechecked server-side when construction begins.

## Available Ingredients and Possible Items

Select a requirement row to open the integrated ingredient drawer.

**Available Ingredients** shows real matching inventory stacks, grouped by
full item type and expandable into individual entries. It is not merely a
recipe list.

**Possible Items** shows every exact item and Build 42 item tag that can
satisfy the selected input. It can include items the player does not own.

When a requirement allows alternatives, choose one possible full type. Knox
records that choice for the input and spends only valid matching items. A
manual choice cannot authorize an arbitrary item: the server validates it
against the input's accepted items/tags.

## Requirement state

Materials and consumables may count eligible stacks lying on the current build
square. Kept tools must be carried. Each row indicates whether it is consumed,
kept, drained by uses, or may degrade.

Skills and learned recipes have their own section in the same inspector panel
as materials and tools. A green
state means the selection is ready under current local checks; a final
placement, distance, permission and resource check still happens when building.

## Pins

Pin a recipe from the catalogue or grid/list card. The HUD tracker can display
requirements as text or text plus real item/skill icons. Its position,
alignment, accent bar, opacity and manual/automatic placement are configurable
in Mod Options and from the pinned tracker settings.
