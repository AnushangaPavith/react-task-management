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

const StaffJobs = () => {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPayments, setTotalPayments] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStaffJobs();
  }, [id]);

  const fetchStaffJobs = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let url = environment.apiUrl + `/job/getStaffJobsbyId/${id}`
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await axios.get(url, { headers });
      const responseData = response.data;
      if (responseData.success) {
        setJobs(responseData.jobs);
        calculateTotalPayments(responseData.jobs);
      } else {
        console.error("Failed to fetch staff jobs:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching staff jobs:", error);
    }
  };

  const calculateTotalPayments = (jobs) => {
    const total = jobs.reduce((sum, job) => sum + (job.payment || 0), 0);
    setTotalPayments(total);
  };

  const handlePaymentStatusChange = async (jobId, status) => {
    try {
      const response = await axios.put(environment.apiUrl + `/job/paymentJob`, { jobId, paymentStatus: status });
      const responseData = response.data;
      if (responseData.success) {
        fetchStaffJobs(); // Refresh jobs after updating payment status
        Swal.fire("Success", "Payment status updated successfully", "success");
      } else {
        console.error("Failed to update payment status:", responseData.message);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleViewJobs = () => {
    fetchStaffJobs();
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
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handlePaymentStatusChange(params.row._id, e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Staff Jobs" subtitle={`Jobs for Staff ID: ${id}`} />
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px" gap="10px">
        <Box display="flex" alignItems="center" gap="10px">
          <Box>
            <Typography fontWeight="bold" fontSize="16px">From</Typography>
            <Box>
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

export default StaffJobs;
