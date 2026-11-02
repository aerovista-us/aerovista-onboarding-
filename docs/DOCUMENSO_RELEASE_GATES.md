# AeroVista Agreements & Contracts — build and release checklist

## Confirmed infrastructure (read-only inspection, 2026-11-02)
- NXCore online.
- identity-gateway container healthy; AVCC container healthy.
- No running Documenso container observed.
- Existing onboarding GitHub Pages site remains public and unchanged by this branch.

## Target architecture
- Public onboarding and agreements explainer: onboarding.aerovista.us (GitHub Pages).
- Private signing application: sign.aerovista.us (proposed; requires Cloudflare ingress, DNS, TLS, dedicated NXCore service).
- Contract lifecycle and agreement eligibility: AeroCoreOS / AVCC private service.
- Documenso: envelope creation, signing ceremony, evidence; never authoritative for AVCC permissions.

## Release gates
- [ ] Review Documenso pinned release, license obligations and deployment guide.
- [ ] Create isolated Documenso network, least-privilege DB role and dedicated PostgreSQL storage.
- [ ] Provision protected signing certificate, SMTP, storage, secrets and encrypted backups; test restore.
- [ ] Configure HTTPS ingress and explicit egress restrictions, without exposing DB or internal management.
- [ ] Configure server-side Documenso API credentials and verified webhooks.
- [ ] Implement contract parties, versions, signer authority, envelope status, obligations, audit and access eligibility in private AVCC service.
- [ ] Obtain legal approval of NDA and contract templates before assigning to real signers.
- [ ] Verify signed PDFs, tamper evidence, idempotency, replay protection, authorization isolation and revoked sessions.
- [ ] Pilot with two distinct internal users and one external signer; check downloadable receipts and signed-artifact retention.
- [ ] Only then publish real sign-in, signature buttons and protected training gates.

## Acceptance
No protected material accessible to unsigned or unauthorized accounts; no contract or signature stored in public GitHub Pages; signing service isolated from management network; revocation works; backups recover; audit history survives retries; no unverified training completion recorded.

## Rollback
Keep existing onboarding site available. Disable signing invitations and access-eligibility integration before rolling back private service; preserve signed artifacts and audit logs, and do not roll back agreement versions or lose receipts.
