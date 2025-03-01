import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Avatar,
  Grid,
} from '@mui/material';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to fetch post');
    }
  };

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{post.author?.username?.[0]?.toUpperCase()}</Avatar>
          <Box>
            <Typography variant="subtitle1">
              {post.author?.username || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {post.image && (
          <Box sx={{ mb: 3 }}>
            <img
              src={post.image}
              alt={post.title}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
            />
          </Box>
        )}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Category: {post.category?.title || 'Uncategorized'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostView;
