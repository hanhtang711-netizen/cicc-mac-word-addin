import { describe, expect, it } from "vitest";
import { createHandlers } from "../../src/app/commandHandlers";
describe("command handlers", () => {
  it("routes style, layout, and toc commands and completes ribbon events", async () => {
    const calls: string[] = []; const deps: any = { gateway: { applySelectionStyle: async (id: string) => calls.push(`style:${id}`), insertLayout: async (id: string) => calls.push(`layout:${id}`), insertOrUpdateToc: async (id: string) => calls.push(`toc:${id}`) }, feedback: { success: () => undefined, error: () => undefined } };
    const h = createHandlers(deps); const event = { completed: () => calls.push("completed") };
    await h.applyHeading1(event); await h.insertDoubleLayout(event); await h.insertToc(event);
    expect(calls).toEqual(["style:bodyHeading1", "completed", "layout:double", "completed", "toc:toc", "completed"]);
  });
});
