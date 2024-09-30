import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { environment } from '../../environment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const jobSchema = yup.object().shape({
  jobName: yup.string().required("Job Name is required"),
  description: yup.string().required("Description is required"),
  client: yup.string().required("Client is required"),
  assignedStaff: yup.string().required("Assigned Staff is required"),
  orgNoOfhours: yup.number().required("Number of Hours is required").nullable(),
  orgHourRate: yup.number().required("Hourly Rate is required").nullable(),
  estNoOfhours: yup.number().required("Number of Hours is required").nullable(),
  staffHourRate: yup.number().required("Hourly Rate is required").nullable(),
  staffExtraHours: yup.number(),
  staffExtraPayment: yup.number(),

  notes: yup.string(),
});

const EditJob = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [jobDetails, setJobDetails] = useState({
    jobName: '',
    description: '',
    client: '',
    assignedStaff: '',
    orgNoOfhours: 0,
    orgHourRate: 0,
    estNoOfhours: 0,
    staffHourRate: 0,
    staffExtraHours: 0,
    staffExtraPayment: 0,
    notes: '',
  });

  const [clients, setClients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchStaffs();
    fetchJobDetails();
  }, []);

  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(environment.apiUrl + "/client/getAllActiveClient", { headers });

      if (response.data.success) {
        setClients(response.data.clients);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch clients");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to fetch clients");
      setOpenSnackbar(true);
    }
  };

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(environment.apiUrl + "/staff/getAllActiveStaff", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setStaffs(response.data.staffs);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to fetch staffs");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching staffs:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to fetch staffs");
      setOpenSnackbar(true);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(environment.apiUrl + `/job/getJobById/${id}`);
      const responseData = response.data;

      if (responseData.success) {
        const job = responseData.job;
        setJobDetails({
          jobName: job.jobName,
          description: job.description,
          client: job.client._id,
          assignedStaff: job.assignedStaff._id,
          orgNoOfhours: job.orgNoOfhours,
          orgHourRate: job.orgHourRate,
          estNoOfhours: job.estNoOfhours,
          staffHourRate: job.staffHourRate,
          staffExtraHours: job.staffExtraHours,
          staffExtraPayment: job.staffExtraPayment,
          notes: job.notes,
        });
      } else {
        console.error('Failed to fetch job details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleUpdateJob = async (values) => {
    setIsLoading(true);

    try {
      const response = await axios.put(environment.apiUrl + `/job/updatedJob/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = response.data;
      if (response.status === 200) {
        setAlertSeverity('success');
        setAlertMessage('Job updated successfully');
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(`Failed to update job: ${responseData.message}`);
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(`Error updating job: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="85vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Job ID: ${id}`} subtitle="" />
      <Box ml={'40px'}>
        <Formik
          initialValues={jobDetails}
          enableReinitialize
          validationSchema={jobSchema}
          onSubmit={handleUpdateJob}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Job details fields */}
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Job Name:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="jobName"
                    value={values.jobName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.jobName && Boolean(errors.jobName)}
                    helperText={touched.jobName && errors.jobName}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Description:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={3}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Client:
                  </Typography>
                  <Field
                    as={Select}
                    fullWidth
                    variant="filled"
                    name="client"
                    value={values.client}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client && Boolean(errors.client)}
                    helperText={touched.client && errors.client}
                    sx={{ backgroundColor: 'white' }}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Assigned Staff:
                  </Typography>
                  <Field
                    as={Select}
                    fullWidth
                    variant="filled"
                    name="assignedStaff"
                    value={values.assignedStaff}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.assignedStaff && Boolean(errors.assignedStaff)}
                    helperText={touched.assignedStaff && errors.assignedStaff}
                    sx={{ backgroundColor: 'white' }}
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Original Number of Hours:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="orgNoOfhours"
                    value={values.orgNoOfhours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.orgNoOfhours && Boolean(errors.orgNoOfhours)}
                    helperText={touched.orgNoOfhours && errors.orgNoOfhours}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Originally Hourly Rate:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="orgHourRate"
                    value={values.orgHourRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.orgHourRate && Boolean(errors.orgHourRate)}
                    helperText={touched.orgHourRate && errors.orgHourRate}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Estimated Number of Hours:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="estNoOfhours"
                    value={values.estNoOfhours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.estNoOfhours && Boolean(errors.estNoOfhours)}
                    helperText={touched.estNoOfhours && errors.estNoOfhours}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Staff Hourly Rate:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="staffHourRate"
                    value={values.staffHourRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.staffHourRate && Boolean(errors.staffHourRate)}
                    helperText={touched.staffHourRate && errors.staffHourRate}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Extra hours:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="staffExtraHours"
                    value={values.staffExtraHours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.staffExtraHours && Boolean(errors.staffExtraHours)}
                    helperText={touched.staffExtraHours && errors.staffExtraHours}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                   Extra payment:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    type="number"
                    name="staffExtraPayment"
                    value={values.staffExtraPayment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.staffExtraPayment && Boolean(errors.staffExtraPayment)}
                    helperText={touched.staffExtraPayment && errors.staffExtraPayment}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Notes:
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="filled"
                    margin="normal"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={3}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                    sx={{ backgroundColor: 'white' }}
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
                      backgroundColor: '#6870fa',
                      color: 'white',
                      marginRight: 2,
                      fontSize: '16px',
                      '&:hover': {
                        backgroundColor: '#3e4396',
                      },
                    }}
                  >
                    {isLoading ? 'Updating...' : 'Update Job'}
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

export default EditJob;
