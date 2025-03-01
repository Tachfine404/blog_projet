import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Posts', icon: <ArticleIcon />, path: '/admin/posts' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Comments', icon: <CommentIcon />, path: '/admin/comments' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Admin Menu
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  component={Link}
                  to={item.path}
                  key={item.text}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(106, 27, 154, 0.12)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(106, 27, 154, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminLayout;
