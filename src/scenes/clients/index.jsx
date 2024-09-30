import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {Box, Button, IconButton, MenuItem, Select, Tooltip, useTheme, } from "@mui/material";
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

const Clients = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const token = localStorage.getItem("token");
  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${environment.apiUrl}/client/getAllClient`,
        { headers }
      );
      const responseData = response.data;
      if (responseData.success) {
        const modifiedData = responseData.clients.map((item) => ({
          ...item,
          id: item._id, // Set id for DataGrid row key
        }));

        modifiedData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        setData(modifiedData);
      } else {
        console.error("Failed to fetch clients:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        ["Client ID", "Full Name", "Email", "Phone Number", "Client Status"],
      ],
      body: data.map(
        ({ _id, firstName, lastName, email, phoneNumber, clientStatus }) => [
          _id,
          `${firstName} ${lastName}`,
          email,
          phoneNumber,
          clientStatus,
        ]
      ),
    });
    doc.save("clients_data.pdf");
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this client!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .delete(environment.apiUrl + `/client/deleteClientById/${id}`, {
            headers,
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error("Failed to delete client");
            }

            setData(data.filter((item) => item.id !== id));
            Swal.fire("Deleted!", "The client has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting client:", error);
            Swal.fire(
              "Error!",
              "Failed to delete client. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status of this client?",
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
            environment.apiUrl + `/client/updateStatus/${id}`,
            { clientStatus: newStatus },
            { headers }
          )
          .then((response) => {
            console.log(response);
            if (response.status !== 200) {
              throw new Error("Failed to update status");
            }

            const updatedData = data.map((item) => {
              if (item.id === id) {
                return { ...item, clientStatus: newStatus };
              }
              return item;
            });
            setData(updatedData);
            Swal.fire(
              "Updated!",
              "The client status has been updated.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating client status:", error);
            Swal.fire(
              "Error!",
              "Failed to update client status. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  const handleEditClick = (id) => {};

  const columns = [
    { field: "id", headerName: "Client ID", flex: 1 },
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      renderCell: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "clientStatus",
      headerName: "Client Status",
      flex: 0.6,
      renderCell: (params) => (
        <Select
          value={params.row.clientStatus}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
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
            <Link to={`/clients/editClient/${params.row.id}`}>
              <IconButton>
                <EditIcon onClick={() => handleEditClick(params.row.id)} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="View">
            <Link to={`/clients/viewClient/${params.row.id}`}>
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
        <Header title="Clients Management" subtitle="Managing the clients" />
        <Box>
          <Link to={"/clients/newClient"} style={{ marginRight: "10px" }}>
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
              Add a Client
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
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Clients;
