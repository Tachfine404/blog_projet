import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  CardMedia,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';

const CategoryView = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategoryAndPosts();
  }, [id]);

  const fetchCategoryAndPosts = async () => {
    try {
      const [categoryRes, postsRes] = await Promise.all([
        axios.get(`/categories/${id}`),
        axios.get(`/posts/category/${id}`)
      ]);
      setCategory(categoryRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {category?.title || 'Category Posts'}
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card 
              component={Link} 
              to={`/posts/${post._id}`}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                }
              }}
            >
              {post.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(post.image)}
                  alt={post.title}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={getImageUrl(post.author?.profilePicture)}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    by {post.author?.username}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.substring(0, 100)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryView;
