import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Collapse,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { updateComment, deleteComment } from '../../services/api';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: Comment;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
  onReplyCreated: () => void;
  depth?: number;
}

const CommentComponent: React.FC<CommentProps> = ({
  comment,
  onCommentUpdated,
  onCommentDeleted,
  onReplyCreated,
  depth = 0,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(comment.content);

  const handleUpdate = async () => {
    try {
      await updateComment(comment.id, { content: editContent });
      setIsEditing(false);
      onCommentUpdated();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onCommentDeleted();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleReplyCreated = () => {
    setIsReplying(false);
    onReplyCreated();
  };

  const canModify = user && user.id === comment.user_id;

  return (
    <Box 
      sx={{ 
        ml: depth * 4,
        mb: 2,
      }}
    >
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2,
          bgcolor: depth > 0 ? 'grey.50' : 'white',
        }}
      >
        {/* Comment Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="primary">
            {comment.user?.username || 'Unknown User'}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              • {formatDistanceToNow(new Date(comment.created_at))} ago
              {comment.created_at !== comment.updated_at && ' (edited)'}
            </Typography>
          </Typography>
          
          {canModify && (
            <Box>
              <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Comment Content or Edit Form */}
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              size="small"
            />
            <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
              <Button size="small" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleUpdate}
                disabled={!editContent.trim()}
              >
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
            {comment.content}
          </Typography>
        )}

        {/* Reply Button */}
        {!isEditing && user && (
          <Button
            size="small"
            startIcon={<ReplyIcon />}
            onClick={() => setIsReplying(!isReplying)}
            sx={{ mt: 1 }}
          >
            Reply
          </Button>
        )}

        {/* Reply Form */}
        {isReplying && (
          <Box mt={2}>
            <CommentForm
              postId={comment.post_id}
              parentId={comment.id}
              onCommentCreated={handleReplyCreated}
              onCancel={() => setIsReplying(false)}
            />
          </Box>
        )}
      </Paper>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <Collapse in={true}>
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              onReplyCreated={onReplyCreated}
              depth={depth + 1}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default CommentComponent;