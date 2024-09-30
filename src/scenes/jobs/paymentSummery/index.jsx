import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
  } from "@mui/icons-material";
  import EditIcon from "@mui/icons-material/Edit";
  import {
    Box,
    Button,
    IconButton,
    Tooltip,
    useTheme,
    Select,
    MenuItem,
    Typography,
    TextField,
  } from "@mui/material";
  import { DataGrid, GridToolbar } from "@mui/x-data-grid";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  import React, { useEffect, useRef, useState } from "react";
  import { Link } from "react-router-dom";
  import Swal from "sweetalert2";
  import axios from "axios";
  import Header from "../../../components/Header";
  import { tokens } from "../../../theme";
  import { jwtDecode } from "jwt-decode";
  import { environment } from "../../../environment.js";


  const Jobs = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const token = localStorage.getItem("token");
    const fetchAllRef = useRef(false);

    const [totalPayment, setTotalPayment] = useState(0);
    const [staffPayment, setStaffPayment] = useState(0);
    const [profit, setProfit] = useState(0);
    
    
  
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken._id; // Adjust according to your token structure
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
      return null;
    };

    const getUserRoleFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken.role; // Adjust according to your token structure
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
      return null;
    };
    const userRole = getUserRoleFromToken();
    const shouldShowButton = userRole !== "staff";
    const userStaff = userRole ==='staff'
  
    const userId = getUserIdFromToken();
    const formatTime = (dateTime) => {
      if (!dateTime) return null;
      const time = new Date(dateTime);
      return time.toLocaleTimeString("en-CA", { day:'2-digit',month:'2-digit',year:'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false, });
    };
  
    // const fetchJobs = async () => {
    //   try {
    //     let response;
    //     if (userRole === "staff") {
    //       response = await axios.get(environment.apiUrl + `/job/getJobsbyStaff/${userId}`);
    //     } else {
    //       response = await axios.get(environment.apiUrl + "/job/getAllJobs");
    //     }
  
    //     const responseData = response.data;
    //     if (responseData.success) {
          
    //       const modifiedData = responseData.jobs.map((item) => ({
    //         ...item,
    //         startTime: item.startTime.split("T")[0],
    //         signInTime:formatTime(item.signInTime),
    //         signOffTime:formatTime(item.signOffTime),
    //         id: item._id, // Set id for DataGrid row key
    //       }));
  
    //       modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
    //       setData(modifiedData);
    //     } else {
    //       console.error("Failed to fetch jobs:", responseData.message);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching jobs:", error);
    //   }
    // };

    const fetchJobs = async () => {
        try {
          if (fetchAllRef.current) { }
          let url;
          if (userRole === "staff") {
            url = environment.apiUrl + `/job/getJobsbyStaff/${userId}`;
          } else {
            url = environment.apiUrl + "/job/getAllJobs";
          }
    
          let params = new URLSearchParams();
          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);
          if (selectedStaff) params.append("staffId", selectedStaff);
          if (selectedClient) params.append("clientId", selectedClient);
    
          if (fetchAllRef.current) {
            params.delete('startDate');
            params.delete("endDate");
            params.delete("staffId");
            params.delete("clientId");
          }
    
          const response = await axios.get(url, { params });
          const responseData = response.data;
          console.log(responseData)
          if (responseData.success) {
            fetchAllRef.current = false;
            const modifiedData = responseData.jobs.map((item) => ({
              ...item,
              id: item._id,
              jobDate: formatTime(item.jobDate)
            }));
    
            modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            setData(modifiedData);
            calculateSummary(modifiedData);
          } else {
            fetchAllRef.current = false;
            console.error("Failed to fetch jobs:", responseData.message);
          }
        } catch (error) {
          fetchAllRef.current = false;
          console.error("Error fetching jobs:", error);
          if (error.response.data.message === 'Jobs not found') {
            setData([])
            calculateSummary([]);
          }
        }
      };

    const calculateSummary = (jobs) => {
        const totalPayment = jobs.reduce((acc, job) => acc + (job.orgTotal || 0), 0);
        const staffPayment = jobs.reduce((acc, job) => acc + (job.staffPayTotal || 0), 0);
        const profit = totalPayment - staffPayment;
        setTotalPayment(totalPayment);
        setStaffPayment(staffPayment);
        setProfit(profit);
      };
    const fetchStaffAndClients = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };
    
        const [staffResponse, clientResponse] = await Promise.all([
          axios.get(`${environment.apiUrl}/staff/getAllStaff`, { headers }),
          axios.get(`${environment.apiUrl}/client/getAllClient`, { headers })
        ]);
    
        const staffData = staffResponse.data.staffs.map((item) => ({
          ...item,
          id: item._id
        }));
        const clientData = clientResponse.data.clients.map((item) => ({
          ...item,
          id: item._id
        }));
    
        setStaff(staffData);
        setClients(clientData);
      } catch (error) {
        console.error("Error fetching staff or clients:", error);
      }
    };
    
  
  
    useEffect(() => {
      fetchJobs();
      if(shouldShowButton){
        fetchStaffAndClients();

      }
      
    }, []);
  
    const exportToPdf = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [["Job ID", "Job Name", "Client", "Assigned Staff", "Start Time"]],
        body: data.map(({ _id, jobName, client, assignedStaff, startTime }) => [
          _id,
          jobName,
          `${client.firstName} ${client.lastName} `,
          `${assignedStaff.firstName} ${assignedStaff.lastName}`,
          startTime,
        ]),
      });
      doc.save("jobs_data.pdf");
    };
  
    const handleStatusChange = async (id, newStatus) => {
      try {
        const response = await axios.patch(
          environment.apiUrl + `/job/updateStatus/${id}`,
          { jobStatus: newStatus }
        );
        if (response.data.success) {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, jobStatus: newStatus } : item
            )
          );
          Swal.fire("Updated!", "Job status has been updated.", "success");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error updating job status:", error);
        Swal.fire("Error!", "Failed to update job status. Please try again later.", "error");
      }
    };
  
    const handleDeleteClick = (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this job!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(environment.apiUrl + `/job/deleteJobById/${id}`)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error("Failed to delete job");
              }
  
              setData(data.filter((item) => item.id !== id));
              Swal.fire("Deleted!", "The job has been deleted.", "success");
              calculateSummary(data.filter((item) => item.id !== id));

            })
            .catch((error) => {
              console.error("Error deleting job:", error);
              Swal.fire("Error!", "Failed to delete job. Please try again later.", "error");
            });
        }
      });
    };
  
    const handleEditClick = (id) => { };

    const handleViewJobs = () => {
      fetchJobs();
    };

    const vievAlljobs = () =>{
      fetchAllRef.current = true;
      setEndDate('');
      setStartDate('');
      setSelectedClient('')
      setSelectedStaff('');
      fetchJobs();
    }
    
    
  let columns =[]
     columns = [
      { field: "id", headerName: "Job ID",hide: true },
      { field: "jobName", headerName: "Job Name", flex: 0.8 },
      {
        field: "client",
        headerName: "Client",
        flex: 0.7,
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
      {
        field: "jobDate",
        headerName: "Job Date",
        flex: 0.7,
      },
      // {
      //   field: "orgNoOfhours",
      //   headerName: "Original No Hours",
      //   flex: 0.5,
      // },
      {
        field: "estNoOfhours",
        headerName: "Estimate No Hours",
        flex: 0.5,
      },
      // {
      //   field: "orgTotal",
      //   headerName: "Total Payment",
      //   flex: 0.5,
      // },
      { field: "staffPayTotal", headerName: "Staff Payment", flex: 0.5 },
      {
        field: "jobStatus",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) => (
          <Select
            value={params.row.jobStatus}
            onChange={(e) => handleStatusChange(params.row.id,e.target.value)}
          >
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        ),
      },
      
    ];

    if (shouldShowButton) {
      columns.splice(5, 0, { field: "orgNoOfhours", headerName: "Original No Hours", flex: 0.5 });
      columns.splice(6, 0, { field: "orgTotal", headerName: "Total Payment", flex: 0.5 });
    }
    if (userStaff) {
      columns.splice(7, 0, { field: "staffPayTotal", headerName: "Staff Payment", flex: 0.5 });
    }
    
  
    return (
      <Box m="20px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="-10px"
        >
          <Header title="Jobs Payment Summery " subtitle="Managing the Payments" />
          
        </Box>
        {/* <Box
          display="flex"
          justifyContent="flex-start"
          marginTop="10px"
          marginBottom="20px"
        >
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
        
<Box display="flex" justifyContent="flex-start" alignItems="center" marginBottom="20px" gap="10px">
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
  {shouldShowButton && (
    <Box  display="flex" justifyContent="flex-start" alignItems="center" gap="10px">
      <Box>
        <Typography fontWeight="bold" fontSize="16px">Staff</Typography>
        <Select
          fullWidth
          style={{minWidth:'100px'}}
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          placeholder="Select Staff"
        >
          {staff.map((staff) => (
            <MenuItem key={staff.id} value={staff.id}>{staff.firstName} {staff.lastName}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        <Typography fontWeight="bold" fontSize="16px">Client</Typography>
        <Select
          fullWidth
          style={{minWidth:'100px'}}
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          placeholder="Select Client"
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>{client.firstName} {client.lastName}</MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  )}
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
    filter Jobs
  </Button>
  <Button
    variant="contained"
    onClick={vievAlljobs}
    sx={{
      backgroundColor: "#4caf50",
      color: "white",
      fontSize: "10px",
      "&:hover": {
        backgroundColor: "#388e3c",
      },
    }}
  >
    view All
  </Button>
  {/* <Button
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
  </Button> */}
</Box>

        <Box
          m="10px 0 0 0"
          height="55vh"
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
        <Typography variant="h4" gutterBottom>Total Payment: ${totalPayment}</Typography>
        <Typography variant="h4" gutterBottom>Staff Payment: ${staffPayment}</Typography>
        <Typography variant="h4" gutterBottom>Profit: ${profit}</Typography>
          <DataGrid
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    );
  };
  
  export default Jobs;
  