# Security Policy

## Supported Versions

We actively support and patch security issues in the following versions of AgentFlow:

| Version | Supported | Notes |
| ------- | --------- | ----- |
| v1.0.x  | Yes       | Current active stable release. |
| < v1.0  | No        | Pre-release prototypes. Please upgrade to v1.0.0. |

---

## 🔒 Row Level Security (RLS) and Tenant Isolation

AgentFlow relies heavily on Supabase Row Level Security (RLS) to keep user data private and isolated. In production, RLS policies check `auth.uid() = user_id` for all CRUD queries on database tables.

If you discover a way to bypass RLS policies or view/modify another user's flows, runs, or credentials, please report it immediately as a critical vulnerability.

---

## 🛠️ Local Engine Security Note

AgentFlow executes all AI operations locally on your system using Ollama. However, be aware of the following security practices:
- **System Prompts**: Do not execute untrusted flows containing system prompts from unknown sources.
- **Upstream URLs**: The Research Agent can fetch and parse content from remote websites. Ensure you are only researching trusted websites to prevent potential server-side request forgery (SSRF) vectors.

---

## 🚨 Reporting a Vulnerability

We take the security of AgentFlow seriously. If you find a security vulnerability, please do **not** file a public issue on GitHub. Instead, report it privately.

To report a vulnerability:
1. Email your report to [support@agentflow.dev](mailto:support@agentflow.dev).
2. Include a detailed description of the issue, steps to reproduce, and any proof-of-concept exploits.
3. We will acknowledge receipt of your email within 24–48 hours and work with you to coordinate a security release.

Thank you for helping keep AgentFlow secure!
