const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const html = document.documentElement;

// Theme, colour mode and density switchers.
for (const select of $$("[data-switch]")) {
  const key = select.dataset.switch;
  select.value =
    html.getAttribute(`data-${key}`) ??
    (key === "color-mode" ? "system" : select.options[0].value);
  select.addEventListener("change", () => {
    if (select.value === "system") {
      html.removeAttribute(`data-${key}`);
      localStorage.removeItem(`matter-${key}`);
    } else {
      html.setAttribute(`data-${key}`, select.value);
      localStorage.setItem(`matter-${key}`, select.value);
    }
    fillTokens();
  });
}

// Mobile navigation.
$(".menu-toggle")?.addEventListener("click", (event) => {
  const open = document.body.dataset.nav !== "open";
  document.body.dataset.nav = open ? "open" : "";
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

// Live token values.
function fillTokens() {
  const styles = getComputedStyle(html);
  for (const element of $$("[data-token]")) {
    element.textContent = styles
      .getPropertyValue(`--m-${element.dataset.token}`)
      .trim();
  }
}
fillTokens();

// Code tabs (HTML / React / Svelte) and copy.
for (const example of $$(".example")) {
  const tabs = $$("button.tab", example);
  const panes = $$("pre", example);
  const show = (index) => {
    tabs.forEach((tab, i) =>
      tab.setAttribute("aria-selected", String(i === index)),
    );
    panes.forEach((pane, i) => (pane.hidden = i !== index));
  };
  tabs.forEach((tab, index) =>
    tab.addEventListener("click", () => show(index)),
  );
  $(".copy", example)?.addEventListener("click", async (event) => {
    const pane = panes.find((candidate) => !candidate.hidden);
    await navigator.clipboard?.writeText(pane?.textContent ?? "");
    event.currentTarget.textContent = "Copied";
    setTimeout(() => (event.currentTarget.textContent = "Copy"), 1500);
  });
}

// Demo behaviour for the markup-only previews.
for (const element of $$('[data-demo="switch"]')) {
  element.addEventListener("click", () =>
    element.setAttribute(
      "aria-checked",
      String(element.getAttribute("aria-checked") !== "true"),
    ),
  );
}
for (const tabs of $$('[data-demo="tabs"]')) {
  const buttons = $$('[role="tab"]', tabs);
  const panels = $$('[role="tabpanel"]', tabs);
  const select = (index) => {
    buttons.forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    buttons[index].focus();
  };
  buttons.forEach((button, index) =>
    button.addEventListener("click", () => select(index)),
  );
  tabs.addEventListener("keydown", (event) => {
    const enabled = buttons
      .map((button, index) => (button.disabled ? -1 : index))
      .filter((index) => index >= 0);
    const current = buttons.indexOf(document.activeElement);
    const at = enabled.indexOf(current);
    const target = {
      ArrowRight: enabled[(at + 1) % enabled.length],
      ArrowLeft: enabled[(at - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled.at(-1),
    }[event.key];
    if (target !== undefined) {
      event.preventDefault();
      select(target);
    }
  });
}
for (const menu of $$('[data-demo="menu"]')) {
  const trigger = $("button", menu);
  const list = $(".m-menu", menu);
  const items = $$(".m-menu__item:not(:disabled)", menu);
  const set = (open) => {
    list.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) items[0]?.focus();
  };
  trigger.addEventListener("click", () => set(list.hidden));
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      set(false);
      trigger.focus();
    }
    const at = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      (items[at + 1] ?? items[0]).focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      (items[at - 1] ?? items.at(-1)).focus();
    }
  });
  for (const item of items)
    item.addEventListener("click", () => {
      set(false);
      trigger.focus();
    });
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) set(false);
  });
}
for (const wrap of $$('[data-demo="tooltip"]')) {
  const tip = $(".m-tooltip", wrap);
  const set = (open) => (tip.hidden = !open);
  wrap.addEventListener("mouseenter", () => set(true));
  wrap.addEventListener("mouseleave", () => set(false));
  wrap.addEventListener("focusin", () => set(true));
  wrap.addEventListener("focusout", () => set(false));
  wrap.addEventListener(
    "keydown",
    (event) => event.key === "Escape" && set(false),
  );
}
for (const dialog of $$('dialog[data-demo="dialog"]')) {
  const scope = dialog.parentElement;
  const opener = $('[data-demo="dialog-open"]', scope);
  opener.addEventListener("click", () => dialog.showModal());
  for (const close of $$('[data-demo="dialog-close"]', dialog))
    close.addEventListener("click", () => dialog.close());
}

// Search.
const input = $(".search input");
const list = $(".results");
let pages = null;
async function load() {
  pages ??= await (
    await fetch(`${document.documentElement.dataset.root}search.json`)
  ).json();
}
input?.addEventListener("input", async () => {
  await load();
  const query = input.value.trim().toLowerCase();
  list.replaceChildren();
  list.hidden = !query;
  if (!query) return;
  const hits = pages
    .filter((page) =>
      `${page.title} ${page.text}`.toLowerCase().includes(query),
    )
    .slice(0, 8);
  for (const page of hits) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `${document.documentElement.dataset.root}${page.url}`;
    const title = document.createElement("strong");
    title.textContent = page.title;
    const section = document.createElement("small");
    section.textContent = `${page.section}: ${page.text}`.slice(0, 90);
    link.append(title, section);
    item.append(link);
    list.append(item);
  }
  if (!hits.length) list.innerHTML = "<li><small>No results</small></li>";
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "/" &&
    document.activeElement !== input &&
    !/input|textarea|select/i.test(document.activeElement?.tagName ?? "")
  ) {
    event.preventDefault();
    input?.focus();
  }
  if (event.key === "Escape" && input) {
    list.hidden = true;
  }
});
