import { Box, Button, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { environment } from "../../environment";
import NotesGrid from "../../components/NotesGrid";
import AddNoteDialog from "../../components/AddNoteDialog"; // Import the AddNoteDialog component
import EditNoteDialog from "../../components/EditNoteDialog"; // Import the EditNoteDialog component

const Notes = () => {
  const [data, setData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); // State for Edit Dialog
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
  });
  const [editNote, setEditNote] = useState(null); // State for currently edited note

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const auth = localStorage.getItem("auth");

  const fetchNotes = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-user-hash": auth,
      };

      const response = await axios.get(
        `${environment.apiUrl}/note/getAllNotes`,
        { headers }
      );
      const responseData = response.data;
      if (responseData.success) {
        const modifiedData = responseData.notes.map((item) => ({
          ...item,
          id: item._id, // Set id for DataGrid row key
        }));

        modifiedData.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        setData(modifiedData);
      } else {
        console.error("Failed to fetch notes:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenAddNote = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddNote = () => {
    setOpenAddDialog(false);
    setNewNote({ title: "", description: "" }); // Reset the input fields
  };

  const handleAddNote = async () => {
    if (!newNote.title || !newNote.description) {
      Swal.fire({
        title: "Error",
        text: "Both title and description are required.",
        icon: "error",
        willOpen: () => {
          Swal.getPopup().style.zIndex = "3000";
        },
      });
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-user-hash": auth,
      };

      const response = await axios.post(
        `${environment.apiUrl}/note/addNote`,
        { noteTitle: newNote.title, noteDescription: newNote.description },
        { headers }
      );
      const responseData = response.data;
      if (responseData.success) {
        fetchNotes(); // Refresh the notes list
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Note added successfully",
          willOpen: () => {
            Swal.getPopup().style.zIndex = "3000";
          },
        });
        handleCloseAddNote(); // Close the dialog after adding the note
      } else {
        Swal.fire({
          title: "Error",
          text: responseData.message,
          icon: "error",
          willOpen: () => {
            Swal.getPopup().style.zIndex = "3000";
          },
        });
        console.error("Failed to add note:", responseData.message);
      }
    } catch (error) {
      console.error("Error adding note:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the note.",
        icon: "error",
        willOpen: () => {
          Swal.getPopup().style.zIndex = "3000";
        },
      });
    }
  };

  const handleOpenEditNote = (note) => {
    setEditNote(note);
    setEditNote({
      title: note.noteTitle,
      description: note.noteDescription,
      _id: note._id,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditNote = () => {
    setOpenEditDialog(false);
    setEditNote(null);
  };

  const handleEditNote = async () => {
    if (!editNote.title || !editNote.description) {
      Swal.fire("Error", "Both title and description are required.", "error");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-user-hash": auth,
      };

      const response = await axios.put(
        `${environment.apiUrl}/note/updateNote/${editNote._id}`,
        { noteTitle: editNote.title, noteDescription: editNote.description },
        { headers }
      );
      const responseData = response.data;
      if (responseData.success) {
        fetchNotes(); // Refresh the notes list
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Note updated successfully",
        });
        handleCloseEditNote();
      } else {
        Swal.fire("Error", responseData.message, "error");
        console.error("Failed to edit note:", responseData.message);
      }
    } catch (error) {
      console.error("Error editing note:", error);
      Swal.fire("Error", "An error occurred while editing the note.", "error");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "x-user-hash": auth,
      };

      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this note!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${environment.apiUrl}/note/deleteNoteById/${id}`, {
              headers,
            })
            .then((response) => {
              if (response.status !== 200)
                throw new Error("Failed to delete note");
              setData(data.filter((item) => item.id !== id));
              Swal.fire("Deleted!", "The note has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Error deleting note:", error);
              Swal.fire(
                "Error!",
                "Failed to delete note. Please try again later.",
                "error"
              );
            });
        }
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="-10px"
      >
        <Header title="Notes" />
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6870fa",
              color: "white",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#3e4396",
              },
            }}
            onClick={handleOpenAddNote}
          >
            Add Note
          </Button>
        </Box>
      </Box>
      <Box m="10px 0 0 0">
        <NotesGrid
          notes={data}
          onDelete={handleDeleteClick}
          onEdit={handleOpenEditNote} // Pass the new handleOpenEditNote function
        />
      </Box>

      {/* Use the AddNoteDialog component */}
      <AddNoteDialog
        open={openAddDialog}
        handleClose={handleCloseAddNote}
        handleAddNote={handleAddNote}
        newNote={newNote}
        setNewNote={setNewNote}
      />

      {/* Use the EditNoteDialog component */}
      <EditNoteDialog
        open={openEditDialog}
        handleClose={handleCloseEditNote}
        handleAddNote={handleEditNote} // Reuse this function for editing
        editNote={editNote}
        setEditNote={setEditNote}
      />
    </Box>
  );
};

export default Notes;
