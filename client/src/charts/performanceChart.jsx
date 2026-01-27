import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PerformanceChart = ({ data, loading }) => {
  if (loading) return <p>Loading performance...</p>;
  if (!Array.isArray(data) || data.length === 0)
    return <p>No performance data yet</p>;

  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString(),
    completion: d.completionRate,
  }));

  return (
    <div>
      <h3>Consistency Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completion"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
