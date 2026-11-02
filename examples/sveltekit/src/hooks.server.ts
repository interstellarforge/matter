import { themeInitScript } from "@interstellarforge/matter-css";
import type { Handle } from "@sveltejs/kit";

/** Inlines the Matter init script in <head>, before any stylesheet, so there is no theme flash. */
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%matter.init%", `<script>${themeInitScript}</script>`),
  });
