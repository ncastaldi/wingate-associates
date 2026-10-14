import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "IT operations assessments, identity and access cleanup, and service desk automation. Every engagement is quoted after a free 30-minute call.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main>
      <header>
        <h1>Services</h1>
        <p>
          Every engagement is quoted after a first call. That call is free and takes 30 minutes, on
          video or in person if you’re in the metro.
        </p>
      </header>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading">What I do</h2>
        <ul data-list="cards">
          <li>
            <h3>IT operations assessment</h3>
            <p>
              I spend about two weeks in your tickets, accounts, documentation and MSP reports. You
              get a written plan in priority order. You can act on it with me or without me.
            </p>
          </li>
          <li>
            <h3>Identity and access cleanup</h3>
            <p>
              I match what HR says against what Active Directory and Entra ID say, then close the
              gaps. Ghost accounts go. Roles get simpler so access requests stop being guesswork.
            </p>
            <figure data-stat="">
              <p aria-hidden="true">
                <data value="24">24</data>
                <data value="7">7</data>
              </p>
              <figcaption>
                In one business unit of a 3,000-person company I took 24 roles down to 7.
              </figcaption>
            </figure>
          </li>
          <li>
            <h3>Service desk and automation</h3>
            <p>
              I make the queue visible, set targets people can hit, and write down how things get
              done. Then I automate the work that keeps coming back.
            </p>
            <figure data-stat="">
              <p aria-hidden="true">
                <data value="5.05">5.05</data>
                <data value="4.65">4.65</data>
              </p>
              <figcaption>At the same company I took MTTR from 5.05 days to 4.65.</figcaption>
            </figure>
          </li>
        </ul>
      </section>

      <section aria-labelledby="engagement-heading">
        <h2 id="engagement-heading">How we can work together</h2>
        <ul data-list="tiles">
          <li>
            <h3>Assessment</h3>
            <p>Fixed scope and fixed fee. Most clients start here.</p>
          </li>
          <li>
            <h3>Project</h3>
            <p>Scope and price agreed before I start.</p>
          </li>
          <li>
            <h3>Ongoing</h3>
            <p>
              A monthly retainer as your part-time IT operations lead. That can include managing
              your MSP for you.
            </p>
          </li>
        </ul>
        <p role="note">
          I’m based in Atlanta. I work on-site around the metro and remotely anywhere, and I’ll
          travel for the right project.
        </p>
      </section>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading">About me</h2>
        <p>
          I’m Nathan Castaldi. I’ve spent 15 years in IT operations. Most recently I led a desk-side
          support team of seven across Atlanta and Chicago for a fleet-leasing company.
        </p>
        <p>
          Before that I ran IT operations for a global advertising group, first in London and then
          in Atlanta. I was the layer between IBM’s managed service and 12 local business units.
        </p>
        <p>
          I take on consulting projects and contract roles. I’m open to the right full-time role
          too.
        </p>
        <p>
          <Link data-button="primary" href="/contact">
            Tell me what’s broken
          </Link>
        </p>
      </section>
    </main>
  );
}
