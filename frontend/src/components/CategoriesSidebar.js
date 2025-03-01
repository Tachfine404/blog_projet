import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const CategoryTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  fontSize: '1.2rem',
  padding: '16px 0',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  marginBottom: '16px'
}));

const CategoryItem = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: '#E6E6E6',
  borderRadius: '4px',
  marginBottom: '8px',
  padding: '10px 16px',
  color: theme.palette.primary.main,
  position: 'relative',
  paddingLeft: '24px',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%'
  },
  '&:hover': {
    backgroundColor: '#D9D9D9',
  }
}));

const CategoriesSidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{ p: 2, width: '100%', maxWidth: 300 }}>
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
    </Box>
  );
};

export default CategoriesSidebar;
