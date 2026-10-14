import { ImageResponse } from "next/og";

export const alt = "Wingate Associates";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generated at build time. Matches the placeholder icon until there is a logo.
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background: "#1f2a44",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: 88 }}>Wingate Associates</div>
      <div style={{ fontSize: 40, marginTop: 24, opacity: 0.8 }}>Independent consulting</div>
    </div>,
    size,
  );
}
