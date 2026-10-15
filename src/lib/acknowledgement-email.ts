import { SITE_URL } from "./site";

// The confirmation a visitor gets after using the contact form. The content is fixed: nothing
// the visitor typed is echoed back, so the form cannot be used to mail arbitrary text to
// strangers. Copy follows docs/voice/README.md.

export const ACKNOWLEDGEMENT_SUBJECT = "Thank you for reaching out!";

// One string per paragraph. The HTML and plain-text versions are both built from these, so
// the wording only lives here.
export const ACKNOWLEDGEMENT_PARAGRAPHS = [
  "Your message is in. I’ll reply by email.",
  "If it sounds like something I can fix, we set up a free 30-minute call. After that you get a written quote, and you decide.",
  "Two things help me give you a useful answer faster: roughly how many people you support, and who runs IT today (an MSP, someone in-house, or nobody in particular). Reply here with either. No need to dress it up.",
];

const SIGNATURE_NAME = "Nathan Castaldi";
const COMPANY = "Wingate Associates";

export const ACKNOWLEDGEMENT_TEXT = [
  ...ACKNOWLEDGEMENT_PARAGRAPHS,
  [SIGNATURE_NAME, SITE_URL].join("\n"),
].join("\n\n");

// Colours and type from the design system (design/system/tokens). Email clients ignore
// external CSS and web fonts, so everything is inline and the fonts are system fallbacks.
const NAVY = "#0e2745";
const MUTED = "#4b5a6b";
const LINK = "#1f6470";
const PAPER = "#f6f6f2";
const BORDER = "#d6d9d6";
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const paragraph = (text: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${NAVY};">${text}</p>`;

export const ACKNOWLEDGEMENT_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${ACKNOWLEDGEMENT_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:4px;font-family:${FONT};">
<tr><td style="padding:24px 28px 8px;">
<img src="${SITE_URL}/logo-mark.png" width="32" height="32" alt="Wingate Associates" style="display:block;border:0;">
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${ACKNOWLEDGEMENT_PARAGRAPHS.map(paragraph).join("\n")}
</td></tr>
<tr><td style="padding:8px 28px 28px;border-top:1px solid ${BORDER};">
<p style="margin:16px 0 0;font-size:15px;line-height:1.5;color:${NAVY};font-weight:600;">${SIGNATURE_NAME}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${MUTED};"><a href="${SITE_URL}" style="color:${LINK};">${COMPANY}</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
