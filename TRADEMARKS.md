# Trademark Policy

**Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Active enforcement

---

## Overview

"402Kit" and associated logos/branding are **common law trademarks** owned by the 402Kit project maintainers. We are committed to protecting these marks to:

1. **Prevent consumer confusion** about the source and quality of 402Kit software
2. **Protect the project's reputation** and community trust
3. **Maintain control** over official products and commercial offerings
4. **Enable monetization** while keeping the core SDK open source

This policy explains permitted and prohibited uses, with enforcement procedures.

---

## Trademark Coverage

### Protected Marks

The following are trademarks of the 402Kit project:

- **"402Kit"** (word mark)
- **402Kit logo** (when created - visual mark)
- **"402Kit Cloud"** (reserved for official hosted service)
- **"402Kit Enterprise"** (reserved for official commercial edition)
- **"402Kit Facilitator"** (reserved for official payment gateway)
- **"402Kit Gateway"** (reserved for official routing service)

### Scope Reservation

The npm scope **`@402kit/`** is exclusively controlled by the 402Kit core team for official packages.

---

## ✅ Permitted Uses

### 1. Referential Use

You **MAY** use "402Kit" to refer to the project:

```
✅ "This API uses 402Kit for payment validation"
✅ "How to integrate 402Kit with FastAPI"
✅ "402Kit vs. traditional payment gateways"
✅ "Built with 402Kit" badge on your website
```

### 2. Community Contributions

You **MAY** use "402Kit" in community content:

- Blog posts and tutorials
- Conference talks and presentations
- YouTube videos and screencasts
- GitHub projects that integrate with 402Kit

**Requirement**: Make it clear you're describing the official project, not your own fork.

### 3. Open Source Distribution

You **MAY** redistribute 402Kit under the Apache 2.0 license:

- Unmodified source code
- Binary distributions from official sources
- Forks clearly marked as "unofficial fork of 402Kit"

**Requirement**: Include attribution and license notices.

### 4. Commercial Integration

You **MAY** use 402Kit in commercial products:

- Build commercial APIs using 402Kit
- Offer consulting/integration services
- Create paid extensions (following naming guidelines)

**Limitation**: You cannot imply official endorsement or affiliation.

### 5. Compatibility Claims

You **MAY** claim compatibility:

```
✅ "Compatible with 402Kit"
✅ "Designed for 402Kit"
✅ "Works with 402Kit core packages"
```

**Requirement**: Must be accurate and verifiable.

---

## ❌ Prohibited Uses

### 1. Confusing Product Names

You **MAY NOT** use "402Kit" in product/service names that create confusion:

```
❌ "402Kit Pro" (implies official premium version)
❌ "402Kit Hosting" (conflicts with reserved "402Kit Cloud")
❌ "402Kit Premium Support" (use "Premium support for 402Kit")
❌ "402Kit Gateway" (reserved for official service)
❌ "402Kit Enterprise Edition" (reserved)
```

**Why**: These names suggest official products and violate our monetization strategy.

### 2. False Affiliation

You **MAY NOT** imply official relationship:

- ❌ "Official 402Kit Consulting Partner"
- ❌ "Certified by 402Kit" (no certification program exists)
- ❌ "Endorsed by 402Kit maintainers" (without written permission)
- ❌ "402Kit Foundation" (no such entity exists)

### 3. Domain Name Squatting

You **MAY NOT** register domains that create confusion:

**Domains owned by the project**: 402kit.dev (and any other domains explicitly listed in this repo).

Using domains that may cause confusion with our owned domains is discouraged and may be infringing if it implies official status.

### 4. Package Name Conflicts

The npm scope **`@402kit/*`** is reserved for official packages. Third-party packages should not use this scope; use names like `@company/402kit-<ext>`.

### 5. Trademark Registration

You **MAY NOT**:

- Register "402Kit" as a trademark in any jurisdiction
- Register confusingly similar marks (e.g., "402Toolkit", "Four-Oh-Two-Kit")
- File for domain names, social media handles, or app store names that conflict

### 6. Disparagement

You **MAY NOT** use "402Kit" in connection with:

- Illegal activities
- Harmful or offensive content
- Violations of our Code of Conduct
- False claims or misinformation

