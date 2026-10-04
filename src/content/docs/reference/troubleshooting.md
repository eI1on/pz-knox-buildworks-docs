---
title: Troubleshooting
description: Diagnose missing content, definition warnings, integrity mismatches, placement failures and Planning Mode issues.
---

## Enable debug logging

Turn on **Verbose debug logging** in Knox Mod Options. This raises Knox logging
to DEBUG and helps confirm manifest discovery, registry creation, validation and
network messages.

## Common definition issues

| Symptom or log | Cause | Fix |
| --- | --- | --- |
| File skipped | Manifest path missing or JSON invalid | Check manifest path and parse JSON. |
| Unsupported schemaVersion | Bundle is not schema version 1 | Use schemaVersion 1. |
| Duplicate buildable ID | Another active provider already owns the ID | Prefix/rename your definition. |
| Duplicate alias | Alias already resolves to another definition | Remove or rename it. |
| Missing item | Full type is unavailable | Use exact Build 42 type and enable dependency mod. |
| Missing skill | Perk key does not exist | Verify actual Build 42 perk key. |
| Unresolved item tag | Tag is not declared/resolved | Use canonical namespace:tag spelling and verify item scripts. |
| Missing sprite | Tile set/sprite name unavailable | Verify tileset load order and every face/cell sprite. |
| Sprite reused | Multiple definitions reference it without an explicit shared-sprite contract | Review the collision. If every owner intentionally shares the sprite, set `allowSpriteReuse: true` on those definitions or stages. |
| Missing translation | A client cannot resolve the key from Translate/(LANG) files, or the key prefix is not routed by getText | Add the key to IG_UI.json (display names need an IGUI_ prefix) or Tooltip.json (Tooltip_ prefix); keys with other prefixes never resolve. Translation existence is checked on clients/single-player, not dedicated servers. |

## Integrity mismatch

If Knox reports a definition mismatch:

1. Compare active mod IDs on server/client.
2. Compare each manifest definition list/order.
3. Compare the raw JSON files, not just buildable display text.
4. Compare KnoxBuildworks/overrides.json if used.
5. Restart after both sides are aligned so the registry reloads.

## Placement failure

Check the cursor/console reason:

- previous stage missing means an upgrade needs a frame/wall predecessor;
- direction mismatch means predecessor and upgrade use different wall edges;
- floor required means the placement kind needs a floor;
- wall support missing means the tile cannot support that wall edge;
- door/window frame required means an appropriate frame must exist;
- footprint blocked, solid placement blocked or vehicle/stairs blocked indicates
  a real world collision;
- definition integrity mismatch means the multiplayer definition hash is not accepted.

If materials disappear but nothing is built after a game update, confirm that
both the server and clients have the latest Buildworks release. The Build 42.21
furniture API change affected wells, roofs, shelves and upper counters; do not
assume a successful timed action means the object was created. Keep the game
and mod versions together when reproducing a report.

If F7 appears to do nothing just after loading, wait for definitions to finish
loading: the catalogue request is queued. Also check the keybind in Mod Options
and whether the Build button drawer is enabled.

## Plans or ghosts

For Planning Mode:

- confirm EnablePlanningMode is on;
- select the intended blueprint and design level;
- ensure a non-wall/non-floor object is not being drag-repeated;
- check intersections with other plan layers;
- use the rotate key to cycle a stacked compatible plan;
- ensure blueprint access is at least contribute to edit, or build to construct.

## Build queue

The queue can skip an entry if the world changed, resources are no longer
available, a predecessor is missing, the target is unreachable, or permission
was revoked. Inspect totals, gather area coverage and individual build preview
before retrying.

## Adding or removing the mod from a save

Back up a multiplayer world before changing its mod list. Adding Buildworks to
an existing save may work, but removing it after the save has registered its
items can leave missing WorldDictionary entries. Deleting WorldDictionary
files is not a safe general fix. Test mod-list changes on a copy of the save,
and retain the mod if the world still references its items.
