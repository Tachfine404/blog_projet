import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, Container } from '@mui/material';

import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import SinglePost from './pages/SinglePost';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import AdminComments from './pages/AdminComments';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserProfile from './pages/UserProfile';
import CategoryView from './pages/CategoryView';
import CategoryPosts from './pages/CategoryPosts';
import PostView from './pages/PostView';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, mt: 8, mb: 2 }}>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/my-posts" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
                <Route path="/posts/:id" element={<SinglePost />} />
                <Route path="/post/:id" element={<PostView />} />
                <Route path="/posts/:id/edit" element={<PrivateRoute><EditPost /></PrivateRoute>} />
                <Route path="/category/:id" element={<CategoryView />} />
                <Route path="/categories/:category" element={<CategoryPosts />} />
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="posts" element={<AdminPosts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="comments" element={<AdminComments />} />
                </Route>
              </Routes>
            </Container>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
