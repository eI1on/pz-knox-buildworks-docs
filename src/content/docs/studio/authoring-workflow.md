---
title: Studio authoring workflow
description: Create or import a project, author definitions visually, validate effective combinations, and export a testable Build 42 add-on.
---

## 1. Create or import

Choose **New** to define the display name, Project Zomboid Mod ID, Knox
namespace, author, version, dependencies, output folder, and English
translation prefix. Stable IDs remain separate from translated display text.

The import actions accept:

- a portable `.kbwproject.json`;
- a complete add-on ZIP;
- an unpacked add-on folder;
- individual definition/manifest JSON files.

Multi-file projects retain their definition split and manifest order. The
Studio does not flatten them unless the author explicitly reorganizes files.

## 2. Add reference data

Import asset folders under **Assets**, then add vanilla and dependency source
folders for autocomplete and diagnostics. Reference data remains session-local
and is not included in the project or add-on export.

## 3. Organize reusable data

Create templates for repeated definition maps and material groups for repeated
input rows. The effective-value view shows inherited values and their source.

Remember the runtime merge rule:

- map-like objects merge recursively;
- non-empty arrays replace inherited arrays;
- an empty array does not clear an inherited array in the current Lua merge.

Use namespaced IDs and inspect all references before renaming or moving shared
data between files.

## 4. Author the buildable

Start with identity, catalogue metadata, translation keys, placement kind, and
one stage. Add advanced fields only when needed.

Use the dedicated views for:

- directional and matrix geometry;
- recipe/input requirements and manual alternatives;
- grouped levels, variants, and material options;
- wall finishes and directional mappings;
- entity references and read-only hydrated native metadata;
- routed English translations;
- raw JSON and authored-versus-resolved comparison.

The geometry editor uses the same layer/row/cell model that Knox normalizes.
Assign sprites from the asset library, mark deliberate gaps or invisible
blocking cells, set cell kinds, and inspect the result in the isometric preview.

## 5. Choose JSON-only or entity-backed

Use JSON only for normal objects, walls, floors, stairs, overlays, stages,
requirements, placement rules, callbacks, lights, containers, and Knox wall
finishes.

Reference an entity when the finished object requires native `Resources`,
workbench/craft logic, craft-bench sounds, sprite-overlay progress, fluids,
context-menu components, or another engine lifecycle. The generated
`entityCompat` remains compact:

~~~json
{
  "entityCompat": {
    "module": "Base",
    "entity": "ExistingEntity"
  }
}
~~~

The Studio currently indexes and references entity scripts; it does not
generate a new custom entity script.

## 6. Validate

Validation is layered:

1. JSON syntax and structural schema;
2. Knox runtime-equivalent normalization and merge checks;
3. locally indexed game-data checks;
4. cross-project registry, reference, sprite, and translation checks;
5. runtime-only notices for behavior a browser cannot prove.

Blocking errors prevent normal export. Warnings can be exported after review.
The broken-draft export is a development escape hatch and is not intended for
the game.

Validate every stage, variant, and material-option combination. A base
definition can be valid while one selected option replaces its stages with an
invalid list.

## 7. Export

The complete ZIP contains:

~~~text
<ascii-output-name>/
└── 42/
    ├── mod.info
    ├── validation-report.json
    └── media/
        ├── KnoxBuildworks/
        │   ├── manifest.json
        │   └── definitions/*.json
        └── lua/shared/Translate/EN/
            ├── IG_UI.json
            └── Tooltip.json
~~~

Generated JSON is UTF-8, two-space indented, and deterministic. Machine paths
and imported sprite pixels are excluded. Translation keys are routed by
prefix, and manifest paths include their required `media/` prefix.

## 8. Test in Project Zomboid

Install the export as a separate test mod. Test catalogue display, every
selection combination, rotation, all geometry cells, requirements and use
counts, callbacks, timed actions, final objects, wall finishes, blueprints,
save/reload, and multiplayer integrity.

The Studio's green validation state means “no statically proven error,” not
“verified in game.” Use the [release checklist](../../modders/testing-and-release/)
before publishing.

