"use client";

import Highcharts from "highcharts/highstock";

// No UI - this component exists solely to apply the Highcharts global theme
// once at the top of the tree. Kept here rather than in layout.tsx because
// layout is a server component and Highcharts is browser-only.
Highcharts.setOptions({
  chart: {
    backgroundColor: "#1f2024",
    style: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  },
  title: { style: { color: "var(--color-main-text)" } },
  xAxis: {
    gridLineColor: "var(--color-chart-gridline)",
    lineColor: "var(--color-chart-gridline)",
    tickColor: "var(--color-chart-gridline)",
    labels: { style: { color: "var(--color-main-text-muted)" } },
    title: { style: { color: "var(--color-main-text-muted)" } },
  },
  yAxis: {
    gridLineColor: "var(--color-chart-gridline)",
    labels: { style: { color: "var(--color-main-text-muted)" } },
    title: { style: { color: "var(--color-main-text-muted)" } },
  },
  navigator: {
    maskFill: "rgba(222,138,92,0.15)",
    series: { color: "var(--color-chart-consumption)" },
    xAxis: { gridLineColor: "var(--color-chart-gridline)" },
  },
  rangeSelector: {
    buttonTheme: {
      fill: "var(--color-chart-button-bg)",
      stroke: "var(--color-chart-button-bg)",
      style: { color: "var(--color-main-text)" },
      states: {
        hover: { fill: "var(--color-chart-accent-300)", style: { color: "var(--color-main-text)" } },
        select: { fill: "var(--color-chart-accent-500)", style: { color: "var(--color-main-text)" } },
      },
    },
    inputStyle: { backgroundColor: "var(--color-main-bg)", color: "var(--color-main-text)" },
    labelStyle: { color: "var(--color-chart-accent-500)" },
  },
  tooltip: {
    backgroundColor: "var(--color-chart-tooltip-bg)",
    borderColor: "var(--color-chart-tooltip-border)",
    style: { color: "var(--color-main-text)" },
  },
  scrollbar: {
    barBackgroundColor: "var(--color-chart-tooltip-bg)",
    barBorderColor: "var(--color-chart-tooltip-border)",
    buttonBackgroundColor: "var(--color-chart-tooltip-bg)",
    buttonBorderColor: "var(--color-chart-tooltip-border)",
    rifleColor: "var(--color-chart-tooltip-border)",
    trackBackgroundColor: "var(--color-chart-scrollbar-track-bg)",
    trackBorderColor: "var(--color-chart-scrollbar-track-border)",
  },
});

export default function HighchartsTheme() {
  return null;
}
