import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { environment } from "../../environment";

const Invoices = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchInvoices = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let url = `${environment.apiUrl}/invoice/getAllInvoices`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await axios.get(url, { headers });
      const responseData = response.data;
      if (responseData.success) {
        let modifiedData = responseData.invoices.map((item) => ({
          ...item,
          id: item._id,
          clientName: item.client
            ? `${item.client.firstName} ${item.client.lastName}`
            : "",
          staffName: item.staff
            ? `${item.staff.firstName} ${item.staff.lastName}`
            : "",
        }));

        // Apply filter based on filterType
        if (filterType === "Client") {
          modifiedData = modifiedData.filter((item) => item.client);
        } else if (filterType === "Staff") {
          modifiedData = modifiedData.filter((item) => item.staff);
        }

        modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setData(modifiedData);
      } else {
        console.error("Failed to fetch invoices:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filterType, startDate, endDate]);

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Invoice ID",
          "Title",
          "Description",
          "Send Date",
          "Client Name",
          "Staff Name",
          "Amount",
          "Status",
        ],
      ],
      body: data.map(
        ({
          _id,
          invoiceTitle,
          invoiceDescription,
          sendDate,
          clientName,
          staffName,
          amount,
          invoiceStatus,
        }) => [
          _id,
          invoiceTitle,
          invoiceDescription,
          new Date(sendDate).toLocaleDateString(),
          clientName,
          staffName,
          amount,
          invoiceStatus,
        ]
      ),
    });
    doc.save("invoices_data.pdf");
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this invoice!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = { Authorization: `Bearer ${token}` };
        axios
          .delete(`${environment.apiUrl}/invoice/deleteInvoiceById/${id}`, {
            headers,
          })
          .then((response) => {
            if (response.status !== 200)
              throw new Error("Failed to delete invoice");
            setData(data.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "The invoice has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting invoice:", error);
            Swal.fire(
              "Error!",
              "Failed to delete invoice. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const handleEditClick = (id) => {
    // Implement the edit functionality
  };

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status of this invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        axios
          .patch(
            environment.apiUrl + `/invoice/updateStatus/${id}`,
            { invoiceStatus: newStatus },
            { headers }
          )
          .then((response) => {
            console.log(response);
            if (response.status !== 200) {
              throw new Error("Failed to update status");
            }

            const updatedData = data.map((item) => {
              if (item.id === id) {
                return { ...item, invoiceStatus: newStatus };
              }
              return item;
            });
            setData(updatedData);
            Swal.fire(
              "Updated!",
              "The invoice status has been updated.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating invoice status:", error);
            Swal.fire(
              "Error!",
              "Failed to update invoice status. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const handleViewInvoices = () => {
    console.log("view jobs");
    fetchInvoices();
  };

  const columns = [
    { field: "id", headerName: "Invoice ID", flex: 0.5 },
    { field: "invoiceTitle", headerName: "Title", flex: 0.6 },
    { field: "invoiceDescription", headerName: "Description", flex: 0.8 },
    {
      field: "sendDate",
      headerName: "Send Date",
      flex: 0.6,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "clientName", headerName: "Client Name", flex: 0.7 },
    { field: "staffName", headerName: "Staff Name", flex: 0.7 },
    { field: "amount", headerName: "Amount", flex: 0.6 },
    {
      field: "invoiceStatus",
      headerName: "Status",
      flex: 0.6,
      renderCell: (params) => (
        <Select
          value={params.row.invoiceStatus}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.6,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <Link to={`/invoices/editInvoice/${params.row.id}`}>
              <IconButton onClick={() => handleEditClick(params.row.id)}>
                <EditIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="View">
            <Link to={`/invoices/viewInvoice/${params.row.id}`}>
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
        <Header title="Invoices Management" subtitle="Managing the invoices" />
        <Box>
          <Link to={"/invoices/newInvoice"} style={{ marginRight: "10px" }}>
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
              Add an Invoice
            </Button>
          </Link>
        </Box>
      </Box>
      <Box
        m="10px 0 0 0"
        height="64vh"
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
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          marginBottom="20px"
          gap="10px"
        >
          <Box>
            <Typography fontWeight="bold" fontSize="16px">
              From
            </Typography>
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
            <Typography fontWeight="bold" fontSize="16px">
              To
            </Typography>
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
            onClick={handleViewInvoices}
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
            View Invoices
          </Button>
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
          <RadioGroup
            row // This makes the radio buttons appear horizontally
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ marginLeft: 2 }} // Add some margin to align with other buttons
          >
            <FormControlLabel value="All" control={<Radio />} label="All" />
            <FormControlLabel value="Client" control={<Radio />} label="Client" />
            <FormControlLabel value="Staff" control={<Radio />} label="Staff" />
          </RadioGroup>
        </Box>
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
