---
title: Getting started
description: Install Knox Buildworks, open the catalogue, and understand the first construction flow.
---

## Requirements

Knox Buildworks targets **Project Zomboid Build 42** and requires
**ElyonLib**. Install both on every client and on the server. Multiplayer
players also need the same active Knox add-ons and definition data as the
server.

## Open Knox Buildworks

Use either entry point:

1. Press **F7**. The keybind is configurable in Mod Options.
2. Open the Build button drawer on the left-side game toolbar.

The sandbox option **ReplaceBuildMenu** decides whether Knox is the primary
Build button action. When disabled, vanilla remains the primary action and
Knox stays available in the hover drawer. When enabled, the primary action
opens Knox.

Knox does not add a world context-menu shortcut for opening the catalogue.
Inventory context menus are used only for drafting, importing, or updating
blueprint items.

## First construction

1. Search or browse a buildable in the catalogue.
2. Select a grouped level, variant, material set, or finish when those controls
   are available.
3. Read **Materials & tools** and **Skills & knowledge** together in the right-hand inspector.
4. Select a requirement to inspect actual inventory stacks and every allowed
   alternative.
5. Click **Build** to enter placement mode.
6. Rotate and place the footprint. The cursor displays valid/invalid feedback.
7. Let the timed action complete.

The build cursor validates the same requirement and placement rules again when
construction starts. In multiplayer, the server performs the final validation.

:::tip[Simple entries stay compact]
Variant, material-set and finish controls appear only when the buildable supports
them. Grouped entries expose a level carousel. In compact mode, hover an entry
for its details without keeping the full inspector open.
:::

## Next steps

- Take the [interface tour](../interface-tour/) for an annotated map of every
  control in the catalogue and Planning Mode.
- Learn [how the catalogue works](../catalogue/).
- Build a plastered, painted or wallpapered wall in
  [Building and finishes](../building-and-finishes/).
- Create a base layout in [Planning Mode](../planning-mode/).
