---
title: Secure Development and Supply Chain
---

[Security overview](/security/) · [SBOM and VEX downloads](/security/sbom-vex) · [Security assessments](/security/assessments)

This page summarizes publicly inspectable development and supply-chain evidence. It does not publish private operational records or assert independent certification of every development control.

## Source review and remediation

ServiceStack source and security-change reports are available in the [ServiceStack repository](https://github.com/ServiceStack/ServiceStack). The [assessment evidence page](/security/assessments) links the internal AI-assisted security and reliability review and package reports.

Use source reports to understand the documented findings and changes. Match the source commit to the exact package being assessed before claiming a fix is present in a deployed release. Source availability, a review report and an automated test result answer different assurance questions.

## Release and dependency evidence

The public [security tooling](https://github.com/ServiceStack/ServiceStack/tree/main/build/security) maintains a configured package inventory and generates CycloneDX evidence from exact NuGet archives. Each release record identifies the original package hash, shipped frameworks, declared dependency ranges and a resolved consumer baseline.

The independent [Package Security Evidence workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/package-security.yml) processes outputs from successful package builds. A security run identifies its source pack run and commit. NuGet Publish verifies the matching package archives against this evidence before pushing them, then retains the evidence as **ServiceStack Published Security**. It attaches a security ZIP and checksum to the matching GitHub release, preparing a versioned draft with the assets if the release has not yet been created. The [release security workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/release-security.yml) can reattach that retained evidence without downloading packages from NuGet again.

New release bundles preserve the original pack evidence and include `publication.json` identifying the NuGet Publish run. Earlier bundles, such as 10.4.2, were generated from published NuGet archives and identify that source in their provenance. Preserve the manifest, source/publication records and archive checksum with the evidence you review; these sources need not have identical resolved consumer graphs.

See [download and verification instructions](/security/sbom-vex) for release assets, build artifacts and limitations.

## Dependency advisory monitoring

The [scheduled security workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/security-core.yml) checks retained dependency graphs against current NuGet advisory data. A new advisory can make a historical graph fail a later scan without changing the original SBOM. Observations are retained for review; successful historical results are not a continuing all-clear.

The workflow covers managed package matches in its stated data source. First-party code, native engine versions, platform runtimes and an integrating application's own dependency resolutions need separate assessment. A Microsoft-maintained dependency is still subject to advisory review.

## Vulnerability impact and fixes

A dependency match is an investigation input. Product impact depends on the vulnerable behavior, application paths, platform and exact dependency versions. Reviewed VEX statements, when available, record a vulnerability-specific assessment; an empty VEX set does not mean no investigation is necessary.

Fixes in source or pre-release packages must be distinguished from confirmed stable availability. Consult published advisories and [security update guidance](/security/support), then verify the resolved packages in your own build.

## Internal governance evidence

The public source, workflows, review reports, security policy and release bundles are the standard self-service evidence set. These pages are not a published copy of every internal policy, a signed SDLC audit or an organizational security certification. See [assessment availability](/security/assessments) and [CRA readiness](/security/cra) for the current assurance boundaries.
