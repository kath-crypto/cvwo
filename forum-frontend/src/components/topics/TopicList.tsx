import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { getTopics } from '../../services/api';
import { Topic } from '../../types';

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await getTopics();
      setTopics(res.data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading topics...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Topics
      </Typography>
      <Grid container spacing={3}>
        {topics.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              No topics yet.
            </Typography>
          </Grid>
        )}
        {topics.map((topic) => (
          <Grid item xs={12} md={6} key={topic.id}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                '&:hover': { boxShadow: 6 },
              }}
              onClick={() => navigate(`/topics/${topic.id}`)}
            >
              <Typography variant="h6">{topic.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {topic.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created by {topic.user?.username || 'Unknown'} • {topic.post_count || 0} posts
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopicList;