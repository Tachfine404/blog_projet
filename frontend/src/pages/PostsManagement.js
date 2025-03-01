import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import getImageUrl from '../utils/imageUrl';

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      const postsWithComments = await Promise.all(
        response.data.map(async (post) => {
          const commentsRes = await axios.get(`/comments/post/${post._id}`);
          return {
            ...post,
            commentsCount: commentsRes.data.length
          };
        })
      );
      setPosts(postsWithComments);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`/posts/${postId}`);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Posts Management
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <Avatar
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author?.username}</TableCell>
                  <TableCell>
                    <Chip 
                      label={post.category?.title || 'Uncategorized'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{post.commentsCount || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/posts/${post._id}`}
                      color="primary"
                      title="View post"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePost(post._id)}
                      color="error"
                      title="Delete post"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PostsManagement;
