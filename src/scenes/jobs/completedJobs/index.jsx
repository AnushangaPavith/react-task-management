import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import { tokens } from "../../../theme";
import { environment } from "../../../environment.js";

const CompletedJobs = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchCompletedJobs = async () => {
    try {
      const response = await axios.get(
        environment.apiUrl + "/job/getAllCompletedJobs"
      );

      const responseData = response.data;
      if (responseData.success) {
        const modifiedData = responseData.jobs.map((item) => ({
          ...item,
          startTime: item.startTime ? item.startTime.split("T")[0] : "N/A",
          id: item._id, // Set id for DataGrid row key
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

  const columns = [
    { field: "id", headerName: "Job ID" },
    { field: "jobName", headerName: "Job Name", flex: 1 },
    {
      field: "client",
      headerName: "Client",
      flex: 0.8,
      renderCell: (params) =>
        `${params.row.client.firstName} ${params.row.client.lastName}`,
    },
    {
      field: "assignedStaff",
      headerName: "Assigned Staff",
      flex: 0.8,
      renderCell: (params) => {
        const { assignedStaff } = params.row;
        return assignedStaff
          ? `${assignedStaff.firstName} ${assignedStaff.lastName}`
          : "Not Assigned"; // Fallback text if assignedStaff is null or undefined
      },
    },
    { field: "jobDate", headerName: "Start Time (YYYY/MM/DD)", flex: 1 },
    { field: "orgNoOfhours", headerName: "Original No of Hours", flex: 0.6 },
    { field: "orgHourRate", headerName: "Original Hour Rate", flex: 0.6 },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/jobs/viewjob/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
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
        <Header title="Completed Jobs" subtitle="List of all completed jobs" />
      </Box>
      {/* <Box display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          onClick={exportToPdf}
          sx={{
            backgroundColor: "#4caf50",
            color: "white",
            fontSize: "10px",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Export as PDF
        </Button>
      </Box> */}
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

export default CompletedJobs;
