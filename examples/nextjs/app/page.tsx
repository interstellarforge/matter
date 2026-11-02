import { Badge, Button, Card, Input } from "@interstellarforge/matter-react";

import { Gallery } from "./Gallery";
import { ThemeSwitcher } from "./ThemeSwitcher";

/** Server component: Card, Badge, Input and Button render on the server without client JavaScript. */
export default function Page() {
  return (
    <main
      style={{
        display: "grid",
        gap: "var(--m-space-6)",
        padding: "var(--m-space-6)",
        maxWidth: 960,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "var(--m-fs-2xl)" }}>
        Matter on Next.js 16
      </h1>
      <ThemeSwitcher />
      <Card padded>
        <div style={{ display: "grid", gap: "var(--m-space-3)" }}>
          <Badge tone="success">Server rendered</Badge>
          <Input aria-label="Search vacancies" placeholder="Search vacancies" />
          <div>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </div>
      </Card>
      <Gallery />
    </main>
  );
}
