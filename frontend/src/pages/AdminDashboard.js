import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      posts: 0,
      comments: 0,
      categories: 0,
    },
    recent: {
      users: [],
      posts: [],
      comments: [],
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, count, color }) => (
    <Card sx={{ height: '100%', backgroundColor: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: color, mr: 1 }} />
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ textAlign: 'center' }}>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            title="Users"
            count={stats.counts.users}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ArticleIcon}
            title="Posts"
            count={stats.counts.posts}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CommentIcon}
            title="Comment"
            count={stats.counts.comments}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CategoryIcon}
            title="Categorie"
            count={stats.counts.categories}
            color="#9c27b0"
          />
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <List>
              {stats.recent.users.map((user) => (
                <ListItem key={user._id}>
                  <ListItemAvatar>
                    <Avatar src={user.profilePicture ? getImageUrl(user.profilePicture) : null}>
                      {user.username[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Posts
            </Typography>
            <List>
              {stats.recent.posts.map((post) => (
                <ListItem key={post._id}>
                  <ListItemText
                    primary={post.title}
                    secondary={`by ${post.author.username} - ${format(new Date(post.createdAt), 'MMM dd, yyyy')}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Comments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Comments
            </Typography>
            <List>
              {stats.recent.comments.map((comment) => (
                <ListItem key={comment._id}>
                  <ListItemAvatar>
                    <Avatar src={comment.author.profilePicture ? getImageUrl(comment.author.profilePicture) : null}>
                      {comment.author.username[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.content}
                    secondary={`by ${comment.author.username} on "${comment.post.title}" - ${format(new Date(comment.createdAt), 'MMM dd, yyyy')}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
