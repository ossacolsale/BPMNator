#!/usr/bin/env python3
"""Check repository guidance, package metadata, Markdown links, and CI/release shape."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "AGENTS.md",
    "README.md",
    "CHANGELOG.md",
    "package.json",
    "package-lock.json",
    "docs/ai/INDEX.md",
    "docs/ai/CODE-MAP.md",
    ".github/copilot-instructions.md",
    ".github/workflows/ci.yml",
    ".github/workflows/release.yml",
    "scripts/package-release.mjs",
)
HEADINGS = (
    "Purpose and navigation",
    "Repository map",
    "Change rules",
    "Verification",
    "Versioning and releases",
    "Completion",
)


def main() -> int:
    errors = [f"missing required file: {name}" for name in REQUIRED if not (ROOT / name).is_file()]
    if errors:
        return report(errors)

    agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    for heading in HEADINGS:
        if f"## {heading}" not in agents:
            errors.append(f"AGENTS.md missing section: {heading}")

    for markdown in ROOT.rglob("*.md"):
        if ".git" in markdown.parts or "node_modules" in markdown.parts or "dist" in markdown.parts:
            continue
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", markdown.read_text(encoding="utf-8")):
            target = re.split(r"[?#]", target, maxsplit=1)[0]
            if not target or "://" in target or target.startswith("mailto:"):
                continue
            if not (markdown.parent / target).resolve().exists():
                errors.append(f"broken link in {markdown.relative_to(ROOT)}: {target}")

    import json

    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    lock = json.loads((ROOT / "package-lock.json").read_text(encoding="utf-8"))
    if not re.fullmatch(r"\d+\.\d+\.\d+", package["version"]):
        errors.append("package.json version must be semantic major.minor.patch")
    if package["version"] != lock["version"] or package["version"] != lock["packages"][""]["version"]:
        errors.append("package.json and package-lock.json versions must match")
    if lock["packages"][""]["dependencies"] != package["dependencies"]:
        errors.append("package.json and package-lock.json dependencies must match")
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    if f"## {package['version']}" not in changelog:
        errors.append(f"CHANGELOG.md has no section for package version {package['version']}")

    copilot = (ROOT / ".github/copilot-instructions.md").read_text(encoding="utf-8")
    claude = (ROOT / "CLAUDE.md").read_text(encoding="utf-8") if (ROOT / "CLAUDE.md").exists() else ""
    if "AGENTS.md" not in copilot or "AGENTS.md" not in claude:
        errors.append("agent compatibility files must point to canonical AGENTS.md")

    ci = (ROOT / ".github/workflows/ci.yml").read_text(encoding="utf-8")
    for marker in ("name:", "pull_request:", "push:", "npm ci", "npm test", "npm run build", "npm run pack:release"):
        if marker not in ci:
            errors.append(f"CI workflow missing expected marker: {marker}")

    release = (ROOT / ".github/workflows/release.yml").read_text(encoding="utf-8")
    for marker in ("workflow_dispatch:", "inputs:", "fetch-depth: 0", "contents: write", "gh release view", "gh release create"):
        if marker not in release:
            errors.append(f"release workflow missing expected marker: {marker}")

    nested = [p for p in ROOT.rglob("AGENTS.md") if p != ROOT / "AGENTS.md" and ".git" not in p.parts and "node_modules" not in p.parts]
    if nested:
        errors.append("unexpected nested AGENTS.md: " + ", ".join(str(p.relative_to(ROOT)) for p in nested))
    return report(errors)


def report(errors: list[str]) -> int:
    if errors:
        print("Repository validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Repository validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
