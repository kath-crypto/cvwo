import React, { useState } from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { createComment } from '../../services/api';

interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onCommentCreated: () => void;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  postId, 
  parentId = null, 
  onCommentCreated,
  onCancel 
}) => {
  const { user, loading: authLoading } = useAuth(); // get loading from AuthContext
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wait for AuthContext to initialize
    if (authLoading) return;

    if (!user) {
      // User not logged in, stop posting
      setError('You must be logged in to comment.');
      return;
    }

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createComment({
        content: content.trim(),
        post_id: postId,
        parent_id: parentId,
      });

      setContent('');
      onCommentCreated();

      if (onCancel) onCancel();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        mb: parentId ? 2 : 3,
        ml: parentId ? 4 : 0,
        bgcolor: parentId ? 'grey.50' : 'white'
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={parentId ? 2 : 3}
          placeholder={parentId ? "Write a reply..." : "Write a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading || authLoading}
          error={!!error}
          helperText={error}
          variant="outlined"
          size="small"
        />
        
        <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
          {onCancel && (
            <Button size="small" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit"
            size="small"
            variant="contained"
            disabled={loading || authLoading || !content.trim()}
          >
            {loading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CommentForm;