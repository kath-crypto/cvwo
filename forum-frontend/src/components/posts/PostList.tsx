import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Post } from '../../types';
import { getPosts, createPost, updatePost, deletePost } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from './PostCard';
import PostForm from './PostForm';

interface PostListProps {
  topicId: number;
}

const PostList: React.FC<PostListProps> = ({ topicId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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

  const handleFormSubmit = async (data: { title: string; content: string }) => {
    try {
      if (editingPost) {
        const res = await updatePost(editingPost.id, data);
        setPosts(posts.map((p) => (p.id === editingPost.id ? res.data : p)));
      } else {
        const res = await createPost({ ...data, topic_id: topicId });
        setPosts([...posts, res.data]);
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setFormOpen(false);
      setEditingPost(null);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleDelete = async (post: Post) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post.id);
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) return <Typography>Loading posts...</Typography>;

  return (
    <Box>
      {/* Back to Topics Button */}
      <Box mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/topics')}
        >
          Back to Topics
        </Button>
      </Box>

      {/* Header with New Post Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Posts</Typography>
        {user && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
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
            {/* Edit/Delete Buttons */}
            {user && user.id === post.user_id && (
              <Box mt={1} display="flex" gap={1}>
                <Button size="small" variant="outlined" onClick={() => handleEdit(post)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(post)}>Delete</Button>
              </Box>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Post Form Dialog */}
      <PostForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleFormSubmit}
        editingPost={editingPost}
      />
    </Box>
  );
};

export default PostList;