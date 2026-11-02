import "@interstellarforge/matter-css/matter.css";

import { themeInitScript } from "@interstellarforge/matter-css";
import type { ReactNode } from "react";

export const metadata = { title: "Matter · Next.js example" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The init script sets data-theme/data-color-mode/data-density before first paint, so the
    // server markup and the client attributes may differ on <html> only.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        style={{
          margin: 0,
          background: "var(--m-bg)",
          color: "var(--m-text)",
          fontFamily: "var(--m-font-sans)",
          fontSize: "var(--m-control-fs)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
