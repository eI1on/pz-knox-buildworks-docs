---
title: Testing and release
description: Validate Knox add-ons in JSON, single-player and multiplayer before publishing a definition pack.
---

## Static JSON checks

Use Python's built-in parser over definitions:

~~~powershell
Get-ChildItem -Recurse -Filter *.json Contents/mods/MyKBWAddon/42/media/KnoxBuildworks |
  ForEach-Object { python -m json.tool $_.FullName | Out-Null }
~~~

Configure your editor with the shipped KBW buildables.schema.json. It catches
the structural core, but runtime testing is still required because the game
checks actual item types, sprites, perk names and tags.

The [Add-on Studio](../../studio/overview/) runs structural,
runtime-equivalent, indexed-game-data, and cross-project checks and can export
a validation report. Its successful preview still does not replace the game
tests below.

## Single-player test plan

1. Enable Knox, ElyonLib, your add-on and its item/tile dependencies.
2. Turn on Knox debug logging in Mod Options.
3. Verify loader logs show each manifest file and definition registration.
4. Confirm translation, icon, category, filters and description in F7.
5. Test every stage, group member, variant and material option.
6. Test possible items, manual selection, tags, use counts and tool props.
7. Rotate every direction and test all multi-tile cells.
8. Test support/collision, wall frame/previous-stage and stackable behaviour.
9. Plan at multiple Z levels and verify ghost geometry/totals.
10. Build with and without Build Cheat; verify consumption, degradation, XP,
    health, containers and sounds.
11. Test every plaster/paint/wallpaper selector and missing-item failure.

## Multiplayer test plan

1. Install exact same Knox, ElyonLib and add-on files on server/client.
2. Confirm the client integrity Hello is accepted.
3. Change one definition/override deliberately and verify Knox rejects it.
4. Test construction as a non-admin character.
5. Test view/build/contribute permissions with another account.
6. Test plan creation, gathers, queued builds and final finishes.
7. Verify invalid stage, choice, placement, skill and recipe requests fail
   server-side.

## Release checklist

- Prefix every add-on-owned ID and translation.
- List every definition file in the manifest.
- Route released names through `IG_UI.json`/`IGUI_` and descriptions through
  `Tooltip.json`/`Tooltip_`.
- Include only data actively consumed by KBW; remove duplicate raw/compat data.
- Test with normal survival resources, not only Build Cheat.
- Test an actual dedicated/hosted server with a non-admin client.
- Document any dependency tile/item mod and its required load order.
- Keep a changelog that distinguishes user-facing functionality from
  experimental/unsupported entity metadata.
