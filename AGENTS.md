# AGENTS.md

## Purpose and navigation

These are repository-wide operating rules. Follow any nearer `AGENTS.md` for its scope. Use progressive disclosure: for a focused change, inspect the target and applicable local guidance; for cross-cutting, architectural, ambiguous, risky, or resumed work, consult [`docs/ai/INDEX.md`](docs/ai/INDEX.md) and open only relevant references. Do not read unrelated project documentation by default.

## Working rules

- Inspect Git status and relevant files before editing. Preserve unrelated user changes.
- Make the smallest complete change. Keep implementation and documentation aligned with their sources of truth; do not hand-edit generated `dist/` files.
- Treat YAML passed to `YAMLParser` as untrusted input. Preserve syntax validation and handle parser errors explicitly. Validate external input and protect secrets and sensitive data.
- Keep generated `.bpmn` examples consistent with their source `.yaml` when changing BPMN generation. Preserve the public TypeScript and CLI APIs unless the task requires an API change; check Node.js support before upgrading major dependencies.
- Update `CHANGELOG.md` for meaningful project changes. Documentation-only changes do not require a version bump. Package versions come from `package.json` and `package-lock.json` and follow Semantic Versioning.
- Destructive actions, publication, deployment, external service changes, and material costs require explicit authorization. Never commit, push, publish, or deploy without it.

## Verification

Run checks that fit the change and its risk. `npm test` builds the TypeScript sources and runs the Node.js regression tests. CI also runs package, dependency, repository, and release-artifact validation. Report only checks actually completed and inspect the final diff.

## Specialized guidance

Consult [`docs/ai/RELEASES.md`](docs/ai/RELEASES.md) for versioning, package validation, and release workflow changes. Consult `docs/ai/SESSION-STATE.md` only when resuming potentially incomplete work and only if the file exists; verify its claims against Git, code, and available evidence. It is an operational handoff, not a history. Keep necessary handoffs to about 150 words and clear or mark them inactive when work is complete.

## Completion

Finish with a concise summary of changes, checks and results, and unresolved issues or next actions. Never claim unverified checks or external actions succeeded. Do not leave completed work marked pending.
