import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan1', tasks: 0 },
  { name: 'Jan8', tasks: 120 },
  { name: 'Jan16', tasks: 130 },
  { name: 'Jan24', tasks: 290 },
  { name: 'Jan31', tasks: 100 },
  { name: 'Feb1', tasks: 230 },
  { name: 'Feb8', tasks: 190 },
  { name: 'Feb16', tasks: 240 },
  { name: 'Feb24', tasks: 90 },
];

function CompletedTasksChart() {
  return (
    <Box sx={{ flexBasis: '50%', pl: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Completed tasks over time</Typography>
      <Paper sx={{ p: 2, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default CompletedTasksChart;