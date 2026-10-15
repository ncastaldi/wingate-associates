# ADR-003: Self-host by default, with Resend as the only hosted service

**Status:** Accepted
**Date:** 2026-10-12

## Context

The owner runs their own infrastructure and wants to own the tools behind the business, and wants to keep lead data under their control.

## Decision

Prefer self-hosted tooling for every capability. Resend is the only approved hosted service, used to deliver email. Any new third-party service needs the owner's explicit sign-off and a new ADR.

**Amendment (2026-10-14):** Resend also receives mail for the domain. `hello@wingate.associates` is a Resend inbox: the domain's MX points at Resend (`inbound-smtp.us-east-1.amazonaws.com`), and lead notifications and replies to the visitor acknowledgement land there. This replaced a plan to forward through Cloudflare Email Routing to a personal mailbox, which the owner rejected because business mail would get lost among personal mail. It adds no new vendor. A full mailbox provider (Fastmail, Proton and the like) remains the upgrade path if the practice outgrows the inbox, and would need its own ADR.

## Alternatives considered

- **Hosted form, CRM or booking SaaS:** faster to start, but lead data leaves the owner's control and adds recurring cost and lock-in.
- **Self-hosting email delivery:** rejected because deliverability (SPF/DKIM reputation, blocklists) is costly to maintain, so email is the one deliberate exception.

## Consequences

- More operational work: updates, backups and uptime are the owner's job.
- Lead data stays in the owner's Postgres, and nothing but the Resend notification email leaves the system.
- Reviewers should reject PRs that add an SDK for another hosted service.
