# AeroVista Agreements Center — implementation contract (draft)

Status: design and public preview only. No signature, contract, or access entitlement is currently created.

## Identity and authorization
- Use the canonical AeroCoreOS/AVCC Identity Gateway. Do not create another password store or trust client-supplied identity IDs.
- Backend exchanges or resolves an authenticated session server-side, enforces role/capabilities, and checks current revocation state.
- All agreement records and signed documents are private; never store signatures, signer PII, or contracts in public GitHub Pages or localStorage.

## Data model
- agreement_templates: id, type, jurisdiction, audience, status, legal_approved_by, legal_approved_at.
- agreement_versions: id, template_id, version, sha256, immutable_document_uri, effective_at, superseded_at.
- agreement_assignments: id, identity_id, role, agreement_version_id, assigned_at, due_at, status.
- signature_transactions: id, assignment_id, provider_envelope_id, signer_identity_id, consent_evidence_ref, signed_at, provider_verified_at, status.
- signed_artifacts: id, transaction_id, encrypted_storage_uri, sha256, retention_policy_id.
- agreement_audit: id, actor_identity_id, action, target_id, timestamp, request_id, metadata_redacted.

## Proposed protected endpoints (not deployed)
- GET /api/v1/agreements/required — current user assignments, with server-side role filtering.
- GET /api/v1/agreements/:assignmentId/document — authenticated, authorized access to exact immutable version.
- POST /api/v1/agreements/:assignmentId/signature-session — CSRF-protected creation of provider signing session; idempotent.
- POST /api/v1/agreements/signature-webhook — verified provider webhook with replay prevention.
- GET /api/v1/agreements/:assignmentId/receipt — authenticated receipt, scoped to signer or authorized admin.
- GET /api/v1/access/eligibility — computed server-side from identity, current grants, required agreements and training gates.

## Critical controls
1. Counsel reviews agreement wording, audience, jurisdictions, exclusions, remedies, duration and applicable law before activation.
2. Explicit electronic-records/signature consent where required; provider-managed signing ceremony, signer authentication and tamper-evident evidence.
3. Never treat a checkbox, front-end flag, unverified provider callback, or mere page view as a signed NDA.
4. Agreement version and digest are immutable once issued; amendments require a new version and reassignment as appropriate.
5. Access eligibility is recomputed server-side and fails closed; training is a separate gate. Handle revoked access and superseded agreements deliberately.
6. Encrypted private storage, least privilege, retention/deletion schedule, exportable signed copies, and audit logging without exposing contract content.
7. Validate signature provider webhook authenticity and transaction state; handle duplicates and out-of-order callbacks.
8. Test cross-user and cross-role isolation, unsigned access denial, stale session, CSRF, replay, document tampering, provider outage and audit integrity.

## Rollout
- Phase A: preview and approved legal templates (current).
- Phase B: backend identity integration, private storage, provider sandbox, end-to-end tests.
- Phase C: controlled pilot with real signed receipts and admin review.
- Phase D: enable protected onboarding only after security, legal and operations acceptance.

No secrets or legal templates should be committed to the public site without explicit approval.
