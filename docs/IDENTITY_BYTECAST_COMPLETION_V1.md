# AeroVista onboarding + ByteCast completion integration (v1)

Status: integration contract / implementation candidate; NOT production-enabled.

## Boundaries
- Public GitHub Pages content stays anonymous and readable.
- Canonical AVCC identity is resolved server-side through Identity Gateway; never trust a user ID sent by the browser.
- The canonical gateway is ACOS/main/services/identity-gateway (not the extracted identity-gateway repository).
- Browser must never contain IDGW_SERVICE_SECRET_*, AV_SERVICE_SECRET_*, or service HMAC signing material.
- Progress API must run on a protected same-origin service (or explicitly allowlisted CORS origin) with secure HttpOnly SameSite session cookies and CSRF protection.
- No browser localStorage entry, read receipt, page view, or self-reported score may award a verified training credential.

## Proposed relying-app registration
Service: aerovista-onboarding
Public origin: https://aerovista-us.github.io
Redirect URI: exact onboarding callback path, to be registered in AVCC.
Service: bytecast (separate service grant and origin; verify live deployed origin before registration).
Backend broker secret: distinct per service, configured in NXCore secret management.
Authorization: explicit grants onboarding.progress.read, onboarding.progress.write, training.progress.read, training.progress.verify, training.reporting.read.

## Protected API contract (candidate)
GET /api/v1/me/progress -> { identity:{displayName}, onboarding:{sections:[{id,viewedAt,acknowledgedAt}],lastSection}, training:{journeys:[{journeyId,completed,verified,steps:[]}]}}
POST /api/v1/me/onboarding/sections/:id/view -> server stamps viewedAt for authenticated identity; id must be allowlisted.
POST /api/v1/me/onboarding/sections/:id/acknowledge -> server stamps acknowledgedAt after explicit user action.
POST /api/v1/me/bytecast/evidence -> append-only evidence submission, never marks verified without server validation.
GET /api/v1/admin/completions -> reporting; requires training.reporting.read grant, paginated, audited.

Security: server-side identity from session; enforce Origin/CSRF; replay-resistant evidence IDs; allowlist step IDs from versioned journey catalog; validate proof against ByteCast minProof and unlock_requires; never accept client-provided verified, userId, grants, or badge awards. Audit every verification/revocation. Rate limit and redact personal information in logs.

## ByteCast mapping
ByteCastLoop.markStepDone(stepId, meta) remains local-first. A separate authenticated adapter can submit evidence asynchronously when connected. Preserve existing local behavior offline and clearly label pending sync versus verified status. Proof bundle schema bytecast-proof-bundle-v1 is a transport candidate, not authoritative proof by itself. Use explicit quiz and artifact checks, not client flags alone.

## Release gates
1. Register exact origins and relying apps in AVCC, provision secrets only on backend.
2. Implement protected service and persistent tables keyed by AVCC identity ID + section/step/version.
3. Unit/integration tests for two identities, no cross-user reads, revocation, failed proof, duplicate/replay, CSRF, expired session.
4. Integrate ByteCast emission and onboarding opt-in progress UI; no auto-verified marks.
5. Authenticated browser acceptance and rollback; enable production only after checks.
