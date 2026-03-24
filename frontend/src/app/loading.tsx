"use client";

import { Skeleton, Space } from "antd";

export default function Loading() {
  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </Space>
    </div>
  );
}
