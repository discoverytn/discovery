import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function MostFavoritePosts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.19:3000/posts/top5"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching most favorite posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ mt: 3, width: "100%" }}>
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Most Favorite Posts
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="numOfFavorites"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default MostFavoritePosts;
