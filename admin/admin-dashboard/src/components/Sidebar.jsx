import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, InputBase } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import EmailIcon from '@mui/icons-material/Email';

function Sidebar({ onChangeView }) {
  const handleItemClick = (view) => {
    onChangeView(view);
  };

  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: '#101C2C', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LogoDevIcon sx={{ color: 'white', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Discovery TN
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <InputBase
          placeholder="Search..."
          sx={{ color: 'white', bgcolor: '#1E293B', p: 1, borderRadius: 1, width: '100%' }}
          startAdornment={<SearchIcon sx={{ mr: 1 }} />}
        />
      </Box>
      <List>
        {[
          { text: 'Dashboard', icon: DashboardIcon, view: 'dashboard' },
          { text: 'Users', icon: PeopleIcon, view: 'users' },
          { text: 'Posts', icon: PostAddIcon, view: 'posts' },
          { text: 'Events', icon: EventIcon, view: 'events' },
          { text: 'Requests', icon: EmailIcon, view: 'requests' }, // Added Requests view
        ].map((item, index) => (
          <ListItem button key={item.text} onClick={() => handleItemClick(item.view)}>
            <ListItemIcon sx={{ color: 'white' }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
