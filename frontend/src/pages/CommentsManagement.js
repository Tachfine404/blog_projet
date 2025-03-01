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
  Chip,
  Link as MuiLink,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/admin/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(`/admin/comments/${commentId}`);
      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Comments Management
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Author</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Post</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {comment.author?.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <MuiLink
                      component={Link}
                      to={`/posts/${comment.post?._id}`}
                      sx={{
                        maxWidth: 200,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {comment.post?.title}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/posts/${comment.post?._id}`}
                      color="primary"
                      title="View post"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteComment(comment._id)}
                      color="error"
                      title="Delete comment"
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

export default CommentsManagement;
