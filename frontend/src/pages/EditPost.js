import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import getImageUrl from '../utils/imageUrl';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      const post = response.data;
      console.log('Fetched post:', post);
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        categoryId: post.category?._id || '',
        image: post.image || null
      });
      setImagePreview(post.image ? getImageUrl(post.image) : null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error.response || error);
      toast.error('Error fetching post');
      navigate('/my-posts');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.response || error);
      toast.error('Error fetching categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending data to server');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.categoryId) {
      data.append('categoryId', formData.categoryId);
    }
    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`/posts/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response.data);
      toast.success('Post updated successfully');
      navigate('/my-posts');
    } catch (error) {
      console.error('Error updating post:', error.response || error);
      toast.error('Error updating post');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            name="content"
            label="Content"
            fullWidth
            multiline
            rows={6}
            value={formData.content}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleInputChange}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                Upload Image
              </Button>
            </label>
          </Box>
          
          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 3, maxWidth: 300 }}>
              <img 
                src={imagePreview} 
                alt="Post preview" 
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' }
                }}
                onClick={handleRemoveImage}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/my-posts')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Post
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPost;
