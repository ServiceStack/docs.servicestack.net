---
title: Vulnerability Reporting and Disclosure
---

[Security overview](/security/) · [Security assessments](/security/assessments)

Report suspected ServiceStack vulnerabilities privately so we can investigate, prepare fixes and coordinate disclosure. You do not need a paid subscription or a ServiceStack account to use GitHub private vulnerability reporting.

## Submit a private report

Use one of these channels:

- [GitHub private vulnerability reporting](https://github.com/ServiceStack/ServiceStack/security/advisories/new) for ServiceStack libraries. A GitHub account is required.
- The [ServiceStack security reporting portal](https://account.servicestack.net/security) as an alternative.

Please use one channel per report. Do not disclose vulnerabilities in public GitHub issues, discussions or pull requests. General non-security bugs belong in [ServiceStack/Issues](https://github.com/ServiceStack/Issues).

This documentation page provides instructions; it does not collect reports or attachments.

## What to include

- Affected package IDs and exact versions, or repository and source commit.
- Relevant .NET runtime, operating system, database provider and configuration.
- Reproduction steps and a minimal proof of concept where possible.
- Expected and observed behavior, impact and required access or authentication.
- Suggested mitigation, if known, and your preferred contact details.
- Whether you would like researcher credit when the issue is disclosed.

Remove real credentials, personal data and unrelated confidential information from reproductions. Test only systems you own or have permission to test; this reporting guidance does not authorize testing customer deployments or third-party services.

## Handling and coordinated disclosure

The [published security policy](https://servicestack.net/security) is the canonical reference for scope, reporting, response targets and coordinated disclosure. Its current repository copy is [SECURITY.md](https://github.com/ServiceStack/ServiceStack/blob/main/SECURITY.md).

Reports are assessed to establish impact and affected versions, request further information where needed, and coordinate remediation and disclosure. Please keep exploit details private while investigation and remediation are coordinated. Response targets are not guarantees of a fixed resolution time.

Reporting to ServiceStack and manufacturer reporting to authorities under the CRA are separate processes. Sending us a report does not discharge another manufacturer's own regulatory obligations. See [CRA readiness](/security/cra).

## Published advisories and updates

Consult [GitHub Security Advisories](https://github.com/ServiceStack/ServiceStack/security/advisories) for published ServiceStack advisories. Read the affected range, fixed versions, configuration assumptions and mitigation guidance before deciding whether your deployment is affected.

For dependency inventory and reviewed impact statements, see [SBOM and VEX downloads](/security/sbom-vex). An absent advisory or VEX file is not a guarantee of absence of vulnerabilities.

Reporting information is also discoverable through [security.txt](https://servicestack.net/.well-known/security.txt).
