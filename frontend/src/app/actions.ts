"use server";

import { fetchDashboardReadings } from "@/lib/api";
import type { DashboardReading } from "@/lib/types";

// Server action rather than an API route - this is internal UI logic with no
// reason to exist as a public HTTP endpoint. Server actions are called directly
// by Next.js over an internal transport, avoiding the overhead of a full HTTP
// round trip and keeping the GraphQL URL server-side only.
export async function getDashboardReadings(delayMs: number): Promise<DashboardReading[]> {
  return fetchDashboardReadings(delayMs);
}
