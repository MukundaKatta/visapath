import { describe, it, expect } from "vitest";
import { Visapath } from "../src/core.js";
describe("Visapath", () => {
  it("init", () => { expect(new Visapath().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Visapath(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Visapath(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
