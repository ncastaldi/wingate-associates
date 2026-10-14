import type { Metadata } from "next";
import Link from "next/link";
import { SystemsDiff } from "@/components/systems-diff";
import { HOME_DESCRIPTION, pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({ description: HOME_DESCRIPTION, path: "/" });

export default function HomePage() {
  return (
    <main>
      <header data-hero="">
        <h1>Most IT problems aren’t technology problems.</h1>
        <p>
          They’re process problems, data problems, or nobody-noticed-until-it-was-a-crisis problems.
          I find those and I build the fix.
        </p>
        <p>
          I work with companies that have outgrown “someone handles IT.” Usually there’s an MSP or a
          small team doing the work. Nobody owns making it run well.
        </p>
        <p>
          <Link data-button="primary" href="/contact">
            Tell me what’s broken
          </Link>
          <Link data-button="secondary" href="/services">
            See services
          </Link>
        </p>
        <SystemsDiff />
      </header>

      <section aria-labelledby="problems-heading">
        <h2 id="problems-heading">What that tends to look like</h2>
        <ul data-list="queue">
          <li>Tickets sit for days and nobody can say why.</li>
          <li>People who left months ago still have working accounts.</li>
          <li>Nobody is sure who has access to what.</li>
          <li>The MSP closes tickets but the same problems come back.</li>
          <li>How things actually work lives in one person’s head.</li>
        </ul>
      </section>

      <section aria-labelledby="work-heading">
        <h2 id="work-heading">Recent work</h2>
        <ul data-list="cards">
          <li>
            <h3>Nexus</h3>
            <p>
              An MCP server I built in Python. It compares Active Directory and Entra ID and flags
              the gaps, like terminated users who still have working accounts. Workday is next. Each
              system plugs in as its own module, and every call is logged.
            </p>
          </li>
          <li>
            <h3>
              <a href="https://jobsquatch.us">Jobsquatch</a>
            </h3>
            <p>
              A text-based interview that builds a voice profile. The platform uses that profile as
              a constraint when it helps you write job application material. Right now that’s cover
              letters. Resumes are in beta. Self-hosted, built on FastAPI, React, Postgres and the
              Anthropic API.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}
