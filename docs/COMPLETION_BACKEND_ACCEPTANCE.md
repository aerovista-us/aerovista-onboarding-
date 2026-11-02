# Completion API persistence and acceptance plan

## Canonical identity
Resolve the AVCC identity ID from the authenticated server session. Reject anonymous, revoked, suspended, and unauthorized sessions. Never accept user identity or verification status from request JSON.

## Storage (proposed migration, not applied)
- onboarding_section_progress: identity_id, section_id, content_version, viewed_at, acknowledged_at, updated_at; unique(identity_id, section_id, content_version)
- training_evidence: evidence_id unique, identity_id, journey_id, step_id, catalog_version, submitted_at, review_status, evidence_json, reviewed_at, reviewed_by
- training_assignments: identity_id, journey_id, assigned_at, due_at, assigned_by
- training_completion_audit: immutable actor_id, subject_id, action, journey_id, step_id, recorded_at, reason

## Acceptance cases
1. Two AVCC identities cannot read or modify each other's records.
2. Expired/revoked sessions and missing capabilities fail closed.
3. CSRF and Origin checks reject unauthorized writes.
4. Duplicate evidence IDs are idempotent; other users cannot reuse them.
5. A local ByteCast badge or client-supplied verified=true never becomes a server verified completion.
6. Server verification requires catalog version, prerequisites, evidence validation and an authorized reviewer or trusted grading result.
7. Offline ByteCast activity is shown as local/pending, not synced/verified.
8. Reporting is restricted to explicitly authorized staff and is audited.
9. Existing public GitHub Pages onboarding remains accessible without signing in.
10. No secrets or tokens appear in the browser bundle.

## NXCore inspection (2026-11-01)
- identity-gateway running and healthy on localhost:3110
- bytecast-web running and healthy on localhost:18080
- AVCC inventory candidate running on localhost:3015; do not assume it is the production AVCC backend
- Production identity source: ACOS/main/services/identity-gateway
- Release blocked pending selection of canonical AVCC backend, authenticated test identities, and protected service deployment.
