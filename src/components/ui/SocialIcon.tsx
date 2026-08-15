type Platform = "instagram" | "facebook" | "tiktok" | "linkedin" | "whatsapp" | "other";

export function detectPlatform(label: string): Platform {
  const l = label.toLowerCase();
  if (l.includes("insta")) return "instagram";
  if (l.includes("facebook")) return "facebook";
  if (l.includes("tiktok")) return "tiktok";
  if (l.includes("linkedin")) return "linkedin";
  if (l.includes("whatsapp")) return "whatsapp";
  return "other";
}

export function SocialIcon({ platform, size = 18 }: { platform: Platform; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.6 1.8c.46-.16 1.26-.35 2.43-.4C9.28 1.34 9.68 1.33 12 1.33Zm0 3.05a6.72 6.72 0 1 0 0 13.44 6.72 6.72 0 0 0 0-13.44Zm0 2a4.72 4.72 0 1 1 0 9.44 4.72 4.72 0 0 1 0-9.44Zm6.9-2.16a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28C16.3 4.2 15.4 4.1 14.3 4.1c-2.3 0-3.9 1.4-3.9 4v2.4H8v3h2.4V21h3.1Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M16.6 2c.4 2.2 2 3.9 4.4 4.1v3c-1.6.1-3-.4-4.4-1.3v6.7a6.1 6.1 0 1 1-6.1-6.1c.3 0 .6 0 .9.1v3.1a3 3 0 1 0 2.1 2.9V2h3.1Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.5-2.26 3.1V21h-4V9Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.36-1.28a9.9 9.9 0 0 0 4.68 1.19h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.24c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.02.24-3.4-.72-2.9-1.15-4.75-4.1-4.9-4.3-.14-.2-1.17-1.56-1.17-2.98 0-1.42.75-2.11 1.01-2.4.26-.28.58-.36.77-.36h.55c.18 0 .42-.03.65.5.24.55.8 1.9.87 2.04.07.14.12.3.02.49-.1.19-.15.3-.3.46-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.17.28.75 1.24 1.62 2 1.11.99 2.05 1.3 2.33 1.44.28.14.44.12.6-.07.17-.19.72-.84.92-1.13.19-.28.38-.23.64-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
        </svg>
      );
    default:
      return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
