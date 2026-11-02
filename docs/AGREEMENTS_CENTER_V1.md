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

## Selected provider: Documenso (2026-11-02)
- Deploy a pinned stable self-hosted Documenso release on an isolated NXCore Docker network; do not use development Compose in production.
- Proposed signer URL: https://sign.aerovista.us (DNS and tunnel not yet configured). Keep onboarding at https://onboarding.aerovista.us.
- Use Documenso API v2 envelopes and authenticated webhooks. Avoid building new integrations on deprecated document/template endpoints.
- Canonical identity remains AVCC Identity Gateway. Do not assume Documenso OIDC SSO is included in the free self-hosted tier; enterprise features may require a license. External recipients can use a provider signing link with backend-controlled assignments.
- Production prerequisites: dedicated PostgreSQL >=14, secrets in protected environment, configured SMTP, persistent encrypted storage, signing .p12 certificate with private key stored outside git, backups with restore test, pinned image, TLS and protected ingress.
- Restrict outbound network access from Documenso; webhook SSRF defenses are explicitly best-effort. Block RFC1918, loopback, link-local and metadata destinations except narrowly approved dependencies.
- Use a server-only Documenso API key; issue envelope for an immutable legally approved PDF, verify callback authenticity and completed envelope status, then independently fetch/store the signed PDF and audit evidence before marking assignment signed.
- Agreement eligibility is computed by AeroCoreOS, not Documenso alone. Do not enable protected training until legal review, signature evidence, session authorization and all mandatory requirements pass.
- Test signing and PDF signature validation end-to-end before pilot; a running Documenso container does not mean signing works.
- License review: Documenso core is AGPL-3.0, enterprise capabilities separately licensed. Review obligations before custom modifications or network deployment.

References:
- https://docs.documenso.com/docs/self-hosting
- https://docs.documenso.com/docs/self-hosting/configuration/environment
- https://docs.documenso.com/docs/developers

## Reusable contract lifecycle (not onboarding-only)
Documenso is the signing provider, not the canonical contract database. AeroCoreOS/AVCC owns contract lifecycle and permissions.

Supported document classes: NDA/confidentiality, employment/contractor agreements, master service agreements, statements of work, client proposals requiring signature, vendor agreements, change orders, amendments and renewals.

Proposed additional private records:
- contract_parties: party_id, party_type (person|organization), legal_name, identity_id (optional), verified_contact_ref.
- contracts: contract_id, contract_type, owner_division, client_or_vendor_ref, status, effective_at, expires_at, renewal_policy, confidentiality_classification, project_ref.
- contract_versions: contract_id, version_id, sha256, immutable_document_ref, approved_by, approved_at, supersedes_version_id.
- contract_signers: version_id, party_id, signer_name, signer_email, signer_role, signature_order, authority_verified.
- contract_envelopes: version_id, provider, provider_envelope_id, state, issued_at, completed_at, verified_at.
- contract_obligations: contract_id, obligation_type, owner_identity_id, due_at, status, evidence_ref.
- contract_audit: actor, action, timestamp, request_id, target, redacted_metadata.

Workflow: draft -> internal review -> approved version -> authorized signer selection -> Documenso envelope -> independently verified signed artifact -> active/fulfilled -> renewal/expiry/archive. Rejections and voids must remain auditable. Never automatically treat a signed document as approval to spend or to grant account access.

Security: organization-scoped authorization; client data segregation; verified signer authority; immutable signed versions; encrypted private storage; retention/holds; reminders; webhook replay prevention; signature evidence and downloadable receipts. Contract signatures may involve external recipients without AeroCoreOS accounts, but internal access to contract records always requires AVCC authorization.

Integration points: onboarding eligibility, AVCC client/project vault, vendor management, contract renewal notifications and role-scoped dashboards. Do not implement a parallel contract system inside the public onboarding repository.
