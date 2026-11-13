---
title: Supplier Security Assurance
---

[Security overview](/security/) · [Information security policy](/security/information-security-policy) · [CRA readiness](/security/cra)

This page maps common supplier security questions to ServiceStack's public policies, product evidence and current assurance status. The materials are provided in English. Identify the package IDs, exact versions and deployment scope before using evidence in an assessment.

Last reviewed: **13 November 2026**.

## Assurance evidence directory

| Review topic | Public evidence and current position |
| --- | --- |
| Information security policy | [Public policy summary](/security/information-security-policy), including scope, accountability, information handling and review. |
| Security and privacy certifications | ServiceStack has not obtained independent organizational security or privacy certifications such as ISO 27001 or SOC 2. No certificate or ISO Statement of Applicability is supplied. A service provider's certification is not a ServiceStack certification. |
| Independent information security audits | No independent organizational security-controls audit report is available in this evidence set. [Internal product review evidence](/security/assessments) has a different scope. |
| Penetration tests, vulnerability assessments and remediation | [Assessment evidence](/security/assessments) identifies the published internal review and current penetration-test report availability. No blanket statement that all high/critical findings have been mitigated is supplied. |
| Incident detection, response and recovery capabilities | [Application security guides](/security/application-security) describe configurable logging and security features. [Reporting and disclosure](/security/reporting) describes product vulnerability handling. These libraries are not a managed incident-response service; see the responsibility boundaries below. |
| Open-source and software supply-chain risks | All package source and its complete commit history are public. Packages are built and published to NuGet.org by public GitHub Actions workflows using NuGet Trusted Publishing, with Source Link commit metadata and hash-matched release evidence. See [open source and verifiable publishing](/security/secure-development#open-source-and-verifiable-publishing), plus dependency selection and advisory monitoring. |
| Vulnerability disclosure programme | [Private reporting and coordinated disclosure](/security/reporting), the [published disclosure policy](https://servicestack.net/security) and [public advisories](https://github.com/ServiceStack/ServiceStack/security/advisories). |
| NIS2 | See [NIS2 applicability](#nis2-applicability). No organization-wide NIS2 compliance assertion is supplied. |
| EU AI Act | See [EU AI Act applicability](#eu-ai-act-applicability). No blanket AI Act compliance assertion is supplied for all products or uses. |
| CE marking | [CRA readiness and CE-marking position](/security/cra). The planned approach is to apply marking where legally required after the applicable conformity work; current CRA conformity is not asserted. |
| Software Bill of Materials | [Version-specific SBOM downloads and verification](/security/sbom-vex). Check the included package mapping, release version and framework coverage. |
| VEX and ongoing updates | [Reviewed VEX availability and interpretation](/security/sbom-vex#vex-information). Reviewed statements are included when available; an absent VEX file is not an all-clear. No unconditional per-release VEX or LTS maintenance commitment is established. |
| Secure software development lifecycle | [Development process and inspectable evidence](/security/secure-development). This describes the documented process; it is not an independently certified SDLC or a claim of complete NIST SSDF or IEC 62443-4-1 conformance. |
| Support, termination and end of life | [Security updates and support](/security/support) explains update guidance, residual-risk considerations and the status of formal product security-support schedules. |

## Product and service responsibility boundaries

ServiceStack developer libraries run within the integrating application's environment. The application operator controls deployment, authentication configuration, tenant authorization, logging, monitoring, backups and recovery. Product capabilities must be configured and tested in that environment; their availability does not establish an operational security service.

No managed incident-response SLA, application recovery time objective (RTO) or recovery point objective (RPO) is provided by these library assurance pages. A disclosure acknowledgement target is not an incident-resolution or recovery guarantee. Separate hosted services or contractual services require their own scoped assessment.

## NIS2 applicability

NIS2 applicability requires an entity-level assessment of the services provided, relevant sector, size, jurisdiction and applicable national implementation. A customer's regulated status does not, on its own, determine a software supplier's status. Supply-chain requirements may also be relevant to the customer's review. See the [European Commission's NIS2 guidance](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive).

ServiceStack's entity-level applicability assessment remains under review. These pages provide scoped product and security-practice evidence, rather than an organization-wide NIS2 compliance declaration or an unsupported out-of-scope conclusion.

## EU AI Act applicability

AI Act obligations depend on the actual system or model, intended purpose and the organization's role. See the [European Commission's AI Act guidance](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) and the [AI Act legal text](https://eur-lex.europa.eu/eli/reg/2024/1689).

An inventory of general-purpose serialization, contracts or data-access libraries does not establish that an AI system or model is supplied. Equally, that observation does not determine the status of ServiceStack's separate AI features, third-party model integrations, an integrating application's AI functionality or internal AI-assisted development. Those uses require separate assessment. No product-wide or organization-wide AI Act conformity claim is made by this security evidence set.

## Disclosure and evidence handling

The linked public summaries, source reports, advisories and versioned release bundles are the standard self-service assurance materials. Internal infrastructure inventories, credentials, personal information, undisclosed exploit details and raw investigation records are confidential and are not included in public bundles.

Where evidence is unavailable, this page states that limitation; confidentiality is not used to imply that an unpublished certificate, test or completed assessment exists. Any additional sharing of sensitive evidence requires a scoped review.

Retain the documents, package versions, source revisions, checksums and review date used for your assessment. The publication of a policy or inventory is not proof that every control has been independently audited or that a customer's integrated product is compliant.
