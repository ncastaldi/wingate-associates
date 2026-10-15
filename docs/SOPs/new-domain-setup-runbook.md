  
**TEAM CASTALDI**

**New Domain Setup Runbook**

Cloudflare · DNS · TLS · Email Auth · Cloudflare Pages

| Version | 1.0 |
| :---- | :---- |
| **Created** | June 2026 |
| **Author** | Nathan Castaldi |
| **Applies to** | All Cloudflare-managed domains |

# **1\. Purpose and scope**

This runbook documents the complete process for setting up a new domain registered through Cloudflare from a clean slate to a fully hardened, production-ready configuration. It covers DNS, TLS, security headers, email authentication, bot controls, Cloudflare Pages deployment, and Resend transactional email integration.

It is written to be repeatable — follow it in order for any new domain and the result will be consistent.

| ℹ  Update when things change |
| :---- |
| If the company name, email provider, or hosting model changes, update the placeholder values noted throughout this document. Sections that require updates are marked with \[UPDATE IF CHANGED\]. |

# **2\. Pre-flight information gathering**

Before starting, collect answers to the following questions. These determine which steps apply and how to configure them.

| Question | Why it matters |
| :---- | :---- |
| What is the domain name? | Required for every step. |
| What will the canonical URL be — apex or www? | Determines redirect rule direction. Apex (example.com) is recommended for new business domains. |
| Is email being sent from this domain? | Determines SPF/DKIM/DMARC configuration. If no email, publish null records. |
| Which transactional email provider? | Resend, SendGrid, Postmark, etc. Each provides different DNS records. \[UPDATE IF CHANGED\] |
| Where is the site hosted? | Cloudflare Pages \= no origin cert needed. Homelab \= use Cloudflare Tunnel, never direct port-forward. |
| Are there public-facing forms or logins? | Determines Turnstile priority. |
| Are there subdomains beyond www? | Affects HSTS includeSubDomains setting — do not enable until all subdomains serve HTTPS. |

# **3\. Setup phases**

Complete phases in order. Each phase builds on the previous one — do not skip ahead, particularly around TLS and HSTS.

## **Phase 1 — Cloudflare Pages deploy and custom domain**

### **1.1  Deploy to Cloudflare Pages**

1. In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Upload assets.

2. Name the project (e.g. domain-landing).

3. Upload index.html and the functions/ folder together. The functions/ folder must be included for server-side functions to work.

4. Click Deploy site. Confirm the page renders at the \*.pages.dev preview URL before connecting the custom domain.

| ⚠  Functions require Wrangler CLI for reliable deployment |
| :---- |
| The Cloudflare dashboard drag-and-drop uploader does not reliably deploy the functions/ directory. Use the Wrangler CLI instead: |
|  |
|     npm install \-g wrangler |
|     wrangler login |
|     wrangler pages deploy . \--project-name \<project-name\> |

### **1.2  Connect the custom domain**

5. In the Pages project, go to Custom domains → Set up a custom domain.

6. Enter the apex domain (e.g. example.com). Cloudflare creates DNS records automatically.

7. Also add www\.example.com as a second custom domain.

8. Wait for Status to show Active (typically 2–5 minutes). Do not proceed to TLS steps until Active.

### **1.3  www → apex redirect rule**

9. Go to Rules → Redirect Rules → Create rule.

10. Use the "Redirect from WWW to root" template.

11. Set Request URL to: https\://www\.example.com/\*

12. Set Target URL to: https\://example.com/\${1}

13. Status code: 301\. Deploy.

