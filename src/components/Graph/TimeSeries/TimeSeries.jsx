import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TimeSeries = ({ data, dataKey }) => {
  if (
    !data ||
    !data.response ||
    !data.response.result ||
    !data.response.result.data
  ) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        <p>No valid data available for rendering the chart.</p>
      </div>
    );
  }

  const chartData = {
    labels:
      dataKey === "timestamps"
        ? data.response.result.data.map(
            (item) =>
              `Height: ${item.block_height}\n${new Date(
                item.timestamp
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`
          )
        : data.response.result.data.map((item) =>
            new Date(item.block_timestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          ),
    datasets: [
      {
        label:
          dataKey === "timestamps"
            ? "Block Height & Timestamps"
            : dataKey === "balance_delta"
            ? "Balance Deltas"
            : "balance",
        data:
          dataKey === "timestamps"
            ? data.response.result.data.map((item) => item.block_height)
            : data.response.result.data.map((item) => item[dataKey]),
        borderColor: "#FFCC00",
        backgroundColor: "rgba(255, 204, 0, 0.5)",
        borderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Time Series Chart - ${
          dataKey === "timestamps"
            ? "Timestamps"
            : dataKey === "balance_delta"
            ? "Balance Deltas"
            : "Balance"
        }`,
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (dataKey === "timestamps") {
              return `Block Height: ${context.raw}`;
            }
            return `Value: ${(context.raw / 1_000_000_000).toFixed(2)}B`; // Show in billions for balance tracking
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            dataKey === "timestamps"
              ? "Block Height and Timestamp"
              : "Block Timestamp",
          font: {
            size: 12,
          },
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: dataKey === "timestamps" ? "Block Height" : "Value (Billions)",
          font: {
            size: 12,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: (value) => {
            if (dataKey === "timestamps") return value;
            return `${(value / 1_000_000_000).toFixed(1)}B`; // Shorten values to billions for balance tracking
          },
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        height: "500px",
        border: "1px solid #000000",
        borderRadius: "4px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <h3 style={{ margin: 0 }}>No Chart Data</h3>
      )}
    </div>
  );
};

export default TimeSeries;