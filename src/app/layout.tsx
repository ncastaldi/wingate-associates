import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PlausibleScript } from "@/components/plausible-script";

export const metadata: Metadata = {
  title: "Wingate Associates",
  description: "Independent consulting: services, engagement models and technical portfolio.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PlausibleScript />
      </body>
    </html>
  );
}
