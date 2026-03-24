"use client";

import { Switch, InputNumber, Space, Typography } from "antd";
import { useDashboard } from "@/context/DashboardContext";

const { Text } = Typography;

export default function DelayToggle() {
  const { delayEnabled, setDelayEnabled, delayMs, setDelayMs } = useDashboard();

  return (
    <Space align="center">
      <Switch
        checked={delayEnabled}
        onChange={setDelayEnabled}
        checkedChildren="Delay on"
        unCheckedChildren="Delay off"
      />
      {delayEnabled && (
        <>
          <InputNumber
            min={500}
            max={90000}
            step={500}
            value={delayMs}
            onChange={(v) => v && setDelayMs(v)}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Simulating large dataset load
          </Text>
        </>
      )}
    </Space>
  );
}
