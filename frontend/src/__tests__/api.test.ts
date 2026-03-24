import { fetchDashboardReadings } from "@/lib/api";

// Mock graphql-request so tests don't need a running backend.
jest.mock("graphql-request", () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn().mockResolvedValue({
      dashboardReadings: [
        {
          timestamp: "2020-01-01T00:00:00Z",
          consumption: 10.5,
          isAnomaly: false,
          averageTemperature: 9.0,
          averageHumidity: 0.9,
        },
      ],
    }),
  })),
  gql: jest.fn((query) => query),
}));

describe("fetchDashboardReadings", () => {
  it("returns dashboard readings from the GraphQL response", async () => {
    const result = await fetchDashboardReadings(0);

    expect(result).toHaveLength(1);
    expect(result[0].consumption).toBe(10.5);
    expect(result[0].isAnomaly).toBe(false);
  });

  it("delays by the specified amount before fetching", async () => {
    const start = Date.now();
    await fetchDashboardReadings(200);
    const elapsed = Date.now() - start;

    // Allow some margin for test environment timing variance.
    expect(elapsed).toBeGreaterThanOrEqual(190);
  });

  it("does not delay when delayMs is 0", async () => {
    const start = Date.now();
    await fetchDashboardReadings(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(100);
  });
});
