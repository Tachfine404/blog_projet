import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Create as CreateIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Left side */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          BLOG
        </Typography>

        {/* Center */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>

          {user && (
            <Button
              component={Link}
              to="/create-post"
              color="inherit"
              startIcon={<CreateIcon />}
            >
              Create Post
            </Button>
          )}

          {user && user.role === 'admin' && (
            <Button
              component={Link}
              to="/admin"
              color="inherit"
              startIcon={<DashboardIcon />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Dashboard
            </Button>
          )}
        </Box>

        {/* Right side */}
        <Box>
          {user ? (
            <>
              <IconButton onClick={handleProfileClick}>
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                  src={user.profilePicture ? getImageUrl(user.profilePicture) : ''}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem component={Link} to="/profile">
                  <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                color="inherit"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
