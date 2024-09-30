import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { environment } from "../../environment";

// Validation schema
const invoiceSchema = yup.object().shape({
  invoiceTitle: yup.string().required("Invoice Title is required"),
  invoiceDescription: yup.string(),
  staff: yup.string().required("Staff is required"),  // Ensure staff ID is included
  amount: yup.number().required("Amount is required").nullable(),
  sendDate: yup.date().required("Send Date is required").nullable(),
  notes: yup.string(),
});

const EditStaffInvoice = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    sendDate: "",
    staff: "",
    amount: "",
    notes: "",
    staffName: "",  // New field to store the staff name for display
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(
        environment.apiUrl + `/invoice/getInvoiceById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      if (responseData.success) {
        const invoice = responseData.invoice;
        // Format the sendDate to YYYY-MM-DD for the input field
        if (invoice.sendDate) {
          invoice.sendDate = new Date(invoice.sendDate)
            .toISOString()
            .split("T")[0];
        }

        setInvoiceDetails({
          invoiceTitle: invoice.invoiceTitle,
          invoiceDescription: invoice.invoiceDescription,
          sendDate: invoice.sendDate,
          staff: invoice.staff ? invoice.staff._id : "",  // Store staff ID
          staffName: invoice.staff ? `${invoice.staff.firstName} ${invoice.staff.lastName}` : "",  // Store staff name for display
          amount: invoice.amount,
          notes: invoice.notes || "",
        });
      } else {
        console.error("Failed to fetch invoice details:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const handleUpdateInvoice = async (values) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        environment.apiUrl + `/invoice/updateStaffInvoice/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setInvoiceDetails(values);
        setAlertSeverity("success");
        setAlertMessage("Invoice updated successfully");
        setTimeout(() => {
          navigate("/staffinvoice");
        }, 2000);
      } else {
        setAlertSeverity("error");
        setAlertMessage(`Failed to update invoice: ${response.data.message}`);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(`Error updating invoice: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="85vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Invoice ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Formik
          initialValues={invoiceDetails}
          validationSchema={invoiceSchema}
          enableReinitialize={true}
          onSubmit={handleUpdateInvoice}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Invoice Title */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Invoice Title:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="invoiceTitle"
                    value={values.invoiceTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.invoiceTitle && !!errors.invoiceTitle}
                    helperText={touched.invoiceTitle && errors.invoiceTitle}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                
                {/* Invoice Description */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Invoice Description:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="invoiceDescription"
                    value={values.invoiceDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.invoiceDescription && !!errors.invoiceDescription}
                    helperText={touched.invoiceDescription && errors.invoiceDescription}
                    multiline
                    rows={3}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                
                {/* Staff (Read-Only for Name) */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Staff:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="staffName"
                    value={invoiceDetails.staffName}  // Display staff name
                    InputProps={{ readOnly: true }}  // Make it read-only
                    sx={{ backgroundColor: "white" }}
                  />
                  {/* Hidden field to store staff ID */}
                  <input type="hidden" name="staff" value={values.staff} />
                </Grid>
                
                {/* Amount */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Amount:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onWheel={(e) => e.target.blur()}
                    error={touched.amount && !!errors.amount}
                    helperText={touched.amount && errors.amount}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>

                {/* Send Date */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Send Date:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    name="sendDate"
                    value={values.sendDate || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sendDate && !!errors.sendDate}
                    helperText={touched.sendDate && errors.sendDate}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                
                {/* Notes */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Notes:
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.notes && !!errors.notes}
                    helperText={touched.notes && errors.notes}
                    multiline
                    rows={3}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                
                {/* Update button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: "#6870fa",
                      color: "white",
                      marginRight: 2,
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#3e4396",
                      },
                    }}
                  >
                    {isLoading ? "Updating..." : "Update Invoice"}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
      {/* Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          sx={{ color: "#fff" }}
        >
          {alertSeverity === "success" ? "Success" : "Error"}
          {": "}
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EditStaffInvoice;
