---
title: Secure Development and Supply Chain
---

[Security overview](/security/) · [SBOM and VEX downloads](/security/sbom-vex) · [Security assessments](/security/assessments)

This page describes ServiceStack's documented software development lifecycle and publicly inspectable supply-chain evidence. It covers development, verification, release and maintenance of the libraries, with coverage determined by the identified project and workflow.

Last reviewed: **13 November 2026**. See also the [information security policy](/security/information-security-policy) and [supplier assurance directory](/security/supplier-assurance).

## Development lifecycle

| Stage | Documented practice and inspectable evidence |
| --- | --- |
| Change definition and design | Source changes, pull requests and release notes identify behavior and compatibility changes. Security-change reports document reviewed trust boundaries and mitigations; they are not a complete, independently audited threat model for every package. |
| Implementation and review | Git history preserves changes and author attribution. Maintainers review contributions and larger changes through the repository process. Public source access does not establish that every commit received an independent second-person review. |
| Verification | Unit and integration tests exercise library behavior. The [NuGet Pack workflow](https://github.com/ServiceStack/ServiceStack/blob/main/.github/workflows/nuget-pack.yml) builds and tests configured projects, including database and endpoint tests, before its package stage. Individual workflows identify the actual test selection and target framework. |
| Packaging and publication | A successful pack produces exact NuGet archives. Separate security generation records their identity, dependencies and hashes; NuGet Publish verifies matching evidence before publication. See the release process below. |
| Maintenance | Scheduled dependency checks, private reports and source review inform vulnerability investigation. Published advisories, security-change reports and release notes communicate findings, fixes and upgrade guidance within their stated scope. |

Security-sensitive review areas documented in the internal product audit include untrusted serialization, input limits, file and path access, SQL construction and resource management. Relevant regression tests and source changes provide evidence for specific cases. Test counts or a successful CI run alone do not establish coverage of every attack path.

The published process is evidence of development practices, not certification against NIST SP 800-218 (SSDF) or ISA/IEC 62443-4-1. Formal product-wide risk assessments and additional CRA lifecycle commitments remain part of [readiness work](/security/cra).

## Open source and verifiable publishing

The complete source code for every ServiceStack NuGet package is public in the [ServiceStack repository](https://github.com/ServiceStack/ServiceStack), along with the full history of every commit and change. The build, test, packaging and publishing workflows are also public source in the same repository, so the process that produces each package can be inspected alongside the code it builds.

Packages are built and published to NuGet.org by these public GitHub Actions workflows rather than from a developer machine:

- **Public build pipeline** — the [NuGet Pack workflow](https://github.com/ServiceStack/ServiceStack/blob/main/.github/workflows/nuget-pack.yml) builds and tests packages from a commit in the public repository, and the [NuGet Publish workflow](https://github.com/ServiceStack/ServiceStack/blob/main/.github/workflows/nuget-push.yml) pushes those exact archives to NuGet.org.
- **NuGet Trusted Publishing** — publishing authenticates with [NuGet.org Trusted Publishing](https://learn.microsoft.com/nuget/nuget-org/trusted-publishing), exchanging a GitHub Actions OIDC identity for a short-lived key bound to the ServiceStack repository and publish workflow. No long-lived NuGet API key is stored for publishing. 
- **Source-linked packages** — packages embed [Source Link](https://learn.microsoft.com/dotnet/standard/library-guidance/sourcelink) metadata identifying the repository and exact source commit they were built from, so a shipped `.dll` can be traced back to the public commit.
- **Hash-matched release evidence** — each [release security bundle](/security/sbom-vex) records the SHA-256 of every published `.nupkg`, the pack and publish workflow runs that produced it, and its source commit.

Together, these give customers an independent way to check a package: compare its hash with the release evidence, follow its source commit to the public history, and review the public workflow run that built and published it. A package whose hash is not in the published evidence for that release was not produced by this pipeline.

## Source review and remediation

ServiceStack source and security-change reports are available in the [ServiceStack repository](https://github.com/ServiceStack/ServiceStack). The [assessment evidence page](/security/assessments) links the internal AI-assisted security and reliability review and package reports.

Use source reports to understand the documented findings and changes. Match the source commit to the exact package being assessed before claiming a fix is present in a deployed release. Source availability, a review report and an automated test result answer different assurance questions.

## Dependency selection

ServiceStack keeps external dependencies limited and commonly uses Microsoft-maintained .NET components. Dependencies are identified from the actual package and its declared dependency groups, rather than assuming that every project reference ships to consumers. Publisher reputation does not establish vulnerability absence: Microsoft and other third-party components remain subject to advisory review.

Downstream applications control their own restore results and runtime environment. Native engines, externally installed runtimes and content/template hosts need separate inventory and assessment where the managed package graph does not describe them completely.

## Release and dependency evidence

The public [security tooling](https://github.com/ServiceStack/ServiceStack/tree/main/build/security) maintains a configured package inventory and generates CycloneDX evidence from exact NuGet archives. Each release record identifies the original package hash, shipped frameworks, declared dependency ranges and a resolved consumer baseline.

The independent [Package Security Evidence workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/package-security.yml) processes outputs from successful package builds. A security run identifies its source pack run and commit. NuGet Publish verifies the matching package archives against this evidence before pushing them, then retains the evidence as **ServiceStack Published Security**. It attaches a security ZIP and checksum to the matching GitHub release, preparing a versioned draft with the assets if the release has not yet been created. The [release security workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/release-security.yml) can reattach that retained evidence without downloading packages from NuGet again.

New release bundles preserve the original pack evidence and include `publication.json` identifying the NuGet Publish run. Earlier bundles, such as 10.4.2, were generated from published NuGet archives and identify that source in their provenance. Preserve the manifest, source/publication records and archive checksum with the evidence you review; these sources need not have identical resolved consumer graphs.

See [download and verification instructions](/security/sbom-vex) for release assets, build artifacts and limitations.

## Dependency advisory monitoring

The [scheduled security workflow](https://github.com/ServiceStack/ServiceStack/actions/workflows/security-core.yml) checks retained dependency graphs against current NuGet advisory data. A new advisory can make a historical graph fail a later scan without changing the original SBOM. Observations are retained for review; successful historical results are not a continuing all-clear. The daily scan job fails on matched advisories to provide a review signal. Package evidence generation and publication report advisory matches as warnings; those warnings are not an automatic exploitability decision or a blanket finding closure.

The workflow covers managed package matches in its stated data source. First-party code, native engine versions, platform runtimes and an integrating application's own dependency resolutions need separate assessment. A Microsoft-maintained dependency is still subject to advisory review.

## Vulnerability impact and fixes

A dependency match is an investigation input. Product impact depends on the vulnerable behavior, application paths, platform and exact dependency versions. Reviewed VEX statements, when available, record a vulnerability-specific assessment; an empty VEX set does not mean no investigation is necessary.

Fixes in source or pre-release packages must be distinguished from confirmed stable availability. Consult published advisories and [security update guidance](/security/support), then verify the resolved packages in your own build.

## Internal governance evidence

The public source, workflows, review reports, security policy and release bundles are the standard self-service evidence set. These pages are not a published copy of every internal policy, a signed SDLC audit or an organizational security certification. See [assessment availability](/security/assessments) and [CRA readiness](/security/cra) for the current assurance boundaries.
