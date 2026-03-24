"use client";

import { ConfigProvider, theme } from "antd";
import type { ReactNode } from "react";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        // darkAlgorithm shifts all of Ant Design's default token values to
        // dark equivalents - we then override specific tokens to match brand colours.
        algorithm: theme.darkAlgorithm,
        token: {
          // colorPrimary must be a raw hex value - Ant Design derives an entire
          // palette from it (hover, active, alpha variants etc.) using JS colour
          // manipulation, so CSS vars don't work here. All other tokens are used
          // as-is by the browser so CSS vars resolve fine for those.
          colorPrimary: "#ca4a05",
          colorBgBase: "var(--color-main-bg)",
          colorText: "var(--color-main-text)",
          colorBorder: "var(--color-main-border)",
          colorBgContainer: "var(--color-main-surface-1)",
          colorBgElevated: "var(--color-main-surface-2)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
