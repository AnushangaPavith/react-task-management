import {
  Box,
  Button,
  MenuItem,
  Alert as MuiAlert,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlertTitle from "@mui/material/AlertTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import Header from "../../components/Header";
import { environment } from "../../environment";
import { useNavigate } from "react-router-dom";

const AddStaff = ({ onStaffAdded }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        environment.apiUrl + `/user/adduser`,
        {
          email: values.email,
          password: values.password,
          userName: values.userName,
          role: "staff",
          staffDetails: values,
        },
        { headers }
      );
      console.log(response);
      if (response.data.success) {
        setAlertSeverity("success");
        setAlertMessage("Staff Added Successfully");
        setTimeout(() => {
          navigate("/staff");
        }, 2000);
        resetForm();
        if (onStaffAdded) {
          onStaffAdded(response.data.staff);
        }
      } else {
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to add staff");
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
      <Header title="Add Staff" subtitle="" />
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
        validationSchema={staffSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns={
                isNonMobile ? "repeat(1, 1fr)" : "repeat(1, 1fr)"
              }
            >
              <Typography fontWeight="bold" fontSize="16px">
                First Name*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Last Name*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Email*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Password*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Username*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={!!touched.userName && !!errors.userName}
                  helperText={touched.userName && errors.userName}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Address*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  name="address"
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Phone Number*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Position*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.position}
                  name="position"
                  error={!!touched.position && !!errors.position}
                  helperText={touched.position && errors.position}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Date of Birth*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dateOfBirth}
                  name="dateOfBirth"
                  error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Date of Hire*
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dateOfHire}
                  name="dateOfHire"
                  error={!!touched.dateOfHire && !!errors.dateOfHire}
                  helperText={touched.dateOfHire && errors.dateOfHire}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Emergency Contact Name
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.empContactName}
                  name="empContactName"
                  error={!!touched.empContactName && !!errors.empContactName}
                  helperText={touched.empContactName && errors.empContactName}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Emergency Contact Phone Number
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.empPhoneNumber}
                  name="empPhoneNumber"
                  error={!!touched.empPhoneNumber && !!errors.empPhoneNumber}
                  helperText={touched.empPhoneNumber && errors.empPhoneNumber}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                Bank Account Name
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bankAcName}
                  name="bankAcName"
                  error={!!touched.bankAcName && !!errors.bankAcName}
                  helperText={touched.bankAcName && errors.bankAcName}
                />
              </Box>
              <Typography fontWeight="bold" fontSize="16px">
                BSB
              </Typography>
              <Box mt={-2}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.BSB}
                  name="BSB"
                  error={!!touched.BSB && !!errors.BSB}
                  helperText={touched.BSB && errors.BSB}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ marginRight: '8px', marginBottom: '-3px' }}>
                        BSB-
                      </InputAdornment>
                    ),
                  }}
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
        )}
      </Formik>
    </Box>
  );
};
const phoneNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/; // Example regex for phone numbers (e.g., +123-1234567890 or 1234567890)
const bankAcNoRegex = /^\d{8,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const staffSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      passwordRegex,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
    )
    .required("Password is required"),
  userName: yup.string().required("Username is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup
    .string()
    .matches(phoneNumberRegex, "Invalid phone number format")
    .required("Phone Number is required"),
  position: yup.string().required("Position is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  dateOfHire: yup.string().required("Date of Hire is required"),
  empContactName: yup.string(),
  empPhoneNumber: yup
    .string()
    .matches(phoneNumberRegex, "Invalid phone number format"),
  bankAcNo: yup
    .string()
    .matches(bankAcNoRegex, "Invalid bank account number format"),
  bankName: yup.string(),
  bankAcBranch: yup.string(),
  notes: yup.string(),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  userName: "",
  address: "",
  phoneNumber: "",
  position: "",
  dateOfBirth: "",
  dateOfHire: "",
  empContactName: "",
  empPhoneNumber: "",
  bankAcName: "",
  BSB: "",
  bankAcBranch: "",
  notes: "",
};

export default AddStaff;
