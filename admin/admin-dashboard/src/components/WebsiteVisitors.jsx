import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#8B5CF6", "#EC4899"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function WebsiteVisitors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const explorersResponse = await axios.get(
          "http://192.168.100.3:3000/admin/explorer"

        );
        console.log("Explorers response:", explorersResponse);

        const businessResponse = await axios.get(
          "http://192.168.100.3:3000/admin/business"

        );
        console.log("Business response:", businessResponse);

        const newData = [
          { name: "Explorers", value: explorersResponse.data.length },
          { name: "Business Owners", value: businessResponse.data.length },
        ];

        console.log("Processed data:", newData);
        setData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error details:", error);
        setError(`Failed to fetch data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (data.length === 0) return <Typography>No data available</Typography>;

  return (
    <Box sx={{ flexBasis: "50%", pr: 2 }}>
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6">Website Visitors</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              formatter={(value, entry, index) => (
                <span style={{ color: COLORS[index % COLORS.length] }}>
                  {value} ({data[index].value.toLocaleString()})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default WebsiteVisitors;
