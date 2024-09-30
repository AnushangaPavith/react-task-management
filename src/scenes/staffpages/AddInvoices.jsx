import React, { useState, useEffect, useRef } from "react"; // Import useRef
import {
  Box,
  Button,
  MenuItem,
  Alert as MuiAlert,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import Header from "../../components/Header";
import { environment } from "../../environment";
import { jwtDecode } from "jwt-decode"; // Correct import

const AddStaffInvoice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [staffName, setStaffName] = useState("");
  const [initialValues, setInitialValues] = useState({
    invoiceTitle: "",
    invoiceDescription: "",
    staff: "",
    amount: "",
    sendDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const navigate = useNavigate();
  const setFieldValueRef = useRef(null); // Use ref to store setFieldValue function

  const token = localStorage.getItem("token");

  const getUserIdFromToken = () => {
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

  const userId = getUserIdFromToken();

  const fetchFullName = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let url = `${environment.apiUrl}/staff/getFullName/${userId}`;
      const response = await axios.get(url, { headers });

      if (response.data.success) {
        setStaffName(response.data.fullName);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch staff name");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching staff name:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to fetch staff name");
      setOpenSnackbar(true);
    }
  };

  // Fetch staff name when component mounts
  useEffect(() => {
    if (userId) {
      fetchFullName();
    }
  }, [userId]);

  // Set Formik field value when staffName is updated
  useEffect(() => {
    if (staffName && setFieldValueRef.current) {
      setFieldValueRef.current("staff", staffName); // Update the "Staff" field
    }
  }, [staffName]);

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        environment.apiUrl + "/invoice/addStaffInvoice",
        values,
        { headers }
      );
      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage("Invoice Added Successfully");
        setTimeout(() => {
          navigate("/staffinvoice");
        }, 2000);
        resetForm();
      } else {
        setAlertSeverity("error");
        setAlertMessage(response.data.result.message);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to add invoice");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      m="20px"
      height="85vh"
      width="98%"
      overflow="auto"
      paddingRight="20px"
      position="relative"
    >
      <Header title="Add Invoice" subtitle="" />
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
          <AlertTitle>
            {alertSeverity === "success" ? "Success" : "Error"}
          </AlertTitle>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={invoiceSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue, // Capture setFieldValue function
        }) => {
          // Store the setFieldValue in ref for useEffect to access
          setFieldValueRef.current = setFieldValue;

          const handleSubmitWithUserId = (e) => {
            e.preventDefault(); // Prevent default form submission
            setFieldValue("staff", userId); // Set staff field to userId
            handleSubmit(); // Call Formik's handleSubmit
          };

          return (
            <form onSubmit={handleSubmitWithUserId}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns={
                  isNonMobile ? "repeat(1, 1fr)" : "repeat(1, 1fr)"
                }
              >
                {/* Form fields */}
                <Typography fontWeight="bold" fontSize="16px">
                  Invoice Title*
                </Typography>
                <Box mt={-2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.invoiceTitle}
                    name="invoiceTitle"
                    error={!!touched.invoiceTitle && !!errors.invoiceTitle}
                    helperText={touched.invoiceTitle && errors.invoiceTitle}
                  />
                </Box>
                <Typography fontWeight="bold" fontSize="16px">
                Description
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.invoiceDescription}
                  name="invoiceDescription"
                  multiline
                  rows={5}
                  error={
                    !!touched.invoiceDescription && !!errors.invoiceDescription
                  }
                  helperText={
                    touched.invoiceDescription && errors.invoiceDescription
                  }
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Staff
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  onBlur={handleBlur}
                  value={staffName}
                  name="staff"
                  error={!!touched.staff && !!errors.staff}
                  helperText={touched.staff && errors.staff}
                  InputProps={{
                    readOnly: true,  // Makes the field read-only
                  }}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Amount*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={values.amount}
                  name="amount"
                  error={!!touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Send Date*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sendDate}
                  name="sendDate"
                  error={!!touched.sendDate && !!errors.sendDate}
                  helperText={touched.sendDate && errors.sendDate}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Notes
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.notes}
                  name="notes"
                  multiline
                  rows={3}
                  error={!!touched.notes && !!errors.notes}
                  helperText={touched.notes && errors.notes}
                />
              </Box>
              </Box>
              {/* Submit Button */}
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
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
                  {loading ? "Adding..." : "Add"}
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

const invoiceSchema = yup.object().shape({
  invoiceTitle: yup.string().required("Invoice Title is required"),
  invoiceDescription: yup.string(),
  amount: yup.number().required("Amount is required").nullable(),
  sendDate: yup.date().required("Send Date is required").nullable(),
  staff: yup.string(),
  notes: yup.string(),
});

export default AddStaffInvoice;
