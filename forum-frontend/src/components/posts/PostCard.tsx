import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {post.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.content}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={post.user?.username || 'Unknown'} 
              size="small" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(post.created_at))} ago
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CommentIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {post.comment_count}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;