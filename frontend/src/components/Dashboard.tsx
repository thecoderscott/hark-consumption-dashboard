"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Spin, Alert, Typography, Space } from "antd";
import { getDashboardReadings } from "@/app/actions";
import { useDashboard } from "@/context/DashboardContext";
import ConsumptionChart from "./ConsumptionChart";
import DelayToggle from "./DelayToggle";
import type { DashboardReading } from "@/lib/types";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { delayEnabled, delayMs } = useDashboard();
  const [readings, setReadings] = useState<DashboardReading[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Extracted as a named function rather than inlined in useEffect so it can
  // be called from multiple places - e.g. the effect on mount/setting change,
  // or a retry button if we add one later. useCallback keeps the reference
  // stable so it can be safely included in the useEffect dependency array.
  const load = useCallback(() => {
    startTransition(async () => {
      try {
        setError(null);
        const data = await getDashboardReadings(delayEnabled ? delayMs : 0);
        setReadings(data);
      } catch {
        setError("Failed to load dashboard data. Is the backend running?");
      }
    });
  }, [delayEnabled, delayMs]);

  // Re-runs whenever delay settings change so the toggle is immediately
  // demonstrable - flip the switch and watch the loading state kick in.
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Energy Consumption Dashboard
            </Title>
            <Text type="secondary">Half-hourly readings - January 2020</Text>
          </div>
          <DelayToggle />
        </div>

        {error && (
          <Alert type="error" title={error} showIcon />
        )}

        {isPending && (
          <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
            <Spin size="large" />
          </div>
        )}

        {!isPending && readings && (
          <ConsumptionChart readings={readings} />
        )}
      </Space>
    </div>
  );
}
