import { expect, test } from "@playwright/test";

// Same gallery in both demos: Next.js (React) and SvelteKit (Svelte).
for (const [name, baseURL] of [
  ["nextjs", "http://127.0.0.1:3101"],
  ["sveltekit", "http://127.0.0.1:3102"],
] as const) {
  test.describe(name, () => {
    test.use({ baseURL });

    test("applies the stored colour mode before first paint", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        localStorage.setItem("matter-color-mode", "dark");
        const w = window as unknown as { __modeAtBody?: string | null };
        new MutationObserver((_, observer) => {
          if (document.querySelector("body")) {
            w.__modeAtBody =
              document.documentElement.getAttribute("data-color-mode");
            observer.disconnect();
          }
        }).observe(document, { childList: true, subtree: true });
      });
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");

      expect(
        await page.evaluate(
          () => (window as unknown as { __modeAtBody?: string }).__modeAtBody,
        ),
      ).toBe("dark");
    });

    test("hydrates without console errors and the dialog works with the keyboard", async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto("/");
      await page.getByRole("button", { name: "Open dialog" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();

      expect(errors).toStrictEqual([]);
    });

    test("menu and tabs follow keyboard conventions", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Actions" }).press("ArrowDown");
      await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("last-action")).toHaveText(
        "Last action: edit",
      );

      const tabs = page.getByRole("tab");
      await tabs.first().focus();
      await page.keyboard.press("ArrowRight");
      // "Details" is disabled and skipped.
      await expect(page.getByRole("tab", { name: "History" })).toBeFocused();
    });
  });
}
