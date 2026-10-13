import Script from "next/script";

// Defines the window.plausible queue so events fired before the script loads are not lost.
const INIT_SNIPPET = `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()`;

export function PlausibleScript() {
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC;
  if (!src) return null;

  return (
    <>
      <Script src={src} strategy="afterInteractive" async />
      <Script id="plausible-init" strategy="afterInteractive">
        {INIT_SNIPPET}
      </Script>
    </>
  );
}
