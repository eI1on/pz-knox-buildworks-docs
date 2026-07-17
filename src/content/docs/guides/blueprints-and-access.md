---
title: Blueprints, sharing and access
description: Save, export, import, pin and share blueprint designs without trusting clients in multiplayer.
---

## Blueprint lifecycle

Each blueprint is shared save/server data with a short random id. The
authoritative side (server or single-player session) stores every blueprint as
its own JSON file under Zomboid/Lua/KnoxBuildworks/blueprints/(save)/, so
nothing lives in ModData and save files stay lean. Owners can create, rename,
duplicate, move, delete, hide/show, pin, export and import designs. New,
duplicated and imported blueprints always start private.

Exports use origin-relative coordinates. This lets another player import the
same design and choose a new world origin instead of being forced to the
original map coordinates. Exports carry only what another save or player
needs - name, rooms, planned placements and gather area. Ownership, access
lists, range anchoring and timestamps are local state and are rebuilt when the
file is imported.

You can also:

- copy a blueprint's JSON;
- export it to a .json file in Zomboid/Lua/KnoxBuildworks/exports/ through the
  planner. File names stay ASCII on every OS and language:
  knox_blueprint_(name)_(id).json, where the name part is kept only when the
  title has ASCII characters and the short id guarantees uniqueness. The full
  title - in any alphabet - travels inside the file;
- import a .json file from that same folder - drop files there by hand to
  bring in designs from other players or from another save, then pick the
  import in the planner's Import window (it lists each file by the blueprint
  title stored inside it, with the file name underneath) and choose the
  origin;
- draft a selected blueprint onto plain paper;
- import a Knox Blueprint item, then choose its target origin.

## Totals and pinned HUD

Blueprint totals aggregate:

- consumed materials and drainable uses;
- reusable tools;
- maximum skill gates;
- recipe/knowledge gates;
- buildable counts and planned placement count.

Pin a blueprint to the same HUD tracker used for build recipes. The tracker
considers the player inventory and the blueprint gather area when displaying
availability.

## Access model

Each blueprint has four effective levels:

| Level | Permission |
| --- | --- |
| None | No implicit access. |
| View | Receive and see the blueprint. |
| Build | Build existing planned entries. |
| Contribute | Add, move, edit and erase plans/rooms. |

The owner and admins can manage access. The owner sets:

1. A default scope for everyone: private, view, build or contribute.
2. A permission grant for the faction the owner belongs to.
3. Per-player grants for online or offline usernames.

Access is evaluated owner/admin first, then a non-`none` player grant, then the
player's faction grant, then the default scope. `None` removes a grant; it is
not an explicit deny over a public default. For example, removing a player
grant from an “Everyone can view” blueprint returns that player to View through
the default scope. Players who truly lose view access receive a server-side
removal of the blueprint cache rather than keeping stale plan data.

## Multiplayer rules

Blueprint mutations are sent as Knox commands but applied server-side. The
server checks ownership/contribute access, placement limits, radius, range,
intersections and visibility. Players only ever receive blueprints they can
view: accepted edits travel as small delta commands to permitted viewers,
full blueprints are sent only on login, creation and access changes, and
edits to a private blueprint reach nobody else.

Permission and discovery are separate. A shared or public blueprint is only
synchronized to non-owners while they are inside its planning radius, so a
busy server never pushes every public blueprint to every connected player.
Owners always receive their own blueprints, and moving a blueprint re-checks
who is in range.

:::tip[Private does not mean unusable]
Private is the default scope. The owner can still grant a specific player or
their own faction view, build or contribute access as an exception.
:::