14. If prompted about missing DNS record, choose Create a new proxied DNS record. Set target to \<deployment-id\>.example.pages.dev (hostname only, no https\://).

## **Phase 2 — SSL/TLS hardening**

### **2.1  Encryption mode**

**SSL/TLS → Overview** → set mode to **Full (strict)**. For Cloudflare Pages, this works without any origin certificate configuration.

### **2.2  Edge certificate settings**

SSL/TLS → Edge Certificates — configure all of the following:

* **Always Use HTTPS** → On

* **Minimum TLS Version** → TLS 1.2

* **TLS 1.3** → On

* **Opportunistic Encryption** → On

### **2.3  HSTS**

Same page → Enable HSTS:

* **Status** → On

* **Max Age** → 1 month (2592000) to start. Increase to 1 year (31536000) after a few weeks of confirmed stability.

* **Include Subdomains** → Off until all subdomains confirmed HTTPS-clean

* **Preload** → Off. Do not enable. Preloading is irreversible without a lengthy removal process.

* **No-Sniff Header** → On

| ⚠  HSTS is difficult to undo |
| :---- |
| Enabling HSTS tells browsers to refuse HTTP connections for the max-age duration with no override. Enabling it prematurely on a domain that later loses its TLS certificate will make the site completely inaccessible. Always confirm HTTPS is stable before enabling. |

## **Phase 3 — Security headers**

Go to Rules → Transform Rules → Modify Response Header → Create rule. Name it "Security headers". Set match to All incoming requests. Add the following headers using Set static:

| Header name | Value |
| :---- | :---- |
| X-Content-Type-Options | nosniff |
| X-Frame-Options | SAMEORIGIN |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| Content-Security-Policy | See note below |

Content-Security-Policy value for a static landing page with Google Fonts and an inline fetch() call to Resend. It is a sample for that kind of page only. Do not paste it onto a site that self-hosts fonts or loads analytics: it blocks both. wingate.associates uses its own value, in that repo's `deploy/README.md`.

| default-src 'self'; |
| :---- |
| script-src 'self' 'unsafe-inline'; |
| style-src 'self' 'unsafe-inline' https\://fonts.googleapis.com; |
| font-src https\://fonts.gstatic.com; |
| img-src 'self' data:; |
| connect-src 'self' https\://api.resend.com; |
| frame-ancestors 'none'; |

| ℹ  Update CSP as the site grows |
| :---- |
| script-src 'none' is correct for pages with no JavaScript. Add 'unsafe-inline' only if inline \<script\> blocks are present. When a full application is built, replace 'unsafe-inline' with a nonce or hash. Add additional connect-src entries for any APIs the page calls (e.g. Stripe). |

## **Phase 4 — Email authentication**

### **4a — No email yet (null policy)**

If the domain is not yet sending email, publish null records to prevent spoofing:

| Type | Name | Content | TTL | Purpose |
| :---- | :---- | :---- | :---- | :---- |
| TXT | @ | v=spf1 \-all | Auto | Null SPF |
| TXT | \_dmarc | v=DMARC1; p=reject; sp=reject; | Auto | Null DMARC |

### **4b — Resend transactional email \[UPDATE IF CHANGED\]**

When Resend is used as the email provider:

15. In the Resend dashboard, go to Domains → Add Domain → enter the domain.

16. Resend provides DNS records. Add them to Cloudflare DNS manually — the auto-configure feature does not always write them. Verify each record shows status Verified in Resend.

17. Confirm with dig after adding:

| dig TXT example.com | grep spf |
| :---- |
| dig TXT \_dmarc.example.com |
| dig TXT resend.\_domainkey.example.com |

DMARC staged enforcement — do not jump to p=reject on day one:

* p=none — monitoring only. Start here. Enable aggregate reports (rua=).

* p=quarantine — failing mail goes to spam. Move here after 2–4 weeks of clean reports.

* p=reject — failing mail is rejected. Final target after another 1–2 weeks of confirmed clean reports.

### **4c — Google Workspace \[UPDATE IF CHANGED\]**

When Google Workspace is set up, replace null records with:

* Google MX records (provided by Workspace setup wizard)

* v=spf1 include:\_spf.google.com \~all (add Resend include if both active: include:amazonses.com)

* Google DKIM TXT record at google.\_domainkey

* DMARC monitoring record, then ratchet to reject over 6–8 weeks

## **Phase 5 — Bot controls**

Security → Bots — enable all three:

* **Bot Fight Mode** → On. Monitor Security → Events for 24–48 hours. Whitelist any uptime monitoring IPs (Uptime Kuma, UptimeRobot, etc.) via Security → WAF → IP Access Rules → Allow before enabling.

* **Block AI Bots** → On → Block on all pages. Blocks known AI training crawlers.

* **AI Labyrinth** → On. Complements Block AI Bots by wasting unknown crawlers' time with generated content.

## **Phase 6 — WAF and security settings**

Security → Settings:

* **Security Level** → Medium

* **Browser Integrity Check** → On

* **Challenge Passage** → 30 minutes

Scrape Shield:

* **Hotlink Protection** → On

## **Phase 7 — Email routing (temporary inbox)**

While waiting for Google Workspace, Cloudflare Email Routing provides free receive-only forwarding so a contact address can go on the site immediately.

18. Email → Email Routing → Get started.

19. Let Cloudflare add its MX and TXT records automatically.

20. Custom addresses → Create address: e.g. hello → forward to personal Gmail.

21. Confirm the verification email sent to Gmail.

| ℹ  SPF ordering with Email Routing |
| :---- |
| Configure Email Routing before adding the null SPF record. Cloudflare's setup wizard generates the correct SPF include for its routing service. The resulting SPF record will look like: |
|     v=spf1 include:\_spf.mx.cloudflare.net \~all |
| When Google Workspace is added later, include both: include:\_spf.google.com include:\_spf.mx.cloudflare.net |

## **Phase 8 — Operational hygiene**

### **8.1  Security.txt**

Security → Settings → Security.txt → Configure:

* **Contact:** mailto:hello@example.com \[UPDATE IF CHANGED\]

* **Expires:** one year from configuration date

### **8.2  Turnstile (when forms are added)**

Skip until a public-facing form or login page is added to the site. When ready:

22. Turnstile → Add Site → configure a Managed widget.

23. Integrate the client-side widget and server-side token validation into the form.

24. Priority targets: contact forms, login pages, registration pages.

## **Phase 9 — Homelab origin migration (future)**

| ⚠  Never use DNS-only for homelab origins |
| :---- |
| DNS-only exposes your home IP address publicly in DNS. Anyone can resolve it and bypass Cloudflare's WAF and DDoS protection entirely. Use Cloudflare Tunnel instead. |

When moving from Cloudflare Pages to a homelab origin:

25. **Install cloudflared** on the homelab host.

26. cloudflared tunnel create \<tunnel-name\>

27. Configure ingress rules in the tunnel config file.

28. Update DNS: replace the Pages CNAME with the Tunnel CNAME (\<tunnel-id\>.cfargotunnel.com), proxied.

29. Issue an origin certificate: SSL/TLS → Origin Server → Create Certificate.

30. Set SSL/TLS mode to Full (strict).

31. Review WAF rules and add rate limiting on any API endpoints.

# **4\. Resend email capture — Cloudflare Pages Function**

The contact/lead capture form on the landing page uses a Cloudflare Pages Function to call the Resend API server-side. The API key is never exposed in the browser.

## **File structure**

| project/ |
| :---- |
| ├── index.html |
| └── functions/ |
|     └── api/ |
|         └── contact.js   ← handles POST /api/contact |

## **Required Pages secret**

**Settings → Environment variables → Add variable:**

* **Name:** RESEND\_API\_KEY

* **Value:** re\_xxxxxxxxx (from Resend → API Keys)

* **Encrypt:** Yes

## **Key constants to update \[UPDATE IF CHANGED\]**

| Constant | Current value | Update when |
| :---- | :---- | :---- |
| RESEND\_FROM | Local Tech Pro \<hello@localtechpro.us\> | Company name or email changes |
| OWNER\_EMAIL | LocalTechProGA@gmail.com | When Google Workspace is live |
| ALLOWED\_ORIGIN | https\://localtechpro.us | Domain changes |

## **Deploy command**

| cd \<project-folder\> |
| :---- |
| wrangler pages deploy . \--project-name \<project-name\> |

# **5\. Post-setup verification**

Run this block after completing all phases. All checks should pass before considering the domain setup complete.

| \# Site reachable over HTTPS |
| :---- |
| curl \-sI https\://example.com | head \-1 |
| \# Expected: HTTP/2 200 |
|   |
| \# www redirects to apex |
| curl \-sI https\://www\.example.com | grep \-E "^HTTP|^\[Ll\]ocation" |
| \# Expected: 301 → https\://example.com/ |
|   |
| \# HTTP redirects to HTTPS |
| curl \-sI http\://example.com | grep \-E "^HTTP|^\[Ll\]ocation" |
| \# Expected: 301 → https\://example.com/ |
|   |
| \# Security headers present |
| curl \-sI https\://example.com | grep \-iE "strict-transport|x-content|x-frame|referrer|permissions|content-security" |
|   |
| \# Email auth records |
| dig TXT example.com | grep spf |
| dig TXT \_dmarc.example.com |
|   |
| \# security.txt |
| curl \-s https\://example.com/.well-known/security.txt |

# **6\. Ongoing maintenance**

| Timeframe | Action | Notes |
| :---- | :---- | :---- |
| 2–4 weeks | Review DMARC aggregate reports | Confirm only legitimate senders passing |
| 1 month | Move DMARC from p=none to p=quarantine | If reports are clean |
| 6–8 weeks | Move DMARC from p=quarantine to p=reject | Final enforcement target |
| 6–8 weeks | Increase HSTS max-age from 1 month to 1 year | After confirmed stability |
| When stable | Enable HSTS includeSubDomains | Only after all subdomains confirmed HTTPS-clean |
| Quarterly | Review Cloudflare Security Insights scan | Dashboard → Security → Security Insights |
| When Workspace live | Update OWNER\_EMAIL in contact.js, redeploy | Replace Gmail with business address |
| When Workspace live | Update SPF and security.txt contact | Add Google SPF include, update contact email |

# **7\. LLM prompts for AI-assisted setup**

These prompts are designed to start an intelligent, context-aware conversation with Claude (or another LLM) without having to re-explain the stack from scratch. Paste the appropriate prompt at the start of a new conversation, then follow up with your specific question or task.

## **7.1  New domain — full setup**

Use this prompt when starting a brand new domain from scratch.

| PROMPT — New domain setup |
| :---- |
| I am setting up a new domain managed through Cloudflare. Here is my stack and context: \- Domain: \[DOMAIN NAME\] \- Canonical URL: apex (\[DOMAIN NAME\], not www) \- Hosting: Cloudflare Pages (static landing page for now) \- Email: \[none yet / Resend / Google Workspace\] \- Lead capture: Cloudflare Pages Function calling Resend API \- Future hosting: homelab via Cloudflare Tunnel (not direct port-forward) I want to complete the following phases in order: (1) Pages deploy and custom domain, (2) SSL/TLS hardening, (3) security headers via Transform Rule, (4) email authentication, (5) bot controls, (6) WAF settings, (7) email routing, (8) security.txt. Please guide me through each step, confirm my inputs before I apply anything destructive, and flag any gotchas for my specific setup. |

## **7.2  Cloudflare Security Insights remediation**

Use this prompt when you have a new Cloudflare Security Insights CSV export and want a structured remediation plan.

| PROMPT — Security Insights remediation |
| :---- |
| I have attached a Cloudflare Security Insights CSV export for my account. My stack is: \- Primary zone: \[DOMAIN NAME\] \- Cloudflare plan: Free \- Hosting: \[Cloudflare Pages / homelab via Cloudflare Tunnel\] \- Email provider: \[Resend / Google Workspace / none\] Please read the CSV, group findings by priority (P0 account-level, P1 TLS/transport, P2 email auth, P3 bot controls, P4 hygiene), and produce a detailed step-by-step remediation plan for each. Note any findings that appear to be duplicates or that require confirming existing DNS state before acting. Flag any step that could break live services if done in the wrong order. |

## **7.3  DNS audit and email auth repair**

Use this prompt when SPF, DKIM, or DMARC records need to be diagnosed or repaired.

| PROMPT — Email auth DNS repair |
| :---- |
| I need to audit and repair email authentication DNS records for \[DOMAIN NAME\]. Here is the current state from dig: \[PASTE dig TXT output here\] Email provider: \[Resend / Google Workspace / none\] DNS managed by: Cloudflare Please identify any missing, duplicate, or misconfigured SPF, DKIM, and DMARC records. Provide the exact record values to add or change, including Type, Name, and Content fields as they should be entered in Cloudflare DNS. Stage DMARC enforcement from p=none to p=reject over 6–8 weeks — do not recommend jumping straight to reject. |

## **7.4  Resend function setup or debugging**

Use this prompt when setting up or troubleshooting the Cloudflare Pages Function for Resend email capture.

| PROMPT — Resend Pages Function |
| :---- |
| I have a static landing page deployed on Cloudflare Pages with an email capture form. The form submits via fetch() to /api/contact, handled by a Cloudflare Pages Function at functions/api/contact.js. The function calls the Resend API server-side using the RESEND\_API\_KEY environment secret. \- Domain: \[DOMAIN NAME\] \- Resend sending domain: verified as \[DOMAIN NAME\] \- From address: hello@\[DOMAIN NAME\] \- Issue / request: \[DESCRIBE THE PROBLEM OR WHAT YOU NEED\] Important: the function must be deployed via wrangler pages deploy, not the dashboard uploader. The dashboard uploader does not process the functions/ directory. The RESEND\_API\_KEY must be set as an encrypted environment variable in Pages Settings, never hardcoded in the function file. |

## **7.5  Continue from a previous session**

Use this prompt when picking up where a previous session left off on any domain work.

| PROMPT — Resume session |
| :---- |
| I am continuing domain configuration work on \[DOMAIN NAME\], managed through Cloudflare. Here is where I left off: Completed: \[list phases done, e.g. Phase 1–6\] In progress: \[describe current state\] Remaining: \[list what is left\] Current DNS state (from dig):  \[paste relevant dig output\] My stack: Cloudflare Free plan, Cloudflare Pages for static hosting, Resend for transactional email (domain verified), homelab for future full site (will use Cloudflare Tunnel, not direct port-forward). Please pick up from where I left off and guide me through the remaining steps. |

# **8\. Quick reference**

## **DNS record types used in this runbook**

| Type | Purpose | Proxy status |
| :---- | :---- | :---- |
| A / CNAME | Points domain/subdomain to origin or Pages | Proxied (orange cloud) — always |
| MX | Routes inbound email to mail provider | DNS only — cannot be proxied |
| TXT (SPF) | Authorises servers to send email from domain | DNS only — cannot be proxied |
| TXT (DMARC) | Sets email authentication enforcement policy | DNS only — cannot be proxied |
| TXT (DKIM) | Cryptographic email signing key | DNS only — cannot be proxied |

## **Common failure modes**

| Symptom | Likely cause and fix |
| :---- | :---- |
| 522 Connection Timed Out | DNS/cert still propagating after custom domain connection. Wait 5–10 minutes. Confirm DNS records are proxied. |
| Form submits but errors immediately | Functions folder not deployed. Use wrangler CLI, not dashboard uploader. Confirm Functions tab shows routes. |
| Form clickable via tab/Enter but not mouse | A ::before or ::after pseudo-element with position:absolute and no pointer-events:none is covering the form. Add pointer-events:none to the overlay. |
| Resend domain shows Verified but DNS records missing | Auto-configure did not write records to Cloudflare. Add records manually from the Resend DNS Records page. |
| HSTS causes site inaccessibility | HSTS enabled before TLS was stable, or includeSubDomains enabled with a subdomain lacking HTTPS. Set max-age=0 to disable (browsers will not cache). |
| www redirect rule "may not apply" | www DNS record is DNS-only or missing. Choose Create a new proxied DNS record in the warning dialog. |

## **Cloudflare Free plan limitations relevant to this runbook**

* No custom WAF rules with complex logic (3 custom rules on Free)

* No Advanced Certificate Manager (Edge certificates are automatic and sufficient)

* No Argo Smart Routing

* Rate limiting rules are limited — use Cloudflare Tunnel \+ origin-level rate limiting for sensitive endpoints

* Pages Functions are available on Free with generous limits (100,000 requests/day)

Team Castaldi — Internal Reference Document   |   v1.0 · June 2026   |   *\[UPDATE IF CHANGED\] markers indicate fields requiring update when stack changes*