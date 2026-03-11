import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import { Topic } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
  editingTopic?: Topic | null;
}

const TopicForm: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editingTopic,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingTopic) {
      setFormData({
        title: editingTopic.title,
        description: editingTopic.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [editingTopic, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editingTopic ? "Edit Topic" : "Create Topic"}
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Title"
            fullWidth
            required
            margin="dense"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="dense"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={onClose}>Cancel</Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!formData.title}
          >
            {editingTopic ? "Update" : "Create"}
          </Button>

        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TopicForm;