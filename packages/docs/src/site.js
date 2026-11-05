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

// Rich text editor demo: contenteditable + execCommand, only to keep the demo small.
for (const editor of $$('[data-demo="editor"]')) {
  const content = $(".m-editor__content", editor);
  const blockSelect = $("[data-block]", editor);
  const buttons = $$("[data-cmd]", editor);
  const currentBlock = () =>
    String(document.queryCommandValue("formatBlock")).toLowerCase();
  const sync = () => {
    const empty =
      !content.textContent.trim() && !content.querySelector("li, blockquote");
    content.toggleAttribute("data-empty", empty);
    for (const button of buttons) {
      const cmd = button.dataset.cmd;
      if (cmd === "quote") {
        button.setAttribute(
          "aria-pressed",
          String(currentBlock() === "blockquote"),
        );
      } else if (button.hasAttribute("aria-pressed")) {
        button.setAttribute(
          "aria-pressed",
          String(document.queryCommandState(cmd)),
        );
      } else if (cmd === "undo" || cmd === "redo") {
        button.disabled = !document.queryCommandEnabled(cmd);
      }
    }
    const block = currentBlock();
    blockSelect.value = ["h2", "h3"].includes(block) ? block : "p";
  };
  const linkDialog = $("[data-link-dialog]", editor);
  const linkInput = $("[data-link-url]", linkDialog);
  let saved = null;
  $("[data-link-cancel]", linkDialog).addEventListener("click", () =>
    linkDialog.close(),
  );
  // Focus returns to the toolbar button on close; restore the selection before inserting.
  $("form", linkDialog).addEventListener("submit", () => {
    // The page is inert while the modal is open, so close it before focusing the editor.
    linkDialog.close();
    content.focus();
    if (saved) {
      getSelection().removeAllRanges();
      getSelection().addRange(saved);
    }
    run("createLink", linkInput.value);
  });
  const run = (cmd, value) => {
    content.focus();
    document.execCommand(cmd, false, value);
    sync();
  };
  for (const button of buttons) {
    // Keep the text selection while the button is pressed.
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => {
      const cmd = button.dataset.cmd;
      if (cmd === "quote") {
        run(
          "formatBlock",
          currentBlock() === "blockquote" ? "p" : "blockquote",
        );
      } else if (cmd === "link") {
        const selection = getSelection();
        saved = selection.rangeCount
          ? selection.getRangeAt(0).cloneRange()
          : null;
        linkInput.value = "";
        linkDialog.showModal();
      } else {
        run(cmd);
      }
    });
  }
  blockSelect.addEventListener("change", () =>
    run("formatBlock", blockSelect.value),
  );
  content.addEventListener("input", sync);
  content.addEventListener("keyup", sync);
  content.addEventListener("mouseup", sync);
  content.addEventListener("focus", sync);
  // One tab stop for the buttons; arrows, Home and End move between them.
  const toolbar = $('[role="toolbar"]', editor);
  const items = () => $$("button:not(:disabled)", toolbar);
  const rove = (target) => {
    for (const item of $$("button", toolbar)) item.tabIndex = -1;
    target.tabIndex = 0;
  };
  rove(buttons[0]);
  toolbar.addEventListener("focusin", (event) => {
    if (event.target.matches("button")) rove(event.target);
  });
  toolbar.addEventListener("keydown", (event) => {
    const list = items();
    const index = list.indexOf(document.activeElement);
    if (index < 0) return;
    const next = {
      ArrowRight: (index + 1) % list.length,
      ArrowLeft: (index - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    list[next].focus();
  });
  sync();
}

// Slider: the filled track follows the value.
for (const slider of $$("input.m-slider")) {
  const fill = () => {
    const min = Number(slider.min || 0);
    const max = Number(slider.max || 100);
    slider.style.setProperty(
      "--m-slider-fill",
      `${((Number(slider.value) - min) / (max - min)) * 100}%`,
    );
  };
  slider.addEventListener("input", fill);
  fill();
}

// Number stepper: buttons step, values are clamped and rounded to the step.
for (const stepper of $$(".m-stepper")) {
  const input = $("input", stepper);
  const [minus, plus] = $$("button", stepper);
  const step = Number(input.step || 1);
  const decimals = (String(step).split(".")[1] ?? "").length;
  const sync = () => {
    minus.disabled =
      input.value !== "" && Number(input.value) <= Number(input.min);
    plus.disabled =
      input.value !== "" && Number(input.value) >= Number(input.max);
    const unit = $(".m-stepper__unit", stepper)?.textContent;
    if (unit) input.setAttribute("aria-valuetext", `${input.value} ${unit}`);
  };
  const set = (value) => {
    const lo = input.min === "" ? -Infinity : Number(input.min);
    const hi = input.max === "" ? Infinity : Number(input.max);
    input.value = String(
      Math.min(hi, Math.max(lo, Number(value.toFixed(decimals)))),
    );
    sync();
  };
  minus.addEventListener("click", () => set(Number(input.value || 0) - step));
  plus.addEventListener("click", () => set(Number(input.value || 0) + step));
  input.addEventListener("input", sync);
  input.addEventListener("blur", () =>
    set(Number(input.value || input.min || 0)),
  );
  sync();
}

// Sortable list and Kanban board: pointer and keyboard moves on the markup-only previews.
function moveByKey(event, item, siblings) {
  const index = siblings.indexOf(item);
  const to = { ArrowUp: index - 1, ArrowDown: index + 1 }[event.key];
  if (to === undefined || to < 0 || to >= siblings.length) return false;
  event.preventDefault();
  const other = siblings[to];
  item.parentElement.insertBefore(item, to < index ? other : other.nextSibling);
  return true;
}

for (const list of $$("ul.m-sortable")) {
  const items = () => $$(":scope > .m-sortable__item", list);
  for (const grip of $$(".m-sortable__grip", list)) {
    const item = grip.closest("li");
    grip.addEventListener("keydown", (event) => {
      if (moveByKey(event, item, items())) grip.focus();
    });
  }

  let drag;
  list.addEventListener("pointerdown", (event) => {
    const item = event.target.closest(".m-sortable__item");
    if (!item || event.button !== 0) return;
    if (
      event.target.closest("a, button") &&
      !event.target.closest(".m-sortable__grip")
    )
      return;
    event.preventDefault();
    const rect = item.getBoundingClientRect();
    drag = {
      item,
      x: event.clientX,
      y: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      rect,
    };
  });
  window.addEventListener("pointermove", (event) => {
    if (!drag) return;
    if (!drag.ghost) {
      if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5)
        return;
      drag.ghost = drag.item.cloneNode(true);
      drag.ghost.classList.add("m-sortable__ghost");
      drag.ghost.setAttribute("aria-hidden", "true");
      drag.ghost.style.setProperty("--m-ghost-w", `${drag.rect.width}px`);
      drag.placeholder = document.createElement("li");
      drag.placeholder.className = "m-sortable__placeholder";
      drag.placeholder.style.setProperty(
        "--m-placeholder-h",
        `${drag.rect.height}px`,
      );
      drag.item.dataset.dragging = "";
      list.dataset.sorting = "";
      document.body.append(drag.ghost);
    }
    drag.ghost.style.setProperty("--m-ghost-x", `${event.clientX - drag.dx}px`);
    drag.ghost.style.setProperty("--m-ghost-y", `${event.clientY - drag.dy}px`);
    const others = items().filter((el) => el !== drag.item);
    const before = others.find((el) => {
      const r = el.getBoundingClientRect();
      return event.clientY < r.top + r.height / 2;
    });
    list.insertBefore(drag.placeholder, before ?? null);
  });
  const end = () => {
    if (!drag) return;
    const { item, ghost, placeholder } = drag;
    drag = undefined;
    if (!ghost) return;
    placeholder.replaceWith(item);
    delete item.dataset.dragging;
    delete list.dataset.sorting;
    ghost.remove();
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

for (const board of $$(".m-kanban")) {
  const emptyLabel = board.dataset.empty ?? "";
  const refresh = () => {
    for (const column of $$(".m-kanban__column", board)) {
      const list = $(".m-kanban__list", column);
      const cards = $$(":scope > .m-kanban__card", list);
      $(".m-kanban__header .m-badge", column).textContent = String(
        cards.length,
      );
      $(".m-kanban__empty", list)?.remove();
      if (
        cards.length === 0 &&
        emptyLabel &&
        !$(".m-kanban__placeholder", list)
      ) {
        const empty = document.createElement("li");
        empty.className = "m-kanban__empty";
        empty.textContent = emptyLabel;
        list.append(empty);
      }
    }
  };
  refresh();

  for (const grip of $$(".m-kanban__grip", board)) {
    const card = grip.closest("li");
    grip.addEventListener("keydown", (event) => {
      const list = card.parentElement;
      if (moveByKey(event, card, $$(":scope > .m-kanban__card", list))) {
        grip.focus();
        return;
      }
      const columns = $$(".m-kanban__column", board);
      const at = columns.indexOf(card.closest(".m-kanban__column"));
      const target = columns[at + { ArrowLeft: -1, ArrowRight: 1 }[event.key]];
      if (!target) return;
      event.preventDefault();
      const targetList = $(".m-kanban__list", target);
      const cards = $$(":scope > .m-kanban__card", targetList);
      const index = $$(":scope > .m-kanban__card", list).indexOf(card);
      targetList.insertBefore(card, cards[index] ?? null);
      refresh();
      grip.focus();
    });
  }

  let drag;
  board.addEventListener("pointerdown", (event) => {
    const card = event.target.closest(".m-kanban__card");
    if (!card || event.button !== 0) return;
    if (
      event.target.closest("a, button") &&
      !event.target.closest(".m-kanban__grip")
    )
      return;
    event.preventDefault();
    const rect = card.getBoundingClientRect();
    drag = {
      card,
      x: event.clientX,
      y: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      rect,
    };
  });
  window.addEventListener("pointermove", (event) => {
    if (!drag) return;
    if (!drag.ghost) {
      if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5)
        return;
      drag.ghost = drag.card.cloneNode(true);
      drag.ghost.classList.add("m-kanban__ghost");
      drag.ghost.setAttribute("aria-hidden", "true");
      drag.ghost.style.setProperty("--m-ghost-w", `${drag.rect.width}px`);
      drag.placeholder = document.createElement("li");
      drag.placeholder.className = "m-kanban__placeholder";
      drag.placeholder.style.setProperty(
        "--m-placeholder-h",
        `${drag.rect.height}px`,
      );
      drag.card.dataset.dragging = "";
      board.dataset.dragging = "";
      document.body.append(drag.ghost);
    }
    drag.ghost.style.setProperty("--m-ghost-x", `${event.clientX - drag.dx}px`);
    drag.ghost.style.setProperty("--m-ghost-y", `${event.clientY - drag.dy}px`);
    const column = $$(".m-kanban__column", board).find((el) => {
      const r = el.getBoundingClientRect();
      return (
        event.clientX >= r.left &&
        event.clientX <= r.right &&
        event.clientY >= r.top &&
        event.clientY <= r.bottom
      );
    });
    for (const el of $$(".m-kanban__column", board))
      el.toggleAttribute("data-over", el === column);
    if (!column) {
      drag.placeholder.remove();
      return;
    }
    const list = $(".m-kanban__list", column);
    $(".m-kanban__empty", list)?.remove();
    const cards = $$(":scope > .m-kanban__card", list).filter(
      (el) => el !== drag.card,
    );
    const before = cards.find((el) => {
      const r = el.getBoundingClientRect();
      return event.clientY < r.top + r.height / 2;
    });
    list.insertBefore(drag.placeholder, before ?? null);
  });
  const end = () => {
    if (!drag) return;
    const { card, ghost, placeholder } = drag;
    drag = undefined;
    if (!ghost) return;
    if (placeholder.parentElement) placeholder.replaceWith(card);
    delete card.dataset.dragging;
    delete board.dataset.dragging;
    for (const el of $$(".m-kanban__column", board))
      el.removeAttribute("data-over");
    ghost.remove();
    refresh();
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}
