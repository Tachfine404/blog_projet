import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CardMedia,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import getImageUrl from '../utils/imageUrl';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`/posts/${id}`),
        axios.get(`/posts/${id}/comments`)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/posts/${id}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Post not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="action" />
          <Typography variant="subtitle1" color="text.secondary">
            {post.author?.username || 'Unknown'} | {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {post.image && (
          <CardMedia
            component="img"
            height="400"
            image={getImageUrl(post.image)}
            alt={post.title}
            sx={{ 
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3
            }}
          />
        )}

        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>
          
          {user && (
            <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Add Comment
              </Button>
            </Box>
          )}

          <List>
            {comments.map((comment) => (
              <ListItem
                key={comment._id}
                alignItems="flex-start"
                secondaryAction={
                  (user?._id === comment.author?._id || user?.role === 'admin') && (
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component="span" variant="subtitle2">
                      {comment.author?.username || 'Unknown'} |{' '}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  }
                  secondary={comment.content}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default SinglePost;
