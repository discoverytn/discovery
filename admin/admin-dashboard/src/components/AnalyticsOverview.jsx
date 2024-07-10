import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import BusinessIcon from "@mui/icons-material/Business";
import PostAddIcon from "@mui/icons-material/PostAdd";
import EventIcon from "@mui/icons-material/Event";

const overviewItems = [
  { title: "Explorers", value: "", icon: ExploreIcon, color: "#8B5CF6" },
  { title: "Business Owners", value: "", icon: BusinessIcon, color: "#EC4899" },
  { title: "Posts", value: "", icon: PostAddIcon, color: "#EC4899" },
  { title: "Events", value: "", icon: EventIcon, color: "#10B981" },
];

function AnalyticsOverview() {
  const [explorersCount, setExplorersCount] = useState("");
  const [businessOwnersCount, setBusinessOwnersCount] = useState("");
  const [postsCount, setPostsCount] = useState("");
  const [eventsCount, setEventsCount] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const explorerResponse = await fetch(
          "http://192.168.26.72:3000/admin/explorer"
        );
        const explorersData = await explorerResponse.json();
        setExplorersCount(explorersData.length);

        const businessResponse = await fetch(
          "http://192.168.26.72:3000/admin/business"
        );
        const businessData = await businessResponse.json();
        setBusinessOwnersCount(businessData.length);

        const postsResponse = await fetch(
          "http://192.168.26.72:3000/posts/allposts"
        );
        const postsData = await postsResponse.json();
        setPostsCount(postsData.length);

        const eventsResponse = await fetch(
          "http://192.168.26.72:3000/events/getAll"
        );
        const eventsData = await eventsResponse.json();
        setEventsCount(eventsData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  overviewItems[0].value = explorersCount.toLocaleString();
  overviewItems[1].value = businessOwnersCount.toLocaleString();
  overviewItems[2].value = postsCount.toLocaleString();
  overviewItems[3].value = eventsCount.toLocaleString();

  return (
    <Grid container spacing={3}>
      {overviewItems.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.title}>
          <Paper sx={{ p: 2, bgcolor: "#101C2C" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <item.icon sx={{ color: item.color, mr: 1 }} />
              <Typography variant="subtitle2">{item.title}</Typography>
            </Box>
            <Typography variant="h4">{item.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default AnalyticsOverview;
