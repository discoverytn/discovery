import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useAuth } from '../AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AnalyticsOverview from './AnalyticsOverview';
import WebsiteVisitors from './WebsiteVisitors';
import PostsByUserType from './PostsByUserType';
import MostFavoritePosts from './MostFavoritePosts';
import UpcomingEvents from './UpcomingEvents';
import UsersView from './UsersView';
import PostsView from './PostsView';
import RequestsView from "./RequestsView"
import EventsView from './EventsView';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a1929',
      paper: '#101C2C',
    },
  },
});

function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { logout } = useAuth();

  const changeView = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <>
            <AnalyticsOverview />
            <Box sx={{ display: 'flex', mt: 3 }}>
              <WebsiteVisitors />
              <PostsByUserType />
            </Box>
            <Box sx={{ display: 'flex', mt: 3 }}>
              <MostFavoritePosts />
              <UpcomingEvents />
            </Box>
          </>
        );
      case 'users':
        return <UsersView />;
      case 'posts':
        return <PostsView />;
        case 'requests':
        return <RequestsView />;
        case 'events':
        return <EventsView />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#0a1929' }}>
        <Sidebar onChangeView={changeView} onLogout={logout} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
            {renderView()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;