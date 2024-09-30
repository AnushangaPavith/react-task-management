import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { environment } from "../../environment";
import { Link } from "react-router-dom";

const ViewAdmin = () => {
  const { id } = useParams();
  const [adminDetails, setAdminDetails] = useState({
    firstName: "",
    lastName: "",
    position: "",
    userName: '',
    email: '',
    Status: "",
  });

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);
  
  const token = localStorage.getItem("token")

  const fetchAdminDetails = async () => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
          };
      const response = await axios.get(environment.apiUrl+`/user/getUser/${id}`, { headers });
      const responseData = response.data.userDetails;
      if (responseData) {
        const userdata = responseData;
        const adminData = responseData.adminDetails
        setAdminDetails({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          position: adminData.position,
          userName: userdata.userName,
          email: userdata.email,
          Status: userdata.status,
        });
        
      } else {
        console.error("Failed to fetch admin details:");
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View admin ID: ${id}`} subtitle="" />

      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(adminDetails)
            .filter(([field]) => field !== "createdAt" && field !== "__v" && field !== "updatedAt" && field !== "user") // Filter out nested objects
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={3}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {field}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>{value}</Typography>
                </Grid>
              </React.Fragment>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewAdmin;
