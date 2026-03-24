import { ReactNode } from "react";
import type { Metadata } from "next";

import { DashboardProvider } from "@/context/DashboardContext";
import HighchartsTheme from "@/components/HighchartsTheme";
import AntdProvider from "@/components/AntdProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Consumption Dashboard",
  description: "Half-hourly energy usage with temperature and anomaly detection",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HighchartsTheme />
        <AntdProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
