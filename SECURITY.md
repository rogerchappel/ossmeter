# Security Policy

## Supported Versions

ossmeter has not published a stable 1.0 release yet.

| Version | Supported |
| --- | --- |
| 0.x | Best-effort security fixes |

## Reporting a Vulnerability

Please do not report suspected vulnerabilities in public issues, pull requests, or discussions.

Open a private security advisory on GitHub if available. If that is not available, ask maintainers through public project channels for a private reporting path without including exploit details, secrets, personal data, or sensitive technical details.

## Scope

In scope:

- Vulnerabilities in ossmeter source, CLI behavior, or release packaging.
- Insecure defaults shipped by this project.
- CI or dependency guidance maintained here.

Out of scope:

- General support requests.
- Issues in unrelated downstream projects.
- Findings that require publishing private workspace paths, secrets, or repository contents.

## Local-first posture

`ossmeter scan` is read-only and makes no network calls. It shells out to local `git` with fixed argument lists and does not interpolate user input through a shell.

## Disclosure

Coordinate disclosure with maintainers before publishing vulnerability details.
