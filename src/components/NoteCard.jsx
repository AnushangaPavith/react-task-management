import { Box, Typography, useTheme, Dialog, DialogTitle, DialogContent, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { tokens } from "../theme"; // Import theme tokens

const NoteCard = ({ title, description, onEdit, onDelete }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false); // State to handle modal open/close

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
          boxShadow: `0 2px 4px ${colors.grey[900]}`,
          padding: "16px",
          margin: "8px",
          width: { xs: "100%", sm: "45%", md: "30%" }, // Responsive width
          maxHeight: "200px", // Maximum height for the card
          display: "flex",
          flexDirection: "column", // Keep items in a single column
          alignItems: "flex-start", // Align items to the start
          cursor: "pointer", // Cursor pointer to indicate clickability
          transition: "transform 0.2s ease-in-out", // Optional hover effect
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
        onClick={handleOpen} // Open modal on click
      >
        {/* Title and Icons Container */}
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Typography
            variant="h5" // Use h5 variant
            sx={{
              color: colors.black[100],
              fontWeight: "bold", // Make the title bold
              whiteSpace: "nowrap", // Prevent text from wrapping
              overflow: "hidden", // Hide overflowing text
              textOverflow: "ellipsis", // Add ellipsis to truncated text
            }}
          >
            {title}
          </Typography>

          {/* Icons for Edit and Delete */}
          <Box>
            <Tooltip title="Edit">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  onEdit(); // Correctly call the onEdit function when clicked
                }}
                sx={{ color:colors.black[100] }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  onDelete();
                }}
                sx={{ color:colors.black[100] }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: colors.black[100],
            overflow: "hidden", // Hide overflowing text
            textOverflow: "ellipsis", // Add ellipsis to truncated text
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3, // Limit to 3 lines
            marginBottom: "8px", // Add some space at the bottom
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* Modal to display full description */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: colors.primary[400],
            color: colors.black[100],
            fontWeight: "bold",
            fontSize: "1.5rem", // Match the font size of variant h5
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: colors.primary[400],
            color: colors.black[100],
          }}
        >
          <Typography variant="body1">{description}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteCard;