---

## 🏢 Commercial Use Boundaries

### Open Source ↔ Commercial Boundary

**Open Source (Free):**

- Core SDK (`@402kit/core`)
- Client and server libraries
- Mock and x402 adapters
- Basic examples and documentation

**Commercial (Reserved):**

- Hosted payment facilitator ("402Kit Cloud")
- Premium adapters (Stripe, Coinbase, Lightning Network)
- Enterprise support contracts
- SLA-backed services
- Managed deployments

**Clear separation**: You can build commercial products _using_ 402Kit, but you cannot use our marks to offer competing hosted/managed services under the 402Kit brand.

### Offering Services

**✅ Permitted:**

- "Acme Consulting - 402Kit Integration Services"
- "Custom 402Kit Adapter Development"
- "402Kit Implementation for Enterprise"

**❌ Not Permitted:**

- "402Kit as a Service" (conflicts with official offering)
- "402Kit Managed Hosting" (reserved)
- "402Kit Cloud by Acme" (trademark violation)

---

## 🛡️ Enforcement Policy

### Violation Tiers

**Tier 1: Friendly Request (7 days)**

- Email notice explaining the issue
- Request for voluntary compliance
- Offer to help with rebranding if needed

**Tier 2: Formal Cease & Desist (14 days)**

- Legal notice from maintainers
- Specific corrective actions required
- Escalation timeline

**Tier 3: Legal Action**

- Takedown requests (npm, GitHub, domain registrars)
- Trademark infringement claims
- Damages if willful infringement caused harm

### Enforcement Priorities

**High Priority (immediate action):**

1. Domain squatting on exact match domains
2. npm packages in `@402kit/` scope from unauthorized publishers
3. Services falsely claiming official status
4. Competing "402Kit Cloud" or "402Kit Enterprise" offerings

**Medium Priority (30-day notice):**

1. Confusing product names (e.g., "402Kit Pro")
2. Misleading compatibility claims
3. Unauthorized use of future logo/branding

**Low Priority (community guidance):**

1. Well-intentioned but incorrect usage
2. Minor naming conflicts easily resolved
3. Educational/personal projects

### Good Faith Safe Harbor

We will **not** enforce against:

- Honest mistakes corrected promptly
- Uses that predate this policy (grace period provided)
- Non-commercial community projects making good-faith efforts to comply
- Academic research and education

---

## 📦 Reserved Package Names

The following npm package names under `@402kit/` are reserved for official use:

**Current official packages:**

- `@402kit/core`
- `@402kit/client`
- `@402kit/server`
- `@402kit/entitlement`
- `@402kit/adapter-mock`
- `@402kit/adapter-x402`

**Reserved for future official packages:**

- `@402kit/adapter-stripe`
- `@402kit/adapter-coinbase`
- `@402kit/adapter-lightning`
- `@402kit/adapter-evm`
- `@402kit/adapter-solana`
- `@402kit/facilitator-client`
- `@402kit/facilitator-server`
- `@402kit/enterprise`
- `@402kit/pro`
- `@402kit/cloud-sdk`
- `@402kit/analytics`
- `@402kit/telemetry`

**Why**: These represent our commercial product roadmap and monetization strategy (see MONETIZATION.md).

---

## 🌐 Reserved Service Names

The following service names are reserved for official commercial offerings:

| Service Name           | Purpose                      | Status              |
| ---------------------- | ---------------------------- | ------------------- |
| **402Kit Cloud**       | Hosted payment facilitator   | Future paid SaaS    |
| **402Kit Enterprise**  | On-premise solution with SLA | Future license      |
| **402Kit Gateway**     | Payment routing/aggregation  | Future paid service |
| **402Kit Facilitator** | Managed settlement service   | Future paid service |
| **402Kit Managed**     | Fully managed deployment     | Future paid service |

**Revenue protection**: These names represent $1M-$5M+ annual revenue potential (per MONETIZATION.md).

---

## 📝 Logo Usage Guidelines

### When Official Logo is Released

**Permitted:**

- Unmodified logo in approved colors
- Proportional scaling only
- Clear space around logo (minimum 2× logo height)
- Attribution link back to project

**Prohibited:**

