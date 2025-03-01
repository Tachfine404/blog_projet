import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import axios from '../utils/axios';
import getImageUrl from '../utils/imageUrl';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: 'Action', color: '#FF4081' },
    { name: 'Study', color: '#7C4DFF' },
    { name: 'Cars', color: '#00BCD4' },
    { name: 'Comedy', color: '#FFC107' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Latest Posts
      </Typography>

      {/* Categories */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category.name}
            label={category.name}
            onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
            sx={{
              backgroundColor: selectedCategory === category.name ? category.color : 'transparent',
              color: selectedCategory === category.name ? 'white' : 'inherit',
              border: `1px solid ${category.color}`,
              '&:hover': {
                backgroundColor: category.color,
                color: 'white',
              },
            }}
          />
        ))}
      </Box>

      {/* Posts Grid */}
      <Grid container spacing={4}>
        {filteredPosts.map((post) => (
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
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(post.image) || 'https://source.unsplash.com/random'}
                  alt={post.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.content.substring(0, 150)}...
                  </Typography>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      backgroundColor: categories.find(c => c.name === post.category)?.color || '#757575',
                      color: 'white',
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogPosts;
