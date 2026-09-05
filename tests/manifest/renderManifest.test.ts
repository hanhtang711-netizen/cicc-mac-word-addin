import { describe, expect, it } from "vitest";
import { renderManifest } from "../../scripts/render-manifest-lib.mjs";
describe("manifest renderer", () => {
  it("replaces every base URL and rejects insecure hosts", () => {
    expect(renderManifest("{{BASE_URL}}/taskpane.html", "https://example.com")).toBe("https://example.com/taskpane.html");
    expect(() => renderManifest("{{BASE_URL}}", "http://example.com")).toThrow("HTTPS");
    expect(() => renderManifest("{{BASE_URL}}", "https://foo.localhost")).toThrow("HTTPS");
  });
});
