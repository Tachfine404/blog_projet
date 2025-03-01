import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Category as CategoryIcon,
  Create as CreateIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';
import { styled } from '@mui/material/styles';
import axios from '../utils/axios';

const drawerWidth = 180;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiAvatar-root': {
    width: 64,
    height: 64,
    marginBottom: theme.spacing(1),
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'block',
  padding: 0,
  '& .MuiListItemButton-root': {
    minHeight: 48,
    justifyContent: 'initial',
    px: 2.5,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: theme.spacing(2),
  },
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <UserInfo>
        <Avatar
          src={user?.profilePicture ? getImageUrl(user.profilePicture) : null}
          alt={user?.username || 'User'}
        />
        <Typography variant="subtitle1">{user?.username}</Typography>
      </UserInfo>

      <List>
        <StyledListItem>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </StyledListItem>

        <StyledListItem>
          <ListItemButton component={Link} to="/create">
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary="Create Post" />
          </ListItemButton>
        </StyledListItem>

        <StyledListItem>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </StyledListItem>

        {user?.isAdmin && (
          <StyledListItem>
            <ListItemButton component={Link} to="/admin">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </StyledListItem>
        )}
      </List>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ px: 2, py: 1 }}
          >
            Categories
          </Typography>
          {categories.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No categories"
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ) : (
            categories.map((category) => (
              <StyledListItem key={category._id}>
                <ListItemButton component={Link} to={`/category/${category._id}`}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={category.title}
                    secondary={`${category.postCount || 0} posts`}
                  />
                </ListItemButton>
              </StyledListItem>
            ))
          )}
        </List>
      </Box>

      <Divider />

      <List>
        <StyledListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </StyledListItem>
      </List>
    </Box>
  );

  return (
    <>
      <MuiDrawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </MuiDrawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
