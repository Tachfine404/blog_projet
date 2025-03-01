import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import getImageUrl from '../utils/imageUrl';

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      try {
        const [categoryResponse, postsResponse] = await Promise.all([
          axios.get(`/categories/${categoryId}`),
          axios.get(`/categories/${categoryId}/posts`)
        ]);
        setCategory(categoryResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndPosts();
  }, [categoryId]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Category not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {category.title}
        </Typography>
        {posts.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No posts in this category yet
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {post.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(post.image)}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/posts/${post._id}`}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryPosts;
