---
title: Validation and integrity
description: See how Knox protects construction and blueprints through content-hash identity, client previews and server-authoritative revalidation.
---

## Definition identity

Each definition file is read as raw text and hashed with a deterministic 32-bit
rolling hash: `value = value * 33 + byte (mod 2^32)`, starting at 5381. It uses
plain multiplication and modulo so the PZ Lua sandbox computes the same result
on client and server. This is an identity hash, not CRC32, Adler-32, or a
cryptographic signature.

The registry hashes the schema version, sorted `modId:path=fileHash` source
pairs, and override hash into one identity. It therefore detects changes to raw
JSON text, source paths, provider sets, and overrides rather than trusting
client UI state or display names.

Client file hashing and normalization are spread over ticks with a hard
per-tick time budget. Dedicated servers load synchronously so the registry
identity exists before the first client Hello.

On multiplayer join, the client sends its identity through the Knox Hello
command. The server compares it to its own registry and records whether that
client is allowed to use Knox actions.

## What the server validates

For every final build, the server resolves and checks:

- buildable ID, stage, variant and material option;
- selected manual input choices;
- skills, recipe/knowledge and debug gates;
- required tools, materials and drainable uses;
- selected plaster/paint/wallpaper/sign action;
- blueprint build permission when coming from a plan;
- distance and Z-level limits;
- safehouse, floor, wall/frame, collision, vehicle, stair and footprint rules;
- predecessor stage and world replacement state.

Client ghost validity is helpful feedback, not authorization.

## Blueprint synchronization

The authoritative blueprint store is one JSON file per blueprint under
Lua/KnoxBuildworks/blueprints/(save)/ on the server (or the local session in
single-player). Multiplayer clients keep a filtered in-memory cache: the server
sends a blueprint only to players who can view it AND are inside its planning
radius (owners are always synced), and a lost permission causes a BPForget
event that removes the blueprint from that client's cache. Access edits,
deletions and blueprint moves re-run the visibility diff so only affected
players are notified.

Client blueprint changes are commands, not direct shared-data writes. The
server enforces owner/contribute permission, placement/radius limits and
intersection rules. An accepted change is echoed as the same small delta
command to the other permitted viewers - the full blueprint is only sent on
login sync, creation, access changes and when a rejected command rolls the
sender back to the authoritative state. Edits to a private blueprint generate
no traffic to other players at all.

## Overrides

The local override file is included in definition identity. That means a server
cannot safely use a balance override while clients use no override or a
different version. See [testing and release](../../modders/testing-and-release/)
before distributing overrides.

:::caution[Do not bypass integrity]
An add-on should not send a parallel build command that skips Resolver,
Requirements, Placement or Integrity. A new construction capability must add
equivalent server-side checks.
:::
