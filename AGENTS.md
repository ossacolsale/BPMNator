# AGENTS.md

## Purpose and navigation

Use these rules throughout the repository. A nearer `AGENTS.md` may add scope-specific rules but must not weaken an explicit global requirement. Start here, read [`docs/ai/INDEX.md`](docs/ai/INDEX.md), then inspect only the files relevant to the task; broaden the search when evidence requires it.

## Repository map

- `docs/ai/`: concise architecture and file map for this repository.
- `parser/`: YAML parsing and syntax validation.
- `entities/`: parsed process and BPMN domain models.
- `bpmnbuilder/`: conversion from the process model to BPMN XML, including diagram layout.
- `helpers/`: shared naming and entity helpers.
- `bin/`: library and CLI entry point.
- `examples/`: source YAML, generated BPMN, and rendered diagrams.
- `test/`: regression tests.
- `dist/`: generated JavaScript and declarations; never edit by hand.
- `scripts/`: release artifact validation helpers.
- `.github/workflows/`: CI and GitHub Release automation.
- `package.json`, `package-lock.json`: package metadata, scripts, and dependency lock.
- `CHANGELOG.md`: meaningful project changes.

For code changes, update the source of truth, regenerate derived files when needed, and keep this map and `docs/ai/` accurate when structure, ownership, or workflows change.

## Change rules

- Classify the change first; make the smallest complete, relevant edit.
- Keep code clear, modular, and explicit. Prefer existing capabilities; avoid needless dependencies, abstractions, duplication, and comments that restate code. Comment intent or non-obvious constraints.
- Treat YAML passed to `YAMLParser` as external, untrusted input. Keep syntax validation intact and handle parser errors explicitly.
- Validate external input, handle errors explicitly, and never expose or commit secrets or sensitive data.
- Keep generated `.bpmn` examples consistent with their source `.yaml` files when changing BPMN generation.
- Edit sources of truth, regenerate derived files when needed, and document that relationship. Do not edit `dist/` by hand.
- Keep user and AI documentation accurate. Update `docs/ai/` when structure, ownership, or workflows change; add a concise changelog entry for every meaningful change.
- Preserve the public TypeScript and CLI APIs unless the task requires an API change. Check Node.js support and API compatibility before upgrading major dependencies.

## Verification

For code changes, run the complete applicable suite: relevant tests plus project-defined lint, formatting, type, static, build, package, configuration, dependency, security, and workflow checks. Add or update regression coverage for bug fixes. Choose checks that match the project's architecture and risk; do not claim checks you did not run. Documentation-only edits need consistency and repository checks, not irrelevant code checks.

Useful project checks:

- `npm ci`
- `npm test` (includes the TypeScript build and Node.js regression tests)
- `npm run build`
- `npm ls js-yaml`
- `npm run pack:release` (validates the distributable npm archive)

## Versioning and releases

Use the version in `package.json` and `package-lock.json` as the project version source and Semantic Versioning: breaking change = major, compatible capability = minor, compatible fix = patch. Update the changelog and all exposed version metadata for code changes. Start new projects at `0.1.0`.

The project distributes an npm package. The GitHub Actions release workflow validates a requested immutable `vMAJOR.MINOR.PATCH` tag, checks out that tag, runs tests and build, validates the packed npm artifact, then attaches the versioned tarball and checksum to a GitHub Release. It supports tag pushes and manual reruns of existing tags. It must not publish to npm; external registry publishing is a separate, explicitly authorized step.

Keep release readiness separate from actually publishing, deploying, or creating releases: those external actions need explicit authorization. Publishing must depend on successful test/build and artifact checks, and use `contents: write` only in the publish job when needed. Serialize concurrent publishes for the same tag. Make publishing safe to retry: do not create a duplicate GitHub Release when one already exists. Validate package artifacts for validity, corruption or truncation, required contents, and prohibited local or sensitive files. Produce versioned artifacts and checksums when applicable; document release notes and recognize prereleases.

Before completing release-pipeline work, inspect all workflows and verify their triggers, permissions, dependencies, artifact paths and checks, and that manual reruns check out the requested tag. Run applicable checks and inspect the final diff. Report whether the pipeline was validated locally; do not imply that a release was published or verified on GitHub unless that actually happened.

## Completion

Finish only when the requested change, relevant tests and checks, version/changelog, affected documentation, generated artifacts, and workflow consistency are complete. Report what changed, checks run, and any limitation that remains.
