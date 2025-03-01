import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
} from '@mui/material';
import { format } from 'date-fns';
import getImageUrl from '../utils/imageUrl';
import PostDetail from './PostDetail';

const Post = ({ post }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleOpenDetail = () => {
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  return (
    <>
      <Card sx={{ maxWidth: '100%', mb: 4 }}>
        {post.image && (
          <CardMedia
            component="img"
            height="300"
            image={getImageUrl(post.image)}
            alt={post.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h6" gutterBottom>
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
          <Typography variant="body2" color="text.secondary">
            {expanded ? post.content : post.content.slice(0, 150)}
            {post.content.length > 150 && !expanded && '...'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            {post.content.length > 150 && (
              <Button 
                size="small" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            )}
            <Button 
              size="small" 
              variant="contained" 
              onClick={handleOpenDetail}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDetail}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      >
        <PostDetail post={post} onUpdate={handleCloseDetail} />
      </Dialog>
    </>
  );
};

export default Post;