- Modifying colors, proportions, or design elements
- Using logo as part of your own logo
- Implying endorsement through prominent logo placement
- Creating derivative logos

**Download**: [Official asset repository - coming soon]

See [BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md) for detailed visual identity rules.

---

## 🤝 Requesting Permission

### Exceptions Process

For uses not clearly covered by this policy:

**Contact**: [legal@402kit.dev](mailto:legal@402kit.dev)

**Include**:

1. **Your name/organization**
2. **Proposed use** (be specific)
3. **Context** (commercial, OSS, personal, etc.)
4. **Duration** (ongoing or one-time?)
5. **Why exception is needed**

**Response time**: 7-14 business days

**Pre-approved exceptions**:

- Academic research (with attribution)
- Journalistic use (news, reviews)
- Parody/commentary (fair use)

---

## 📋 Reporting Violations

### How to Report

If you see potential trademark misuse:

**Email**: [legal@402kit.dev](mailto:legal@402kit.dev)

**Subject**: "Trademark Violation Report: [describe]"

**Include**:

- URL or package name
- Description of violation
- Screenshots (if applicable)
- Why you believe it violates this policy

**Confidentiality**: Reports are handled privately.

### What We'll Do

1. **Review** within 7 days
2. **Investigate** the claim
3. **Take action** if violation confirmed (per enforcement tiers)
4. **Notify reporter** of outcome (if appropriate)

---

## 🔄 Policy Updates

This policy may be updated as the project evolves.

**Change notification**:

- Major updates announced via GitHub Discussions
- Breaking changes have 90-day grace period
- Version history maintained in git

**Current version**: 1.0 (October 2025)

---

## ⚖️ Legal Basis

### Trademark Rights

"402Kit" is a **common law trademark** based on:

- First use in commerce (October 2025)
- Continuous use in connection with software/services
- Enforcement history

**Registration status**: Pending (USPTO filing planned for 2026)

### Apache 2.0 Compatibility

This trademark policy is **compatible** with the Apache 2.0 license:

- Apache 2.0 Section 6: "This License does not grant permission to use trade names, trademarks, service marks, or product names of the Licensor."
- You have full rights to the **code** (Apache 2.0)
- Trademark rights are **separate** from copyright/patent grants

---

## 📚 Related Policies

- **[BRAND_GUIDELINES.md](./BRAND_GUIDELINES.md)** - Detailed brand usage guide
- **[LICENSE](./LICENSE)** - Apache 2.0 software license
- **[CLA.md](./CLA.md)** - Contributor License Agreement
- **[MONETIZATION.md](./MONETIZATION.md)** - Commercial strategy context
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** - Community standards

---

## ❓ FAQ

### Q: Can I use "402Kit" in my company name?

**A**: No, this would create confusion. Use "Acme Corp (402Kit Integration Partner)" instead.

### Q: Can I fork 402Kit and rename it?

**A**: Yes! Fork it, rename it clearly (e.g., "SuperPay"), and follow Apache 2.0. Do not imply it's the official 402Kit.

### Q: Can I create a "402Kit Premium Adapter"?

**A**: Not under that exact name. Use "@yourcompany/stripe-adapter-for-402kit" instead.

### Q: What if I registered a domain before this policy?

**A**: Contact us! We'll work with you on a transition plan or exemption if appropriate.

### Q: Can I sell 402Kit hosting?

**A**: You can host 402Kit for clients, but don't call it "402Kit Cloud" or "402Kit Hosting" (reserved names).

### Q: What about "powered by 402Kit" badges?

**A**: Absolutely! This is encouraged with proper attribution.

---

## 🙏 Thank You

We want 402Kit to thrive as an open source project while maintaining a clear path to sustainability. Thank you for respecting our trademarks and helping build the ecosystem!

**Questions?** Open a GitHub Discussion or email [legal@402kit.dev](mailto:legal@402kit.dev)

---

**Remember**: You have full rights to use the code (Apache 2.0), but trademark rights ensure quality control and enable our long-term commercial strategy.

---

## Attribution

This policy is based on the [Mozilla Trademark Policy](https://www.mozilla.org/en-US/foundation/trademarks/policy/) and [Python Software Foundation Trademark Usage Policy](https://www.python.org/psf/trademarks/).
