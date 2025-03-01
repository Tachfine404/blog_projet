import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  styled,
  Button,
  Paper
} from '@mui/material';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';

const CategoryLink = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  mb: 2,
  color: theme.palette.primary.main,
  fontWeight: 600
}));

const CategoryItem = styled(ListItemButton)(({ theme }) => ({
  py: 1,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState(6);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadMorePosts = () => {
    setDisplayedPosts(prev => prev + 6);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={10}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Latest Posts
          </Typography>
          <Grid container spacing={3}>
            {posts.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="textSecondary">
                    Aucune publication disponible
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <>
                {posts.slice(0, displayedPosts).map((post) => (
                  <Grid item xs={12} key={post._id}>
                    <Card 
                      component={Link} 
                      to={`/posts/${post._id}`}
                      sx={{ 
                        textDecoration: 'none',
                        display: 'flex',
                        height: '250px',
                        mb: 2,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          transition: 'transform 0.2s ease-in-out',
                          boxShadow: 3
                        }
                      }}
                    >
                      {post.image && (
                        <CardMedia
                          component="img"
                          sx={{ width: 300, objectFit: 'cover' }}
                          image={getImageUrl(post.image)}
                          alt={post.title}
                        />
                      )}
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={getImageUrl(post.author?.profilePicture)}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                {post.author?.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="h5" color="text.primary" gutterBottom>
                            {post.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {post.content}
                          </Typography>
                          {post.category && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'inline-block',
                                mt: 2,
                                px: 1.5,
                                py: 0.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 1,
                                fontSize: '0.75rem'
                              }}
                            >
                              {post.category.title}
                            </Typography>
                          )}
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
                {displayedPosts < posts.length && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
                      <Button 
                        variant="outlined" 
                        onClick={loadMorePosts}
                        sx={{ 
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Voir plus
                      </Button>
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={2}>
          <Paper sx={{ p: 2 }}>
            <CategoryTitle>CATEGORIES</CategoryTitle>
            <List sx={{ p: 0 }}>
              {categories.map((category) => (
                <ListItem key={category._id} sx={{ p: 0, mb: 1 }}>
                  <CategoryItem
                    component={Link}
                    to={`/category/${category._id}`}
                    sx={{ width: '100%' }}
                  >
                    {category.title}
                  </CategoryItem>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
