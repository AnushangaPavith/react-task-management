import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Header from "./Header";

const EditNoteDialog = ({ open, handleClose, handleAddNote, editNote, setEditNote }) => {
  if (!editNote) return null; // Return null if editNote is not set

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: 1000,
      }}
    >
      <DialogTitle>
        <Header title="Update Note" subtitle="" />
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
          value={editNote.title} // Use editNote instead of newNote
          onChange={(e) => setEditNote({ ...editNote, title: e.target.value })} // Update editNote
          InputProps={{
            sx: {
              fontWeight: "bold", // Make text bold
              fontSize: "1.1rem", // Increase font size
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
          value={editNote.description} // Use editNote instead of newNote
          onChange={(e) => setEditNote({ ...editNote, description: e.target.value })} // Update editNote
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "grey",
            color: "white",
            marginRight: 1,
            marginBottom: 2,
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "darkgrey",
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
          Update Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNoteDialog;
