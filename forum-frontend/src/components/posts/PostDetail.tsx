import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Post } from '../../types';
import { getPost, updatePost, deletePost } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../comments/CommentSection';
import { formatDistanceToNow } from 'date-fns';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    try {
      const response = await getPost(parseInt(id));
      setPost(response.data);
      setEditFormData({
        title: response.data.title,
        content: response.data.content,
      });
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!post) return;
    try {
      await updatePost(post.id, editFormData);
      fetchPost();
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (window.confirm('Are you sure you want to delete this post? All comments will also be deleted.')) {
      try {
        await deletePost(post.id);
        navigate(`/topics/${post.topic_id}`);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Typography>Post not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Topics
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(`/topics/${post.topic_id}`)}
        sx={{ mb: 2 }}
      >
        Back to Topic
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>
          {user && user.id === post.user_id && (
            <Box>
              <IconButton onClick={() => setOpenEditDialog(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeletePost}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        
        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary">
          Posted by {post.user?.username || 'Unknown'} • {formatDistanceToNow(new Date(post.created_at))} ago
          {post.created_at !== post.updated_at && ' (edited)'}
        </Typography>
      </Paper>

      <CommentSection postId={post.id} />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={6}
            value={editFormData.content}
            onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdatePost} 
            variant="contained"
            disabled={!editFormData.title || !editFormData.content}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostDetail;