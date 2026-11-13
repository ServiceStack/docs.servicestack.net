---
title: Security Updates and Support
---

[Security overview](/security/) · [Vulnerability reporting](/security/reporting) · [CRA readiness](/security/cra)

Use exact package versions and advisory-specific guidance when evaluating security updates. This page does not introduce a new LTS branch, fixed backport schedule or indefinite security-support commitment.

## Reporting older releases

Please report suspected vulnerabilities in any version, including pre-release packages, and identify the version concerned. Acceptance of a report does not itself establish ongoing maintenance or backport availability for that release.

The [security policy](https://github.com/ServiceStack/ServiceStack/blob/main/SECURITY.md) recommends using the latest stable release where possible and consulting each advisory for its required fixed version.

## Selecting an update

1. Check [published advisories](https://github.com/ServiceStack/ServiceStack/security/advisories) and the [release history](/release-notes-history) for the affected and fixed versions.
2. Distinguish a source fix or pre-release build from a stable package available through NuGet.
3. Restore your application and check its actual resolved dependency versions, including transitive packages.
4. Test the update against your application and deploy the updated artifacts.
5. Retain the corresponding inventory and assessment evidence for your deployment.

A framework update does not automatically patch an externally installed .NET runtime, operating system, database server or native library. Track those components separately. A package version with no match in a particular scanner is not a guarantee that all of its behavior is secure.

## Security support and commercial support

Commercial subscription/support arrangements and product security-support periods are distinct. The existence or expiry of a subscription should not be used to infer a particular product's CRA support period, free-update entitlement or backport policy.

Formal CRA product security-support periods and associated commitments remain under assessment, as stated on the [CRA and CE-marking page](/security/cra). No product-specific support schedule is established by this documentation. When published, such schedules must identify the covered products, versions, dates and upgrade paths.

## Evidence retention and end of life

Security inventories are versioned historical records. Keeping an older SBOM available does not mean that its release remains supported or that its original dependencies remain free of later advisories.

GitHub Actions artifacts are retained for a limited period. Public release assets are the preferred download location for published evidence; customers should retain their reviewed ZIP, checksum, provenance and application inventory. See [artifact access and retention](/security/sbom-vex).

Any future support-period or end-of-life announcement should be read with its explicit product scope and residual-risk guidance. Do not infer such a decision solely from the presence or absence of a download.
