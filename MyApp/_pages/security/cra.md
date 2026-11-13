---
title: EU Cyber Resilience Act and CE Marking
---

[Security Assurance](/security/) · [SBOM and VEX Downloads](/security/sbom-vex) · [Security Assessments](/security/assessments)

This page states ServiceStack's current CRA readiness and CE-marking position for supplier assessments. Last reviewed: **12 November 2026**.

## CE-marking position

ServiceStack's planned approach is to apply CE marking to products where legally required under the EU Cyber Resilience Act, after completing the applicable conformity assessment and EU Declaration of Conformity, by the relevant statutory application date.

**ServiceStack is not currently asserting CRA conformity or CRA CE marking for the packages covered by this assurance documentation.** Product applicability, classification, assessment route and security-support commitments remain under assessment. No signed CRA EU Declaration of Conformity is published here.

This position is a readiness statement, not a certificate or declaration of conformity. It does not promise CE marking for components outside the regulation's scope or certify a customer's integrated application.

## What must be completed

The CRA places obligations on the product and its lifecycle. Depending on applicability, preparation includes:

- defining the product boundary, intended use and applicable category;
- recording cybersecurity risks and implementing applicable security requirements;
- operating vulnerability intake, assessment, remediation, disclosure and reporting processes;
- defining security-support coverage and providing the required user information;
- assembling technical documentation and completing the applicable conformity assessment;
- issuing the EU Declaration of Conformity and presenting the CE mark when conformity has been demonstrated.

The [European Commission's manufacturer guidance](https://digital-strategy.ec.europa.eu/en/policies/cra-manufacturers) explains these stages. The [conformity-assessment guidance](https://digital-strategy.ec.europa.eu/en/policies/cra-conformity-assessment) explains why most products can use manufacturer self-assessment while certain important or critical categories require stricter procedures. This page does not assume every ServiceStack package has the same classification.

## Software components and presentation

Separately marketed software components can fall within scope. Being a library or being embedded in another supplier's product is not, by itself, an exemption. Free and open-source software has specific scope provisions; public source availability alone does not settle applicability.

Under Article 30 of the CRA, software CE marking can be presented on the EU Declaration of Conformity or the website accompanying the software. A logo inside each DLL or NuGet package is not the required presentation mechanism. Any future declaration and mark must clearly identify the product it covers.

See the [CRA legal text, including Articles 2–3, 28–32 and Annexes I–II](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R2847) for the governing requirements.

## Application dates

The CRA's main requirements generally apply from **11 December 2027**. Article 14 reporting obligations apply from **11 September 2026**. Transitional provisions affect products placed on the market earlier and products subsequently subject to substantial modification.

These dates are distinct: a future conformity date does not defer an already applicable reporting obligation. See the [Commission CRA overview](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) and Articles 69 and 71 of the regulation.

## Available readiness evidence

| Area | Public evidence or current status |
| --- | --- |
| Package inventories and provenance | [Version-specific security bundles](/security/sbom-vex) |
| Vulnerability-impact statements | [Reviewed VEX where available; absence explained](/security/sbom-vex#vex-information) |
| Product review and assessment evidence | [Published security review and report availability](/security/assessments) |
| Coordinated disclosure and private reporting | [ServiceStack security policy](https://servicestack.net/security) |
| CRA declaration and CE marking | Not currently asserted or published for the covered packages |
| Formal product security-support periods | Still under assessment; no new LTS or backport commitment is established by these pages |

These materials support supplier due diligence. They do not, on their own, demonstrate completion of all CRA obligations. Customers integrating ServiceStack remain responsible for assessing their own product, resolved dependencies, deployment and applicable manufacturer obligations.
