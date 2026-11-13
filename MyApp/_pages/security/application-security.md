---
title: Application Security Guides
---

[Security overview](/security/) · [Vulnerability reporting](/security/reporting)

ServiceStack provides security features and integration points that must be configured for an application's own identity model, tenant boundaries and deployment. These guides complement the supplier assurance evidence; they do not certify a particular application as secure.

## Authentication and sessions

- [Authentication overview](/auth/) — available authentication models.
- [ASP.NET Core Identity integration](/auth/identity-auth) — integrating Identity with ServiceStack.
- [Sessions](/auth/sessions) — session behavior and lifecycle.
- [JWT authentication](/auth/jwt-authprovider) — JWT provider configuration.
- [API keys](/auth/apikeys) — API-key access and management.

Choose and configure the identity model deliberately. Authentication establishes who the caller is; authorization and tenant membership still determine which operations and data they can access.

## Authorization and tenant boundaries

- [Authentication and authorization](/auth/authentication-and-authorization).
- [Restricting services](/auth/restricting-services).
- [OrmLite connection filters](/ormlite/connection-filters).

For multi-tenant applications, validate membership server-side and scope reads, writes, files, exports and background work to the authorized tenant. A resource ID, client-selected organization or authenticated session is not by itself proof of access to a tenant's data. Test both allowed operations and cross-tenant denial in your actual application.

## Input and browser boundaries

- [Validation](/validation).
- [Declarative validation](/declarative-validation).
- [Antiforgery protection](/auth/anti-forgery).
- [Cross-origin requests](/corsfeature).

Apply appropriate request/body limits, validate inputs and configure browser-facing protections for the authentication mechanism used. CORS settings do not replace authorization. Cookies and browser-originated mutations require attention to CSRF and the application's origin policy.

## Files and data exposure

- [Managed file uploads](/locode/files-upload-filesystem).
- [Request logging](/request-logger).
- [Application logging](/logging).

Protect uploaded files and downloads with resource authorization, storage boundaries and appropriate content/size controls. Keep credentials and unnecessary personal data out of logs, error responses, audit detail and support exports.

## Security verification

Use a representative test deployment with known package versions, synthetic data and appropriately scoped accounts. Assess unauthenticated behavior, role boundaries, tenant isolation and sensitive business operations. Keep the code revision, configuration, exclusions, results and remediation verification with your release evidence.

Framework test results and an assessment of one application do not establish coverage of all possible ServiceStack deployments. See [assessment evidence and interpretation](/security/assessments).
