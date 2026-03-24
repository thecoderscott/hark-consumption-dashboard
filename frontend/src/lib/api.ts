import { GraphQLClient, gql } from "graphql-request";
import type { DashboardReading } from "./types";

// graphql-request is a lightweight GraphQL client — no cache, no normalisation,
// just sends the query and returns typed JSON. Right-sized for a single query.
// GRAPHQL_URL is server-side only (no NEXT_PUBLIC_ prefix) — the backend URL
// never needs to be exposed to the browser since all fetches go via server actions.
const client = new GraphQLClient(
  process.env.GRAPHQL_URL ?? "http://localhost:5000/graphql"
);

const DASHBOARD_QUERY = gql`
  query DashboardData {
    dashboardReadings {
      timestamp
      consumption
      isAnomaly
      averageTemperature
      averageHumidity
    }
  }
`;

// Wraps the raw GraphQL response so we get a typed array back rather than
// having to destructure dashboardReadings at every call site.
type DashboardQueryResponse = {
  dashboardReadings: DashboardReading[];
};

// delayMs is a dev/demo tool — when non-zero it artificially pauses before
// fetching so the loading state is visible. Always 0 in normal usage.
export async function fetchDashboardReadings(delayMs = 0): Promise<DashboardReading[]> {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const data = await client.request<DashboardQueryResponse>(DASHBOARD_QUERY);
  return data.dashboardReadings;
}
