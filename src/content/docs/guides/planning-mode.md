---
title: Planning Mode
description: Create room layouts and multi-level blueprint ghosts before committing resources to construction.
---

## Enter Planning Mode

Open Planning Mode from the Build drawer. It is a dedicated workspace with:

- blueprint management and totals on the left;
- room, gather-area, build and level tools in the centre;
- a separate planning catalogue on the right.

The server sandbox option **EnablePlanningMode** can disable this feature.

## Create a blueprint

Create a new blueprint, choose it in the list, then set its design level using
the level controls. The active blueprint level drives new plan coordinates; the
player does not have to stand on that Z level to design it.

Blueprints store their own rooms, planned buildables, selected variants,
materials, finishes, gather area, permissions and timestamps.

## Plan buildables

Select content from the Planning catalogue, configure its stage/variant/material
and finish, then choose **Plan selected buildable**.

- Walls support drag-to-place lines.
- Floors support drag-to-place rectangles.
- Other objects place one complete footprint at a time so large, irregular and
  multi-tile objects are never accidentally repeated as a line.

Ghosts are non-blocking previews. They use the same resolved directional
geometry as the build cursor and are drawn at the planned Z level. Use the
rotate key to cycle compatible stacked plans.

When a spot cannot be planned, the ghost turns red and a tooltip at the
cursor states the exact reason - outside the blueprint area (with the tile
limit), overlapping another plan, a missing earlier stage or frame, no edit
permission, or a full blueprint. A failed click repeats the same reason. The
build tool reports its own blockers the same way, for example "it needs an
empty door frame" or "a vehicle is in the way".

Paint, wallpaper and plaster buildables use the Finish selector for their
color or pattern - the same full list the catalogue offers. Every color is
always listed; a wall whose tile pack only maps some finishes rejects the
rest at placement with the specific reason (not plasterable, must plaster
first, finish not mapped for this wall). The planned color follows the
placement everywhere: totals, pinned trackers and the build tooltip all ask
for that exact paint or wallpaper.

## Rooms and gather areas

Draw a rectangular room, then rename it and assign a colour. Rooms are separate
from planned buildables, so erasing a room does not erase its floor or walls.
Their world rendering prefers a lightweight border over a full filled overlay.

Set a gather area over nearby ground storage, world containers, and vehicle
containers. Blueprint totals use this area when reporting available supplies,
and the build queue can fetch eligible materials before walking to the planned
construction.

## Build from a plan

You can:

- build the selected plan;
- use the world Build tool to click a ghost;
- queue the complete blueprint.

The queue checks the actual current world, requirements, player permissions and
build route for each entry. A plan is removed only after its matching object was
created successfully.
