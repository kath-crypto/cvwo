import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Box, Button } from "@mui/material";
import { getTopics, createTopic, updateTopic, deleteTopic } from "../../services/api";
import { Topic } from "../../types";
import TopicForm from "./TopicForm";

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await getTopics();
      setTopics(res.data);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: { title: string; description: string }) => {
    try {
      if (editingTopic) {
        const res = await updateTopic(editingTopic.id, data);
        setTopics(topics.map((t) => (t.id === editingTopic.id ? res.data : t)));
      } else {
        const res = await createTopic(data);
        setTopics([...topics, res.data]);
      }
    } catch (err) {
      console.error("Failed to save topic:", err);
    } finally {
      setFormOpen(false);
      setEditingTopic(null);
    }
  };

  const openEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await deleteTopic(id);
      setTopics(topics.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete topic:", err);
    }
  };

  if (loading) return <Typography>Loading topics...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Topics</Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Create Topic
        </Button>
      </Box>

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
              sx={{ p: 3, cursor: "pointer", "&:hover": { boxShadow: 6 }, position: "relative" }}
              onClick={() => navigate(`/topics/${topic.id}`)}
            >
              <Typography variant="h6">{topic.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {topic.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created by {topic.user?.username || "Unknown"} • {topic.post_count || 0} posts
              </Typography>

              {/* Edit & Delete Buttons */}
              <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(topic);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(topic.id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Topic Form Dialog */}
      <TopicForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={handleFormSubmit}
        editingTopic={editingTopic}
      />
    </Box>
  );
};

export default TopicList;