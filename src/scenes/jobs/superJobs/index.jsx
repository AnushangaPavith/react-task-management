import { Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header.jsx";
import { tokens } from "../../../theme.js";
import { environment } from "../../../environment.js";
import Swal from "sweetalert2";

const SuperJobs = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const token = localStorage.getItem("token");

  const fetchCompletedJobs = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${environment.apiUrl}/super/getAllSuperTasks`,
        { headers }
      );

      const responseData = response.data;

      if (response.status === 200) {
        const modifiedData = responseData.map((item) => ({
          ...item,
          // startTime: item.startTime ? item.startTime.split("T")[0] : "N/A",
          id: item._id,
        }));

        modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setData(modifiedData);
      } else {
        console.error("Failed to fetch completed jobs:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching completed jobs:", error);
    }
  };

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const handleEditClick = (id) => {};
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          Authorization: `Bearer ${token}`
        };
        axios
          .delete(environment.apiUrl + `/super/deleteTaskId/${id}`, { headers })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error("Failed to delete task");
            }

            setData(data.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "The task has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
            Swal.fire(
              "Error!",
              "Failed to delete task. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const columns = [
    { field: "jobName", headerName: "Job Name", flex: 1 },
    {
      field: "client",
      headerName: "Client",
      flex: 0.6,
      renderCell: (params) =>
        `${params.row.client.firstName} ${params.row.client.lastName}`,
    },
    {
      field: "assignedStaff",
      headerName: "Assigned Staff",
      flex: 0.6,
      renderCell: (params) =>
        `${params.row.assignedStaff.firstName} ${params.row.assignedStaff.lastName}`,
    },
    { field: "orgNoOfhours", headerName: "Original No of Hours", flex: 0.6 },
    { field: "orgHourRate", headerName: "Original Hour Rate", flex: 0.6 },
    { field: "estNoOfhours", headerName: "Staff Hours", flex: 0.6 },
    { field: "staffHourRate", headerName: "Staff Hour rate", flex: 0.6 },
    { field: "type", headerName: "Job Type", flex: 0.6 },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <Link to={`/superjobs/editjob/${params.row.id}`}>
              <IconButton>
                <EditIcon
                  onClick={() =>
                    handleEditClick(params.row.id, params.row.role)
                  }
                />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="View">
            <Link to={`/superjobs/viewjob/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="-10px"
      >
        <Header title="Super Jobs" subtitle="List of all super jobs" />
        <Box>
          <Link to={"/superjobs/newjob"} style={{ marginRight: "10px" }}>
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
            >
              Add a super Job
            </Button>
          </Link>
        </Box>
      </Box>
      <Box
        m="10px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "14px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default SuperJobs;
