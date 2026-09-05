import { describe, expect, it } from "vitest";
import { mountTaskpane } from "../../src/taskpane";
describe("taskpane", () => {
  it("does not inject gray placeholder text into document controls", () => {
    document.body.innerHTML = '<div id="style-buttons"></div><div id="layout-buttons"></div><div id="toc-buttons"></div>';
    mountTaskpane();
    expect(document.body.textContent).not.toContain("在此粘贴"); expect(document.querySelectorAll("button").length).toBe(14);
  });
});
