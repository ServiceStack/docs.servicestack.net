---
title: Information Security Policy
---

[Security overview](/security/) · [Supplier assurance](/security/supplier-assurance) · [Secure development](/security/secure-development)

This is the public summary of ServiceStack's existing management-approved information security policy and related information-handling practices. It provides supplier-shareable policy information without disclosing internal access records, operational procedures or infrastructure details. It does not adopt unapproved CRA policy extensions or establish an independent certification.

| Policy information | Details |
| --- | --- |
| Policy owner and approval responsibility | ServiceStack CEO |
| Public summary version | 1.0 |
| Public summary published and reviewed | 13 November 2026 |
| Policy review | Annually and when material changes require an update |
| Scope | ServiceStack employees, contractors and third parties with authorized access to company systems, information or software-development assets |

The publication date identifies this summary; it is not a retrospective effective date for every described control.

## Purpose and accountability

ServiceStack's policy is to protect the confidentiality, integrity and availability of company information and the integrity of its software development and distribution. The CEO is responsible for policy approval and security decisions. Personnel with access to source, release systems or customer information are responsible for protecting that access and raising security concerns.

## Access and authentication

Access is limited to what a person's role requires. Public read access to source code does not grant permission to modify repositories, publish packages or access operational systems. Contributor and operational access is restricted, and access is updated or revoked when responsibilities change or a person leaves.

Strong authentication, private-key access and multi-factor authentication are used for sensitive systems where supported. Credentials, private keys and publishing secrets must not be included in public source, issue reports or support examples. This summary does not assert that all access controls have undergone an independent audit.

## Information handling and privacy

Customer information is limited to what is needed for purchasing, licensing, account administration and support. Payment processing is handled through Stripe. Access to customer information is restricted to personnel who need it for their work. See the [ServiceStack privacy policy](https://servicestack.net/privacy) for public privacy information.

Use minimal, sanitized reproductions for support and security reports. Remove credentials, personal data and unrelated confidential information before sharing. Sensitive information should not be posted in public repositories or forums. Use private reporting channels for suspected vulnerabilities.

Company services use protected transmission channels such as TLS and SSH. Internal access details and security investigation material are not public supplier evidence.

## Software development and supply chain

All product source code, its complete change history and the build and release workflows are public. Packages are published to NuGet.org only through those public workflows using NuGet Trusted Publishing, without a stored publishing API key. Changes are subject to maintainer review and automated testing through the development process. Dependency selection favors a small dependency set, with advisory monitoring and updates; a dependency's publisher does not exempt it from review.

Configured packages have automated, version-specific SBOM generation and release-evidence verification. See [secure development and supply-chain practices](/security/secure-development) for the actual workflow, coverage and limitations. Source visibility and automated checks complement review; they do not establish that all vulnerabilities have been found.

## Security reports and incidents

Suspected product vulnerabilities must be reported privately using the [published reporting channels](/security/reporting). The [disclosure policy](https://servicestack.net/security) defines reporting scope, response targets and coordinated disclosure. It supersedes older instructions that directed vulnerability reports to public issue trackers.

Reports are assessed for affected products and versions, impact, remediation and appropriate communication. Published advisories identify affected versions, available fixes and mitigations. Applicable regulatory reporting is a separate responsibility from researcher acknowledgement and public disclosure.

## Continuity and recovery

Operational continuity and evidence preservation support the development, distribution and maintenance of products. Public source history and package availability are useful records, but do not establish that recovery has been tested. This policy summary makes no measured recovery-time or recovery-point commitment; integrating applications need their own backup and recovery arrangements.

## Review and assurance

Policy changes are reviewed under the CEO's responsibility and communicated to relevant personnel. Public evidence is maintained through this security section, release records and advisories. Internal control records and confidential investigation details are not published by this summary.

See [supplier assurance](/security/supplier-assurance) for certification and audit availability, and [CRA readiness](/security/cra) for work still under assessment. The public information security policy, product disclosure policy and future product conformity declarations have different purposes and should be assessed separately.
