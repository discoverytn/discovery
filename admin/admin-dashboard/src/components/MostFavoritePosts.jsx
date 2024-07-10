import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function MostFavoritePosts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/top5`);
        const formattedData = response.data.map(post => ({
          name: post.title,
          favorites: post.averageRating
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching most favorite posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ flexBasis: "50%", pl: 2 }}>
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6">Most Rated Posts</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="favorites" fill="#00ccaa" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default MostFavoritePosts;