import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import axios from "axios";
import { environment } from "../../../environment";
import {jwtDecode} from "jwt-decode";

function ViewJob() {
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

  const token = localStorage.getItem("token");

  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState({
    jobName: "",
    description: "",
    client: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address : ""
    },
    assignedStaff: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    orgNoOfhours: "",
    orgHourRate: "",
    orgTotal: "",
    staffPayTotal: "",
    estNoOfhours: "",
    staffHourRate: "",
    staffExtraHours: "",
    staffExtraPayment: "",
    taskStartTime: "",
    jobStatus: "",
    notes: "",
    type: "",
    days: [],
    startDate: "",
  });

  const fieldNames = {
    jobName: "Job Name",
    description: "Description",
    orgNoOfhours: "Original Number of Hours",
    orgHourRate: "Original Hour Rate",
    orgTotal: "Original Total",
    staffPayTotal: "Staff Pay Total",
    estNoOfhours: "No. of Hours per staff",
    staffHourRate: "Staff Hour Rate",
    staffExtraHours: "Staff Extra Hours",
    staffExtraPayment: "Staff Extra Payment",
    taskStartTime: "Task Start Time",
    jobStatus: "Job Status",
    notes: "Notes",
    client: "Client",
    assignedStaff: "Assigned Staff",
    startDate: "Start Date",
    type: "Type",
    days: "Days"
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${environment.apiUrl}/super/getTaskById/${id}`,
        { headers }
      );

      const responseData = response.data;
      console.log(responseData);

      if (response.status === 200) {
        const { 
          jobName, description, client, assignedStaff, 
          orgNoOfhours, orgHourRate, orgTotal, 
          estNoOfhours, staffHourRate, staffPayTotal, taskStartTime, 
          notes, type, days, startDate 
        } = responseData;

        const formattedClient = {
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
          address: client.address,
        };
        const formattedAssignedStaff = {
          firstName: assignedStaff.firstName,
          lastName: assignedStaff.lastName,
          phoneNumber: assignedStaff.phoneNumber,
        };

        const formattedStartDate = new Date(startDate).toISOString().split('T')[0]; // Format date to yyyy-MM-dd
        
        setJobDetails({
          jobName,
          description,
          client: formattedClient,
          assignedStaff: formattedAssignedStaff,
          orgNoOfhours,
          orgHourRate,
          orgTotal,
          estNoOfhours,
          staffHourRate,
          staffPayTotal,
          taskStartTime,
          notes,
          type,
          days,
          startDate: formattedStartDate,
        });
      } else {
        console.error("Failed to fetch job details:");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  return (
    <Box m="20px" height="85vh" overflow="auto" paddingRight="20px">
      <Header title={`View Job ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(jobDetails)
            .filter(([field]) => field !== "client" && field !== "assignedStaff")
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={1.8}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {fieldNames[field]}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9.2}>
                  <Typography>
                    {field === "days" && Array.isArray(value)
                      ? value.join(", ") // Join the days with commas
                      : value}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
          {/* Client Details */}
          <Grid item xs={1.8}>
            <Typography variant="h5" component="span" fontWeight="bold">
              {fieldNames.client}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" component="span" fontWeight="bold">
              :
            </Typography>
          </Grid>
          <Grid item xs={9.2}>
            <Typography>{`${jobDetails.client.firstName} ${jobDetails.client.lastName}`}</Typography>
            <Typography>{`Phone Number: ${jobDetails.client.phoneNumber}`}</Typography>
            <Typography>{`Address: ${jobDetails.client.address}`}</Typography>
          </Grid>
          {/* Assigned Staff Details */}
          <Grid item xs={1.8}>
            <Typography variant="h5" component="span" fontWeight="bold">
              {fieldNames.assignedStaff}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h5" component="span" fontWeight="bold">
              :
            </Typography>
          </Grid>
          <Grid item xs={9.2}>
            <Typography>{`${jobDetails.assignedStaff.firstName} ${jobDetails.assignedStaff.lastName}`}</Typography>
            <Typography>{`Phone Number: ${jobDetails.assignedStaff.phoneNumber}`}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewJob;
