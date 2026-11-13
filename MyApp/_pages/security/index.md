---
title: ServiceStack Security
---

ServiceStack publishes product security information and version-specific software inventories for customers and suppliers assessing their use of ServiceStack. This section is the public reference for product security, vulnerability reporting, software inventories, assessment evidence and EU Cyber Resilience Act (CRA) readiness. Customers and suppliers can use **https://docs.servicestack.net/security/** as a single entry point.

All source code for ServiceStack's NuGet packages is public, including the full history of every change. Packages are built and published to NuGet.org by public GitHub Actions workflows using NuGet Trusted Publishing, so each release can be traced to a public commit and the public run that built it. See [open source and verifiable publishing](/security/secure-development#open-source-and-verifiable-publishing).

<div class="not-prose my-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
  <div>
    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Published Security Advisories</h3>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Disclosed vulnerabilities, affected versions and fixes are published as GitHub Security Advisories.</p>
  </div>
  <a href="https://github.com/ServiceStack/ServiceStack/security/advisories" class="inline-flex shrink-0 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:no-underline">View Advisories &rarr;</a>
</div>

## Supplier review evidence

The [supplier assurance directory](/security/supplier-assurance) maps common policy, certification, audit, development, regulatory and lifecycle questions to public evidence and current status. The [information security policy](/security/information-security-policy) provides our public policy summary.

| Requested information | Public information and evidence |
| --- | --- |
| Software Bill of Materials (SBOM) | [Download release security bundles and verify their contents](/security/sbom-vex) |
| Vulnerability Exploitability eXchange (VEX) | [Availability, interpretation and version scope](/security/sbom-vex#vex-information) |
| Penetration test report or executive summary | [Published assessments and current report availability](/security/assessments) |
| Whether CE marking will be applied where required | [CRA readiness and CE-marking position](/security/cra) |
| Vulnerability reporting and coordinated disclosure | [ServiceStack security policy](https://servicestack.net/security) |

These pages and the published evidence are provided in English. Customers can reference them in supplier assessments without requesting copies of internal company policies.

## Explore security information

- [Supplier security assurance](/security/supplier-assurance) — policy and evidence directory, certification status and regulatory applicability.
- [Information security policy](/security/information-security-policy) — governance, access, information handling and security responsibilities.
- [Vulnerability reporting and disclosure](/security/reporting) — private reporting channels, report contents and published advisories.
- [SBOM and VEX downloads](/security/sbom-vex) — release bundles, integrity verification and vulnerability-impact statements.
- [Security assessments](/security/assessments) — internal review evidence and penetration-test report availability.
- [Secure development and supply chain](/security/secure-development) — source review, release evidence and dependency monitoring.
- [Security updates and support](/security/support) — upgrade guidance, version boundaries and support-period status.
- [Application security guides](/security/application-security) — authentication, authorization, tenant isolation, validation and deployment guidance.
- [EU CRA and CE marking](/security/cra) — readiness work, application dates and current conformity position.

## Match evidence to the software you use

Identify the NuGet package ID, exact package version and target framework used by your application. If you receive DLLs through another vendor, also establish which package or private build produced them. An assembly filename alone does not identify a release or its resolved dependencies.

For example, the following commonly embedded components are covered by the corresponding package entries in the published 10.4.2 bundle:

| Component | NuGet package ID |
| --- | --- |
| ServiceStack.Common.dll | ServiceStack.Common |
| ServiceStack.Interfaces.dll | ServiceStack.Interfaces |
| ServiceStack.OrmLite.dll | ServiceStack.OrmLite |
| ServiceStack.OrmLite.Sqlite.dll | ServiceStack.OrmLite.Sqlite |
| ServiceStack.Text.dll | ServiceStack.Text |

Use the bundle's `index.json`, package mapping and per-release manifests to identify the included products. The bundle is broader than this example list.

An SBOM for one release is not evidence for a different release. NuGet dependency ranges also allow an integrating application to resolve different dependency versions. Maintain an application-level inventory alongside the ServiceStack package inventory, including the database provider, native dependencies and deployed .NET runtime where applicable.

## Published evidence status

Last checked: **12 November 2026**.

- The [10.4.2 security bundle](https://github.com/ServiceStack/ServiceStack/releases/download/v10.4.2/servicestack-security-10.4.2.zip) and its [SHA-256 checksum](https://github.com/ServiceStack/ServiceStack/releases/download/v10.4.2/servicestack-security-10.4.2.zip.sha256) are available. The bundle contains 49 package inventories and no reviewed VEX snapshots.
- The [10.5 release](https://github.com/ServiceStack/ServiceStack/releases/tag/v10.5) does not yet have a security bundle attached as of this check. Check that release's Assets for subsequent availability; use neither the 10.4.2 bundle nor an example download URL as a substitute for missing 10.5 evidence.
- [Assessment availability](/security/assessments) and [CRA/CE status](/security/cra) are stated separately. An inventory download is not a penetration-test report, certificate or declaration of conformity.

## Report a vulnerability privately

Follow the [security policy](https://servicestack.net/security) and use [GitHub private vulnerability reporting](https://github.com/ServiceStack/ServiceStack/security/advisories/new) or the [security reporting portal](https://account.servicestack.net/security). Please use one channel and keep undisclosed vulnerability details out of public issues.

Public evidence is scoped to the products and versions it identifies. Confidential investigation details, infrastructure inventories and internal risk records are not part of the public assurance bundle.
