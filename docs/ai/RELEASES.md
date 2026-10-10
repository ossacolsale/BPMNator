# Release and package guide

This repository distributes an npm package and CLI. Keep release readiness separate from publishing or creating external releases; those actions require explicit authorization.

## Version and package

- `package.json` and `package-lock.json` are the version sources. Use Semantic Versioning and keep exposed version metadata aligned. Documentation-only changes do not need a version bump.
- The package contains generated `dist/` output, `README.md`, and `LICENSE`. Edit TypeScript sources and regenerate `dist/` with `npm run build`; never edit generated files by hand.
- `npm run pack:release` creates `.release/<name>-<version>.tgz` and a SHA-256 checksum. It checks archive readability, required package files, prohibited local or sensitive files, and package name/version consistency. When `RELEASE_TAG` is set, it must match the package version.

## CI and GitHub Release workflow

- CI runs on pushes and pull requests using Node.js 20 and 22. It runs `npm ci`, `npm test`, `npm run build`, `npm ls js-yaml`, `npm run pack:release`, and `python3 scripts/validate_repo.py`.
- The release workflow accepts `vMAJOR.MINOR.PATCH` tags, including prerelease suffixes, and manual reruns for an existing tag. It checks out the requested tag, validates tests/build/package, and uploads the tarball and checksum as a short-lived artifact.
- The separate publish job alone has `contents: write`. It creates a GitHub Release when none exists, marks prereleases, generates release notes, and uploads or replaces the assets on rerun. Concurrent publishes for the same tag are serialized.
- Releases attach versioned package artifacts to GitHub Releases. The workflow must not publish to npm. Keep permissions least-privilege, validation ahead of publishing, artifact paths/checks consistent, and reruns safe.

Before changing release automation, inspect every workflow and the packaging/validation scripts. Verify triggers, permissions, job dependencies, artifact paths and checks, and that manual reruns check out the requested tag. Run applicable local checks, inspect the final diff, and distinguish local validation from anything verified on GitHub. Do not claim a release was published or verified unless it was.
