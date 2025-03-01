import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Link,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      const postsWithData = await Promise.all(
        response.data.map(async (post) => {
          const commentsRes = await axios.get(`/comments/post/${post._id}`);
          return {
            ...post,
            commentsCount: commentsRes?.data?.length || 0
          };
        })
      );
      setPosts(postsWithData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    }
  };

  const handleDelete = async (postId) => {
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Posts Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Author</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell align="center">
                    <Link
                      component="button"
                      variant="body1"
                      onClick={() => navigate(`/posts/${post._id}`)}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{post.author?.username || 'Unknown'}</TableCell>
                  <TableCell align="center">{post.category?.title || 'Uncategorized'}</TableCell>
                  <TableCell align="center">{post.commentsCount}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(post._id)}
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
    </Container>
  );
};

export default AdminPosts;
