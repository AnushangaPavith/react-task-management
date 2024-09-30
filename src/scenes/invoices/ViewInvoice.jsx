import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { environment } from '../../environment';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    sendDate: "",
    client: null,
    staff: null,
    amount: "",
    invoiceStatus: "",
    notes: "", // Added notes field here
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/invoice/getInvoiceById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = response.data;
      if (responseData.success) {
        const { invoice } = responseData;
        const { invoiceTitle, invoiceDescription, sendDate, client, staff, amount, invoiceStatus, notes } = invoice; // Added notes here

        setInvoiceDetails({
          invoiceTitle,
          invoiceDescription,
          sendDate: sendDate ? new Date(sendDate).toISOString().split('T')[0] : "", // Format date
          client: client ? {
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            email: client.email || "",
          } : null,
          staff: staff ? {
            firstName: staff.firstName || "",
            lastName: staff.lastName || "",
            email: staff.email || "",
          } : null,
          amount,
          invoiceStatus,
          notes: notes || "", // Ensure notes is set correctly
        });
      } else {
        console.error('Failed to fetch invoice details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Invoice ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Grid container spacing={2}>
          {Object.entries(invoiceDetails)
            .filter(([field]) => field !== "client" && field !== "staff") // Filter out nested objects
            .map(([field, value]) => (
              <React.Fragment key={field}>
                <Grid item xs={2}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    :
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>{value}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          {/* Client Details (conditionally render if client exists) */}
          {invoiceDetails.client && (
            <>
              <Grid item xs={2}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  Client
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{`${invoiceDetails.client.firstName} ${invoiceDetails.client.lastName}`}</Typography>
                {invoiceDetails.client.email && (
                  <Typography>{`Email: ${invoiceDetails.client.email}`}</Typography>
                )}
              </Grid>
            </>
          )}
          {/* Staff Details (conditionally render if staff exists) */}
          {invoiceDetails.staff && (
            <>
              <Grid item xs={2}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  Staff
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h5" component="span" fontWeight="bold">
                  :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{`${invoiceDetails.staff.firstName} ${invoiceDetails.staff.lastName}`}</Typography>
                {invoiceDetails.staff.email && (
                  <Typography>{`Email: ${invoiceDetails.staff.email}`}</Typography>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewInvoice;
