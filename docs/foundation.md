# Wingate Associates — Foundation
**Status**: Draft v0.1 — a founding brief, recording intent at the start of the project. It is not a status page; do not update it as the project moves.
**Date**: 2026-10-12

---

## The Problem

The owner is moving from a W2 role to running an independent consulting practice as an LLC. A new practice has no public presence: nowhere to say what it offers, nowhere to send a prospective client, and nowhere to show the technical work that backs the claim. In the owner's words, the site "gives me a platform to sell and advertise from."

The same site also has to carry the owner's technical credibility. Before there are client engagements to point to, the portfolio of SaaS projects, code bases and technical case studies is the evidence.

## The Solution

A single web platform that does three jobs:

1. **Corporate landing page** for the LLC: a formal, professional presence.
2. **Client conversion engine:** services, engagement models, and a lead-capture and reach-out pipeline. Leads are stored in the owner's own PostgreSQL database from day one, with email notification through Resend. Booking a call through a self-hosted Cal.com is planned.
3. **Technical portfolio:** SaaS projects, code bases and case studies.

It is built as a server-rendered Next.js app in TypeScript, deployed as a Docker image by the owner's Komodo instance and reached only through a Cloudflare Tunnel. Plausible provides analytics. The owner prefers tooling they can self-host and wants that applied to as many parts of the system as practical, with Resend as the one hosted exception. The reasoning is in `docs/ADRs/`.

## The User

Primarily prospective consulting clients: people deciding whether to engage Wingate Associates and how. Secondarily, technical peers and hiring contacts reading the portfolio. The interview did not narrow either group further (industry, company size, role), so that detail is an open question below.

## What We Are Not Building

Nothing is explicitly ruled out. The owner said they "can't really rule anything out yet." A client portal and billing support are likely growth areas if the practice succeeds, and the stack was chosen to leave room for them.

For the first release, the working scope is the landing page, services and engagement models, the portfolio, and lead capture. A portal, billing, and anything not listed in the solution above are future work, not v1.

## Success Metric

Not yet defined as a measurable target. The only stated goal is that, 6–12 months from launch, the owner has "a client or two" and has added new work to the portfolio. Revisit before first release and turn it into something observable, such as qualified leads per month or discovery calls booked.

## Open Questions

- Which pages and sections does v1 launch with?
- Who is the target client, specifically (industry, company size, buyer role)?
- What are the services and engagement models the site presents?
- What is the measurable success metric?
- Which auth approach will a future client portal use?
- Is Plausible self-hosted or on Plausible Cloud?

---
*This document is the source of truth for product intent. Architecture and technology decisions live in docs/ADRs/; this file is about why, not how.*
