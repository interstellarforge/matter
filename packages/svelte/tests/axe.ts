import axe from "axe-core";

/** Violations found by axe in jsdom. Contrast is covered by the token build, not here. */
export async function violations(container: Element): Promise<string[]> {
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return result.violations.map(
    ({ id, nodes }) => `${id}: ${nodes[0]?.html ?? ""}`,
  );
}
