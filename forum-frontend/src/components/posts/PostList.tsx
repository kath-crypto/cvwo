import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Post } from '../../types';
import { getPosts, createPost } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from './PostCard';

interface PostListProps {
  topicId: number;
}

const PostList: React.FC<PostListProps> = ({ topicId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, [topicId]);

  const fetchPosts = async () => {
    try {
      const res = await getPosts(topicId);
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await createPost({ ...formData, topic_id: topicId });
      fetchPosts();
      setOpenDialog(false);
      setFormData({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (loading) return <Typography>Loading posts...</Typography>;

  return (
    <Box>
      {/* Back Button */}
      <Box mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/topics/`)}
        >
          Back to Topic
        </Button>
      </Box>

      {/* Header with New Post Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Posts</Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            New Post
          </Button>
        )}
      </Box>

      {/* Post List */}
      <Grid container spacing={3}>
        {posts.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              No posts yet. Be the first to create one!
            </Typography>
          </Grid>
        )}
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />
          </Grid>
        ))}
      </Grid>

      {/* Create Post Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!formData.title || !formData.content}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostList;