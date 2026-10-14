import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PlausibleScript } from "@/components/plausible-script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOME_DESCRIPTION, pageMetadata } from "@/lib/page-metadata";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    description: HOME_DESCRIPTION,
  }),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <PlausibleScript />
      </body>
    </html>
  );
}
