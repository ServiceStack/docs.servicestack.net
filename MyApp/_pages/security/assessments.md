---
title: Security Assessments and Testing Evidence
---

[Security Assurance](/security/) · [SBOM and VEX Downloads](/security/sbom-vex) · [CRA and CE Marking](/security/cra)

This page identifies published assessment evidence and the limits of the conclusions it supports. Last reviewed: **13 November 2026**.

## Penetration-test report availability

No independent penetration-test report or independent penetration-test executive summary is currently published through this assurance documentation. The internal source review described below is available as supporting evidence, but is not a substitute for such a report.

A proposed test, access to a testing tool, a dependency scan or the existence of CI security jobs does not establish that a penetration test has been completed. Customers requiring independent assessment evidence should record it as unavailable from the current public evidence set rather than treating the internal review as an external test.

## Published internal security review

The [ServiceStack v10.2 release materials](https://docs.servicestack.net/releases/v10_02) document an internal AI-assisted security and reliability review. Public reports describe findings and source changes across packages, including input handling, serialization, path boundaries, SQL construction and resource management.

| Area | Public source report |
| --- | --- |
| ServiceStack.Common | [Common security changes](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Common/SECURITY_CHANGES.md) |
| ServiceStack.Interfaces | [Interfaces security changes](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.Interfaces/SECURITY_CHANGES.md) |
| ServiceStack.Text | [Text security changes](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Text/SECURITY_CHANGES.md) |
| ServiceStack.OrmLite and database dialects | [OrmLite security changes](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/SECURITY_CHANGES.md) |
| Broader review scope | [v10.2 audit and hardening overview](https://docs.servicestack.net/releases/v10_02) |

These are living source reports. A source change is not by itself proof that a particular deployed release contains the fix. For version-specific review, identify the package version and source commit, and preserve a commit-pinned copy of the relevant report and verification evidence.

## Assessment dates, scope and remediation status

The internal source-review overview was published with **v10.2 on 13 August 2026**. This is the release documentation date, not a claimed start/end date for a penetration test. The linked security-change reports continue to evolve; use commit-pinned reports for a historical assessment. Current automated dependency observations carry their own scan dates and package scopes.

No dated external penetration-test report is available in this public evidence set. An assessment of a deployed example application would cover that application's tested configuration and package versions, rather than every library API, consumer configuration or company system.

A publishable assessment executive summary needs to identify:

- the assessment dates, assessor and methodology, including automated, AI-assisted or human-led testing;
- the tested application, source revision, package versions and environment;
- authenticated roles, tenant boundaries, included attack surfaces and exclusions;
- findings by severity, affected versions and remediation or mitigation status;
- verification or retest dates and any unresolved high/critical findings or residual risks.

This describes the evidence needed for a future summary; it is not a report of a completed test. Any high/critical-risk mitigation statement must be tied to actual findings, fixes and verification in that scope. Sensitive reproduction details can be omitted from a public summary without hiding unresolved risk.

## How to interpret the evidence

| Evidence | What it supports | What it does not establish |
| --- | --- | --- |
| Internal AI-assisted source review | Recorded source findings and remediation work in the documented scope | Independent penetration testing or exhaustive vulnerability coverage |
| Automated tests and CI results | Behavior checked by the identified tests at a particular revision | Security of all untested paths or configurations |
| SBOM and managed dependency observations | Package identity, dependency inventory and advisory matches in the stated data source | Runtime exploitation assessment, first-party code coverage or complete native-engine coverage |
| Reviewed VEX, when published | A documented impact assessment for identified vulnerabilities and product variants | A general security certification or blanket all-clear |

No blanket statement that all high or critical risks are mitigated is made by these pages. Such a conclusion requires an identified assessment scope, findings, remediation status and verification against the relevant release.

## Certifications and confidential material

ServiceStack has not obtained independent organizational security or privacy certifications such as ISO 27001 or SOC 2. No independent organizational security-controls audit report is available in this public evidence set. The published product evidence should not be represented as either. See the [supplier assurance directory](/security/supplier-assurance) for the full evidence mapping.

The public review reports, release evidence and security policy are the standard self-service assurance materials. Raw investigation records, sensitive exploitation details and internal infrastructure information are not included in public security bundles.

## Vulnerability disclosure

Use the [ServiceStack security policy](https://servicestack.net/security) for private reporting and coordinated disclosure. Published assessments are historical evidence and do not replace monitoring current advisories and the actual dependencies resolved by your application.
