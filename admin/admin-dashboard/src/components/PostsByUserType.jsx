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
function PostsByUserType() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessPostsResponse = await axios.get(
          `${API_URL}/posts/business/posts`
        );
        const explorerPostsResponse = await axios.get(
          `${API_URL}/posts/explorer/posts`
        );

        const businessPosts = businessPostsResponse.data.length;
        const explorerPosts = explorerPostsResponse.data.length;

        setData([
          { name: "Business Owners", posts: businessPosts },
          { name: "Explorers", posts: explorerPosts },
        ]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ flexBasis: "50%", pl: 2 }}>
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6">Posts by User Type</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="posts" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default PostsByUserType;
