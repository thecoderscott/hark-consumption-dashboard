import { animationTimings } from "@/constants/chart/animationTimings";

describe("animationTimings", () => {
  it("has the expected timing values", () => {
    expect(animationTimings.chart).toBe(1000);
    expect(animationTimings.consumption).toBe(1200);
    expect(animationTimings.temperature).toBe(1200);
  });

  it("has all expected keys", () => {
    // Confirms the shape hasn't been accidentally changed.
    expect(Object.keys(animationTimings)).toEqual(
      expect.arrayContaining(["chart", "consumption", "temperature"])
    );
  });
});
