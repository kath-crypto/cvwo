import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Box } from "@mui/material";
import { getTopic } from "../../services/api";
import { Topic } from "../../types";
import PostList from "../posts/PostList";

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const res = await getTopic(Number(id));
      setTopic(res.data);
    } catch (error) {
      console.error("Failed to fetch topic:", error);
    }
  };

  if (!topic) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      
      {/* Topic Info */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {topic.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {topic.description}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created by {topic.user?.username}
        </Typography>
      </Paper>

      {/* Posts under Topic */}
      <PostList topicId={topic.id} />

    </Container>
  );
};

export default TopicDetail;