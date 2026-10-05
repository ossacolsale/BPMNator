# AI repository guide

This repository publishes BPMNator as an npm package and CLI. Read the [repository map](CODE-MAP.md) before editing. For code changes run `npm ci`, `npm test`, `npm run build`, and `npm ls js-yaml`; before release work also run `npm run pack:release`. GitHub Actions runs CI on pushes and pull requests. Releases are created from immutable semantic version tags after package validation.
