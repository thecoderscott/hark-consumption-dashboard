"use client";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { animationTimings } from "@/constants/chart/animationTimings";

import type { DashboardReading } from "@/lib/types";

type Props = {
  readings: DashboardReading[];
};

export default function ConsumptionChart({ readings }: Props) {
  const timestamps = readings.map((r) => new Date(r.timestamp).getTime());
  const consumption = readings.map((r) => r.consumption);
  const temperature = readings.map((r) => r.averageTemperature);

  // Anomaly points rendered as a separate scatter series so they stand out
  // visually without interrupting the main consumption line.
  const anomalyPoints = readings
    .filter((r) => r.isAnomaly)
    .map((r) => ({
      x: new Date(r.timestamp).getTime(),
      y: r.consumption,
    }));

  const options: Highcharts.Options = {
    chart: {
      animation: {
        duration: animationTimings.chart,
        easing: "easeOutQuart",
      },
      height: "60%",
      zooming: { type: "x" },
    },
    title: {
      text: "Half-Hourly Energy Consumption",
    },
    rangeSelector: {
      selected: 4, // default to "All" on load
      buttons: [
        { type: "day", count: 1, text: "1d" },
        { type: "day", count: 3, text: "3d" },
        { type: "all", text: "All" },
      ],
    },
    navigator: {
      enabled: true,
    },
    xAxis: {
      type: "datetime",
      title: { text: "Time" },
    },
    yAxis: [
      {
        title: { text: "Consumption (kWh)" },
        opposite: false,
      },
      {
        title: { text: "Temperature (°C)" },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      xDateFormat: "%d %b %Y %H:%M",
    },
    series: [
      {
        type: "line",
        name: "Consumption",
        data: timestamps.map((t, i) => [t, consumption[i]]),
        yAxis: 0,
        color: "var(--color-chart-consumption)",
        animation: { duration: animationTimings.consumption },
      },
      {
        type: "line",
        name: "Temperature",
        data: timestamps.map((t, i) => [t, temperature[i]]),
        yAxis: 1,
        color: "var(--color-chart-temp)",
        dashStyle: "ShortDash",
        animation: { duration: animationTimings.temperature },
      },
      {
        type: "scatter",
        name: "Anomaly",
        data: anomalyPoints,
        yAxis: 0,
        color: "var(--color-chart-anomaly)",
        marker: {
          symbol: "circle",
          radius: 4,
          lineWidth: 2,
          lineColor: "var(--color-chart-anomaly)",
        },
        animation: {
          duration: animationTimings.consumption,
        },
        tooltip: {
          pointFormat: "<b>Anomaly</b><br/>Consumption: {point.y:.2f} kWh",
        },
      },
    ],
    credits: { enabled: false },
  };

  // Key derived from first timestamp - forces a full remount when new data
  // arrives, which also replays the draw animation on each fresh load.
  // constructorType="stockChart" activates the range selector and navigator.
  return (
    <HighchartsReact
      key={readings[0]?.timestamp}
      highcharts={Highcharts}
      constructorType="stockChart"
      options={options}
    />
  );
}
