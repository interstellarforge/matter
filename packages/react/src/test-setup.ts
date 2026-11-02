import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no modal <dialog>; emulate the parts Matter relies on.
HTMLDialogElement.prototype.showModal = function showModal(
  this: HTMLDialogElement,
) {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute("open");
  this.dispatchEvent(new Event("close"));
};

afterEach(cleanup);
