import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import getImageUrl from '../utils/imageUrl';
import { format } from 'date-fns';

const PostDetail = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, [post._id]);

  useEffect(() => {
    setIsLiked(likes.some(like => like.user === user?._id));
  }, [likes, user]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/posts/${post._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`/posts/${post._id}/likes`);
      setLikes(response.data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(`/posts/${post._id}/comments`, { content: comment });
      setComment('');
      fetchComments();
      onUpdate();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.delete(`/posts/${post._id}/likes`);
      } else {
        await axios.post(`/posts/${post._id}/likes`);
      }
      fetchLikes();
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  return (
    <Card sx={{ maxWidth: '100%', mb: 4 }}>
      {post.image && (
        <CardMedia
          component="img"
          height="400"
          image={getImageUrl(post.image)}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={getImageUrl(post.author?.profilePicture)} />
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle2">
              {post.author?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likes.length} {likes.length === 1 ? 'like' : 'likes'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>

        <Box component="form" onSubmit={handleComment} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  endIcon={<SendIcon />}
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              ),
            }}
          />
        </Box>

        <List>
          {comments.map((comment) => (
            <ListItem key={comment._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={getImageUrl(comment.author?.profilePicture)} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                      {comment.author?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                }
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PostDetail;
