---
title: Server configuration
description: Configure Knox Buildworks sandbox options, HUD options and multiplayer integrity expectations.
---

## Sandbox options

| Option | Default | Range | Effect |
| --- | ---: | ---: | --- |
| KnoxBuildworks.ReplaceBuildMenu | false | on/off | Makes Knox the primary Build button action. |
| KnoxBuildworks.EnablePlanningMode | true | on/off | Allows Planning Mode and its blueprint tools. |
| KnoxBuildworks.MaxPlacementsPerBlueprint | 1000 | 50-5000 | Maximum planned entries in a blueprint. |
| KnoxBuildworks.BlueprintRadius | 200 | 20-2000 | Half-size in tiles of the allowed blueprint design area. |
| KnoxBuildworks.BuildXPMultiplier | 1.0 | 0.0-10.0 | Multiplies XP awarded by Knox construction. |
| KnoxBuildworks.WellWaterMode | Infinite | Infinite / Limited | Controls water stored by player-built wells. |
| KnoxBuildworks.WellCapacity | 1500 | 1-10000 | Maximum water in a limited well. |
| KnoxBuildworks.WellInitialPercent | 25 | 0-100 | Starting fill level of a limited well. |
| KnoxBuildworks.WellHourlyRefill | 3 | 0-100 | Hourly refill of a limited well. |
| KnoxBuildworks.WellRainRefillMultiplier | 1.5 | 0-10 | Multiplier for rain refill. |
| KnoxBuildworks.RequireConstructionPaint | true | on/off | Requires paint for applicable construction finishes. |

A BlueprintRadius of 200 permits a design area extending 200 tiles from its
anchor in each horizontal direction (a 400x400 square).

## Client Mod Options

Client Mod Options provide:

- F7 catalogue keybind;
- toolbar button visibility and planning inventory visibility;
- debug logging and profiling;
- panel opacity, tone, contrast, icon and preview sizing, and tile backgrounds;
- pinned recipe/blueprint tracker alignment;
- automatic or manually dragged tracker placement;
- opacity;
- accent-bar side;
- icon-plus-text or text-only tracker content.

The catalogue gear exposes appearance controls and applies changes as they are
adjusted. These UI choices are local. They do not grant any construction or blueprint
permission.

## Multiplayer setup checklist

1. Install identical Knox Buildworks, ElyonLib and Knox add-ons on server and
   clients.
2. Ensure all definition JSON files are manifest-listed on each machine.
3. Keep the per-save override file identical where it is in use.
4. Enable debug logging while validating a new mod pack.
5. Have a non-admin client join and confirm it receives an integrity-accepted
   state before testing construction.

The server compares the content-hash identity for all active definition files and
overrides. A mismatch intentionally blocks Knox construction and blueprint
changes for that client.
