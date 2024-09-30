import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem, Select, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { environment } from "../../environment";

const ClientJobs = () => {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPayments, setTotalPayments] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClientJobs();
  }, [id]);

  const fetchClientJobs = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let url = environment.apiUrl + `/job/getFilteredJobs/${id}`
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await axios.get(url, { headers });
      const responseData = response.data;
      if (responseData.success) {
        setJobs(responseData.jobs);
        console.log(jobs);
        calculateTotalPayments(responseData.jobs);
      } else {
        console.error("Failed to fetch client jobs:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching client jobs:", error);
    }
  };

  const handleViewJobs = () => {
    fetchClientJobs();
  };

  const calculateTotalPayments = (jobs) => {
    const total = jobs.reduce((sum, job) => sum + (job.payment || 0), 0);
    setTotalPayments(total);
  };

  const columns = [
    { field: "_id", headerName: "Job ID", flex: 1 },
    { field: "jobName", headerName: "Job Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "jobStatus", headerName: "Status", flex: 1 },
    { field: "startTime", headerName: "Start Time", flex: 1 },
    { field: "isSignOff", headerName: "Signed Off", flex: 1, renderCell: (params) => (params.value ? "Yes" : "No") },
    { field: "noOfhours", headerName: "Hours", flex: 1 },
    { field: "hourRate", headerName: "Rate", flex: 1 },
    { field: "payment", headerName: "Payment", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Client Jobs" subtitle={`Jobs for Client ID: ${id}`} />
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" gap="10px">
        <Box display="flex" alignItems="center" gap="10px">
          <Box>
            <Typography fontWeight="bold" fontSize="16px">From</Typography>
            <Box >
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                name="startTime"
              />
            </Box>
          </Box>
          <Box>
            <Typography fontWeight="bold" fontSize="16px">To</Typography>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                name="endTime"
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={handleViewJobs}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
            disabled={(!startDate && endDate) || (startDate && !endDate)}
          >
            View Jobs
          </Button>
        </Box>
        <Box>
          <Typography fontWeight="bold" fontSize="16px">Total Payments: ${totalPayments}</Typography>
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
          rows={jobs}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default ClientJobs;
