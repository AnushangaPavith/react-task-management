import { Box } from "@mui/material";
import NoteCard from "./NoteCard"; // Import the NoteCard component

const NotesGrid = ({ notes, onDelete, onEdit }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: { xs: "center", sm: "space-between", md: "flex-start" },
        gap: "16px",
        padding: "20px",
      }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id} // Use unique key
          title={note.noteTitle}
          description={note.noteDescription}
          onEdit={() => onEdit(note)} // Correctly pass function to avoid immediate invocation
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </Box>
  );
};

export default NotesGrid;
