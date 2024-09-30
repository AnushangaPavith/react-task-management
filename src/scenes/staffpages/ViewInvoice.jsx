import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { environment } from '../../environment';

const ViewStaffInvoice = () => {
  const { id } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    sendDate: "",
    staff: {
      firstName: "",
      lastName: "",
    },
    amount: "",
    invoiceStatus: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/invoice/getInvoiceById/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
          }
      });
      const responseData = response.data;
      if (responseData.success) {
        const { invoice } = responseData;
        const { invoiceTitle, invoiceDescription, sendDate, staff, amount, invoiceStatus, notes } = invoice;
        const formattedStaff = {
          firstName: staff.firstName,
          lastName: staff.lastName,
        };
        setInvoiceDetails({
          invoiceTitle,
          invoiceDescription,
          sendDate: new Date(sendDate).toISOString().split('T')[0],
          staff: formattedStaff,
          amount,
          invoiceStatus,
          notes
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
            .filter(([field]) => field !== "staff") // Filter out nested objects
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
          {/* Staff Details */}
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewStaffInvoice;
