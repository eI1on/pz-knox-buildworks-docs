---
title: Requirements, items and tags
description: Define materials, tools, consumables, manual alternatives, Build 42 tags, skills, knowledge and tool behaviour.
---

## Requirement ordering

:::note[Entity-backed stages]
When a stage references `entityCompat`, omit `requirements` unless you need an
intentional Knox-only override. Knox derives native recipe inputs, exact items,
item tags, flags, count/use mode, tools, skills and the learned-recipe gate from
the referenced `CraftRecipe`. The fields below are primarily for JSON-only
buildables and overrides.
:::

KBW builds final requirement rows in this order:

1. stage requirements.inputs;
2. stage requirements.materials;
3. definition-level tools;
4. stage requirements.tools.

Use stable IDs on rows that accept alternatives. They are the keys stored for
manual ingredient selection in build cursors and blueprint placements.

## Input field reference

| Field | Type | Behaviour |
| --- | --- | --- |
| id | string | Stable input key. |
| role | string | material, tool, consumable, component or resource. |
| mode | string | consume, keep, drain or destroy. `destroy` removes the whole matched item. |
| items | array | Exact Build 42 full item types. |
| tags | array | Build 42 item tags. |
| amount | number | Required item count; default 1. |
| uses | number | Required drainable uses. |
| amountMax | number | Display-range metadata; not random consumption. |
| label | string | Requirement label. |
| labelKey | string | Routed `IGUI_` translation key for the requirement label. |
| icon | string | Optional requirement icon override. |
| flags | array | Behaviour flags below. |
| materialTags | array | UI/filter metadata. |
| resourceType | string | Item, Fluid or Energy metadata. Current runtime actively consumes Item rows. |

Items and tags are alternatives. A row with both accepts any matching item. The
ingredient drawer shows actual matching stacks under Available Ingredients and
all accepted item/tag possibilities under Possible Items.

~~~json
{
  "id": "fasteners",
  "role": "material",
  "mode": "consume",
  "items": ["MyAddon.Rivet", "Base.Nails"],
  "tags": ["myaddon:metal_fastener"],
  "amount": 6,
  "label": "Fasteners"
}
~~~

For consume/drain rows, KBW considers inventory and eligible material on the
build square. Keep rows must be present in the inventory. Drain/uses rows
consume an item use per required use.

## Flags implemented by the JSON requirement path

| Flag | Effect |
| --- | --- |
| NoBrokenItems | Reject broken matches. |
| AllowDestroyedItem | Allow destroyed matches. |
| AllowFavorite | Permit consuming/draining favorited items. |
| IsEmptyContainer | Require an empty inventory container. |
| IsFull | Require an item at maximum uses. |
| NotFull | Require less than maximum uses. |
| IsEmpty | Require zero current uses. |
| NotEmpty | Require at least one current use. |
| HasOneUse | Require exactly one current use. |
| HasNoUses | Require zero current uses. |
| DontRecordInput | Exclude a consumed item from `getAllRecordedConsumedItems()` in the Lua compatibility recipe-data object. |
| Prop1 | Use matching item/static model as first action hand prop. |
| Prop2 | Use matching item/static model as second action hand prop. |
| MayDegradeHeavy | Strong kept-tool degradation check. |
| MayDegrade | Normal kept-tool degradation check. |
| MayDegradeLight | Light kept-tool degradation check. |
| MayDegradeVeryLight | Very-light kept-tool degradation check. |

Prop1 and Prop2 take priority over imported timed-action default hand models
when a matching requirement item exists. Degradation runs for kept matching
tools and uses the highest stage skill plus the item's maintenance modifier.

Entity-backed recipes preserve the complete current Build 42 `InputFlag` set
when Knox derives their rows. This includes native flags such as `ToolLeft`,
`ToolRight`, `HandcraftOnly`, `AutomationOnly`, `ItemIsUses`, inheritance,
food-state, sealing, equipment, and recording flags. Most of those belong to
the native `BuildLogic`/`CraftRecipeData` lifecycle and are **not** simulated by
custom JSON consumption. Do not add a native-only flag to a JSON row and assume
it activates engine behavior. Inspect the installed Build 42 scripts when an
entity recipe uses a flag that is not covered by these JSON rules.

## Tags

Use canonical Build 42 colon notation:

~~~json
{
  "tags": ["base:hammer"]
}
~~~

KBW accepts a simple `base.hammer` spelling and normalizes it, but authors should
use colon notation. It resolves tags through ItemTag and ResourceLocation,
lists tagged script items, and chooses a matching item icon.

An unresolved tag is logged once and remains visible in Possible Items. Do not
add a fake fallback item just to hide it. Correct the tag in the providing item
script or use an exact item alternative when that is actually valid.

## Skills and knowledge

~~~json
{
  "requirements": {
    "skills": {
      "Woodwork": 4,
      "MetalWelding": 2
    },
    "recipes": ["Make Metal Fences"],
    "knowledge": {
      "recipes": ["Make Metal Fences"],
      "sources": ["MyAddon_MetalworkMagazine"],
      "needToBeLearned": true
    },
    "debugOnly": false
  }
}
~~~

Skills map real Build 42 perk names to minimum levels. Recipes and
knowledge.recipes are combined and checked with player:isRecipeActuallyKnown.
Unknown recipe entries block construction unless knowledge.needToBeLearned is
false. Knowledge sources are UI metadata.
