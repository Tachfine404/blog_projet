import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import getImageUrl from '../utils/imageUrl';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/posts/user');
      setPosts(response.data);
    } catch (error) {
      toast.error('Error fetching posts');
    }
  };

  const handleEditClick = (postId) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        toast.error('Error deleting post');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Posts
      </Typography>

      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={getImageUrl(post.image) || 'https://source.unsplash.com/random'}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.substring(0, 100)}...
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'inline-block',
                    mt: 1,
                    px: 1,
                    py: 0.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 1
                  }}
                >
                  {post.category?.title || 'Uncategorized'}
                </Typography>
              </CardContent>
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 1,
                  borderTop: 1,
                  borderColor: 'divider'
                }}
              >
                <IconButton
                  onClick={() => handleEditClick(post._id)}
                  color="primary"
                  aria-label={`edit post ${post.title}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeletePost(post._id)}
                  color="error"
                  aria-label={`delete post ${post.title}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserProfile;
