import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { environment } from "../../environment";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const phoneNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const bankAcNameRegex = /^\d{8,20}$/;

const staffSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup.string().matches(phoneNumberRegex, "Invalid phone number format").required("Phone Number is required"),
  position: yup.string().required("Position is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  dateOfHire: yup.string().required("Date of Hire is required"),
  empContactName: yup.string(),
  empPhoneNumber: yup.string().matches(phoneNumberRegex, "Invalid phone number format"),
  bankAcName: yup.string().matches(bankAcNameRegex, "Invalid bank account number format").nullable(true),
  BSB: yup.string().required("BSB is required"),
  notes: yup.string(),
});

const EditStaff = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [staffDetails, setStaffDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    position: "",
    dateOfBirth: "",
    dateOfHire: "",
    empContactName: "",
    empPhoneNumber: "",
    bankAcName: "",
    BSB: "",
    notes: "",
    workStatus: "",
    userName: "",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/staff/getStaffById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (responseData.success) {
        const staff = responseData.staff;

        // Convert date fields to 'YYYY-MM-DD' format if they exist
        staff.dateOfBirth = staff.dateOfBirth ? staff.dateOfBirth.split('T')[0] : new Date().toISOString().split('T')[0];
        staff.dateOfHire = staff.dateOfHire ? staff.dateOfHire.split('T')[0] : new Date().toISOString().split('T')[0];

        setStaffDetails(staff);
      } else {
        console.error('Failed to fetch staff details:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  const handleUpdateStaff = async (values) => {
    setIsLoading(true);
    console.log("update")

    try {
      const response = await axios.put(environment.apiUrl + `/user/updateStaff/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('Staff updated successfully');
        setTimeout(() => {
          navigate('/staff');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update staff: ${response.data.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating staff: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="85vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Staff ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Formik
          initialValues={{
            ...staffDetails,
            dateOfBirth: staffDetails.dateOfBirth || new Date().toISOString().split('T')[0],
            dateOfHire: staffDetails.dateOfHire || new Date().toISOString().split('T')[0]
          }}
          enableReinitialize
          validationSchema={staffSchema}
          onSubmit={handleUpdateStaff}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {Object.keys(staffDetails).map((field) => (
                  field !== 'createdAt' && field !== '__v' && field !== '_id' && field !== 'updatedAt' && field !== 'adminId' && field !== 'user' && field !== 'workStatus' && (
                    <Grid item xs={12} key={field}>
                      <Typography variant="h5" component="span" fontWeight="bold">
                        {`${field.charAt(0).toUpperCase() + field.slice(1)}:`}
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        name={field}
                        type={field === 'dateOfBirth' || field === 'dateOfHire' ? 'date' : 'text'}
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline={field === 'notes'}
                        rows={field === 'notes' ? 3 : 1}
                        error={touched[field] && Boolean(errors[field])}
                        helperText={touched[field] && errors[field]}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  )
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: '#6870fa',
                      color: 'white',
                      marginRight: 2,
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: '#3e4396',
                      },
                    }}
                  >
                    {isLoading ? 'Updating...' : 'Update Staff'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          sx={{ color: '#fff' }}
        >
          {alertSeverity === 'success' ? 'Success' : 'Error'}
          {': '}
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EditStaff;
