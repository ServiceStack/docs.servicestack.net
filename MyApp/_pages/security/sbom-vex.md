---
title: SBOM and VEX Downloads
---

[Security Assurance](/security/) · [Security Assessments](/security/assessments) · [CRA and CE Marking](/security/cra)

ServiceStack's security bundles provide machine-readable software inventories and supporting evidence for identified NuGet releases. Downloading these files does not require a ServiceStack subscription.

## Download a release bundle

Open the [ServiceStack GitHub releases](https://github.com/ServiceStack/ServiceStack/releases), select the release matching your packages, and expand **Assets**. When generation has completed successfully, the release includes:

- `servicestack-security-<version>.zip`
- `servicestack-security-<version>.zip.sha256`

A release tag such as `v10.4` maps to NuGet version `10.4.0`. A patch tag such as `v10.4.2` maps to `10.4.2`.

### Verified download: 10.5.0

The following files were verified on **14 November 2026**:

- [Download the 10.5.0 security ZIP](https://github.com/ServiceStack/ServiceStack/releases/download/v10.5/servicestack-security-10.5.0.zip)
- [Download its SHA-256 checksum](https://github.com/ServiceStack/ServiceStack/releases/download/v10.5/servicestack-security-10.5.0.zip.sha256)
- [View the originating security workflow](https://github.com/ServiceStack/ServiceStack/actions/runs/43396620198)

This bundle contains 49 package release records, all for 10.5.0. Its provenance identifies the exact published NuGet archives as the source and the dependency graph as a consumer baseline resolved at generation time.

### Verified download: 10.4.2

The following files were verified on **12 November 2026**:

- [Download the 10.4.2 security ZIP](https://github.com/ServiceStack/ServiceStack/releases/download/v10.4.2/servicestack-security-10.4.2.zip)
- [Download its SHA-256 checksum](https://github.com/ServiceStack/ServiceStack/releases/download/v10.4.2/servicestack-security-10.4.2.zip.sha256)
- [View the originating security workflow](https://github.com/ServiceStack/ServiceStack/actions/runs/39264297239)

This bundle contains 49 package release records, all for 10.4.2. Its provenance identifies the exact published NuGet archives as the source and the dependency graph as a consumer baseline resolved at generation time.

Security generation runs separately after NuGet Pack. NuGet Publish waits for matching evidence, verifies it against the packed archives, and retains it after publishing. A subsequent attachment job prepares the public ZIP and attaches it to the matching release, or creates a versioned draft with the assets ready. Release publication and manual reattachment reuse that evidence without waiting for NuGet indexing. A published package or release does not by itself establish that attachment has completed successfully. If an asset is absent or its generation failed, there is no matching published bundle at that location yet. Check [release-security workflow results](https://github.com/ServiceStack/ServiceStack/actions/workflows/release-security.yml); do not substitute a different release's inventory.

## What is in the ZIP?

The archive preserves the source-project folder layout. Start with the files at its root:

| File | Purpose |
| --- | --- |
| `README.md` | Scope and interpretation guidance |
| `index.json` | Included package IDs, versions, NuGet archive hashes and framework coverage |
| `packages.json` | Package-to-project mapping for the evidence set |
| `source-run.json` | Source release/build, workflow and tooling provenance |
| `publication.json` | NuGet Publish run and its matching pack provenance, in bundles produced by the build-to-release flow |
| `SHA256SUMS` | Checksums for the enclosed evidence files |

Each package has a `security/releases/<version>/` folder containing:

| File or folder | Purpose |
| --- | --- |
| `sbom.cdx.json` | CycloneDX 1.6 JSON inventory combining the package's shipped target-framework graphs |
| `manifest.json` | Original NuGet archive SHA-256, evidence hashes, framework coverage, generator details and limitations |
| `resolution.json` | Declared dependency ranges and exact resolved dependency graphs |
| `audit.json` | Managed NuGet advisory observation at generation time |
| `vex/` | Dated reviewed vulnerability-impact statements, when available |
| `scans/` | Subsequent advisory observations, if included in that evidence set |

Framework-specific graph references distinguish dependency applicability within the combined SBOM. Repeated NuGet package identities across frameworks are intentional. Native payload hashes are inventoried where present; a hash alone does not establish the embedded engine version or its vulnerability status.

## Verify integrity

Download the ZIP and checksum into the same folder. On Linux:

```sh
sha256sum -c servicestack-security-10.5.0.zip.sha256
unzip servicestack-security-10.5.0.zip -d servicestack-security-10.5.0
cd servicestack-security-10.5.0
sha256sum -c SHA256SUMS
```

On macOS, use `shasum -a 256 -c` in place of `sha256sum -c`. On Windows, compare `Get-FileHash <zip-path> -Algorithm SHA256` with the published checksum.

The per-package manifest also identifies the original `.nupkg` hash, allowing you to compare the inventory with the package you obtained. Checksums detect content changes; they are not a digital signature or independent security attestation.

## VEX information

VEX describes an assessed vulnerability's impact on specified product versions and framework variants. ServiceStack renders dated CycloneDX VEX snapshots only when vulnerability-specific reviewed decisions are available. These can identify an affected, fixed, under-investigation or justified not-affected state.

**The absence of VEX means no reviewed statements are included; it does not mean the product has no vulnerabilities.** The verified 10.5.0 and 10.4.2 public bundles contain no VEX snapshots. Do not infer a not-affected decision from an empty decisions list or a scanner returning no matches.

Where a release contains several VEX snapshots, use the most recent applicable assessment and retain the earlier snapshots for history. Read the advisory, affected references, analysis, justification and remediation guidance together. A statement about one release or framework is not a statement about all ServiceStack products or all downstream configurations.

There is no blanket commitment on this page to publish VEX with every release or to maintain an unspecified LTS branch. Applicability depends on the vulnerability assessment and the supported product/version concerned.

## Advisory observations and downstream scope

`audit.json` is a point-in-time observation from NuGet advisory data, not a continuously updated all-clear. The [scheduled security workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/security-core.yml) rescans retained release graphs against current advisory data and preserves observations, including findings. Historical graphs can gain new advisory matches without their original SBOM changing.

Customers should scan their own application's resolved dependency graph and track .NET, operating-system, container and native-engine advisories separately. These package observations do not assess all first-party ServiceStack code or every deployment configuration.

## Build and pre-release evidence

For evidence associated with a particular package build, open its linked [Package Security Evidence workflow run](https://github.com/ServiceStack/ServiceStack/actions/workflows/package-security.yml). Its **Artifacts** section can include:

- **ServiceStack Security** — the evidence tree;
- **ServiceStack Security ZIP** — a compressed bundle and checksum.

Use `source-run.json` to match the security output to its originating pack run and commit, and the manifests to match the actual NuGet archives. GitHub Actions artifact downloads require GitHub sign-in and are retained for 90 days. Public release assets provide the direct download route for released evidence. SBOMs are distributed separately; they are not currently embedded inside the `.nupkg` downloaded from NuGet or MyGet.

Reattaching a release ZIP reuses the retained publication evidence; it does not rerun dependency resolution or perform a new vulnerability assessment. Regenerating source evidence or adding reviewed VEX is a separate operation. Earlier release bundles may have been generated directly from NuGet, as their provenance states. Record the download date, checksum and provenance when retaining evidence for your own review. Actions retention still applies: if the original publication evidence has expired or is unavailable, reattachment fails explicitly rather than substituting another version or a fresh graph.
