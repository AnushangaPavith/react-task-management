import React from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  colors,
  Typography
} from "@mui/material";
import Header from "./Header";

const AddNoteDialog = ({
  open,
  handleClose,
  handleAddNote,
  newNote,
  setNewNote,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
        zIndex: 1000,
      }}>
      <DialogTitle>
        <Header title="Add a New Note" subtitle="" />
      </DialogTitle>

      <DialogContent>
        <Typography fontWeight="bold" fontSize="16px">
            Title
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          variant="filled"
          type="text"
          fullWidth
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          InputProps={{
            sx: {
              fontWeight: 'bold', // Make text bold
              fontSize: '1.1rem', // Increase font size
            },
          }}
        />
        <Typography fontWeight="bold" fontSize="16px">
            Description
        </Typography>
        <TextField
          margin="dense"
          variant="filled"
          type="text"
          fullWidth
          multiline
          rows={6}
          value={newNote.description}
          onChange={(e) =>
            setNewNote({ ...newNote, description: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: colors.grey[700],
            color: "white",
            marginRight: 1,
            marginBottom: 2,
            fontSize: "16px",
            "&:hover": {
              backgroundColor: colors.grey[800],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddNote}
          variant="contained"
          sx={{
            backgroundColor: "#6870fa",
            color: "white",
            marginRight: 2,
            marginBottom: 2,
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#3e4396",
            },
          }}
        >
          Add Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNoteDialog;
