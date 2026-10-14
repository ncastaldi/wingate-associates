import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PlausibleScript } from "@/components/plausible-script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Wingate Associates",
  description: "Independent consulting: services, engagement models and technical portfolio.",
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
