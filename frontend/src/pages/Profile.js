import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import getImageUrl from '../utils/imageUrl';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState(3); // Nombre initial de posts à afficher

  // Charger les posts dès le montage du composant
  useEffect(() => {
    fetchUserPosts();
  }, []); // Exécuté une seule fois au montage

  // Mettre à jour les données utilisateur quand user change
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      // Mise à jour de la photo de profil
      const profilePicUrl = user.profilePicture ? getImageUrl(user.profilePicture) : '';
      console.log('Profile picture URL:', profilePicUrl);
      setProfilePicturePreview(profilePicUrl);
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('/posts/user');
      setPosts(response.data);
      console.log('Posts récupérés:', response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      const previewUrl = URL.createObjectURL(file);
      console.log('New profile picture preview:', previewUrl);
      setProfilePicturePreview(previewUrl);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile update response:', response.data);
      
      // Mise à jour de l'URL de la photo de profil
      if (response.data.profilePicture) {
        const newProfilePicUrl = getImageUrl(response.data.profilePicture);
        console.log('New profile picture URL after update:', newProfilePicUrl);
        setProfilePicturePreview(newProfilePicUrl);
      }
      
      updateUser(response.data);
      setOpenEdit(false);
      toast.success('Profile updated successfully');
      fetchUserPosts();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await axios.delete('/users/profile');
        toast.success('Profile deleted successfully');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to delete profile');
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const loadMorePosts = () => {
    setDisplayedPosts(prev => prev + 3); // Augmente de 3 posts à chaque clic
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Profile Info */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Avatar
            src={profilePicturePreview || ''}
            sx={{
              width: 150,
              height: 150,
              mb: 2
            }}
          >
            {username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {username}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {email}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
            {bio || 'Welcome to my profile'}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenEdit(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </Button>
          </Box>
        </Box>

        {/* Publications */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Mes Publications
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {posts.slice(0, displayedPosts).map((post) => (
              <Grid item xs={12} sm={10} key={post._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {post.image && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(post.image)}
                      alt={post.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 100)}...` 
                        : post.content}
                    </Typography>
                    {post.category && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'inline-block',
                          mt: 1,
                          px: 1,
                          py: 0.5,
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: 1
                        }}
                      >
                        {post.category.title}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      component={Link}
                      to={`/posts/${post._id}/edit`}
                      color="primary"
                      aria-label="edit post"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePost(post._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {displayedPosts < posts.length && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={loadMorePosts}
                  >
                    Voir plus
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le profil</DialogTitle>
        <form onSubmit={handleEditProfile}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              type="email"
            />
            <TextField
              fullWidth
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
            <input
              accept="image/*"
              type="file"
              id="profile-picture-dialog"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-picture-dialog">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mt: 2 }}
              >
                Changer la photo de profil
              </Button>
            </label>
            {profilePicturePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={profilePicturePreview}
                  alt="Aperçu du profil"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile;
