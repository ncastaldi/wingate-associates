import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Wingate Associates</h1>
      <p>Independent consulting practice. Site under construction.</p>
      <p>
        <Link href="/contact">Get in touch</Link>
      </p>
    </main>
  );
}
