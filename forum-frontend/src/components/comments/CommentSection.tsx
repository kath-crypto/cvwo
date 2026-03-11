import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { Comment } from '../../types';
import { getComments } from '../../services/api';
import CommentComponent from './Comment';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = () => {
    fetchComments();
  };

  const handleCommentUpdated = () => {
    fetchComments();
  };

  const handleCommentDeleted = () => {
    fetchComments();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      
      <CommentForm 
        postId={postId} 
        onCommentCreated={handleCommentCreated}
      />

      <Divider sx={{ my: 3 }} />

      <Box>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
              onReplyCreated={handleCommentCreated}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default CommentSection;