import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  Chip,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { environment } from "../../../environment";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const jobSchema = yup.object().shape({
  jobName: yup.string().required("Job Name is required"),
  description: yup.string().required("Description is required"),
  client: yup.string().required("Client is required"),
  assignedStaff: yup.string().required("Assigned Staff is required"),
  orgNoOfhours: yup.number().required("Number of Hours is required").nullable(),
  orgHourRate: yup.number().required("Hourly Rate is required").nullable(),
  estNoOfhours: yup.number().required("Number of Hours is required").nullable(),
  staffHourRate: yup.number().required("Hourly Rate is required").nullable(),
  notes: yup.string(),
  type: yup.string().required("Type is required"),
  days: yup
    .array()
    .of(yup.string())
    .when("type", {
      is: (val) => val !== "daily" && val !== "weekly",
      then: yup.array().min(1, "At least one day must be selected"),
      otherwise: yup.array(),
    }),
  startDate: yup.date().required("Start date is required"),
});

const EditJob = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [jobDetails, setJobDetails] = useState({
    jobName: "",
    description: "",
    client: "",
    assignedStaff: "",
    orgNoOfhours: 0,
    orgHourRate: 0,
    estNoOfhours: 0,
    staffHourRate: 0,
    notes: "",
    type: "",
    days: [],
    startDate: "",
  });

  const [clients, setClients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchStaffs();
    fetchJobDetails();
  }, []);

  const fetchClients = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        environment.apiUrl + "/client/getAllActiveClient",
        { headers }
      );

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
      const response = await axios.get(
        environment.apiUrl + "/staff/getAllActiveStaff",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${environment.apiUrl}/super/getTaskById/${id}`,
        { headers }
      );

      if (response.status === 200) {
        const job = response.data;

        const formattedStartDate = new Date(job.startDate)
          .toISOString()
          .split("T")[0];

        setJobDetails({
          jobName: job.jobName,
          description: job.description,
          client: job.client._id,
          assignedStaff: job.assignedStaff._id,
          orgNoOfhours: job.orgNoOfhours,
          orgHourRate: job.orgHourRate,
          estNoOfhours: job.estNoOfhours,
          staffHourRate: job.staffHourRate,
          notes: job.notes,
          type: job.type,
          days: job.days,
          startDate: formattedStartDate,
        });
      } else {
        console.error("Failed to fetch job details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const handleUpdateJob = async (values) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        environment.apiUrl + `/super/updateSuperTask/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      if (response.status === 200) {
        setAlertSeverity("success");
        setAlertMessage("Job updated successfully");
        setTimeout(() => {
          navigate("/superjobs");
        }, 2000);
      } else {
        setAlertSeverity("error");
        setAlertMessage(`Failed to update job: ${responseData.message}`);
      }
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(`Error updating job: ${error.message}`);
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box m="20px" height="85vh" overflow="auto" paddingRight="20px">
      <Header title={`Edit Job ID: ${id}`} subtitle="" />
      <Box ml={"40px"}>
        <Formik
          initialValues={jobDetails}
          enableReinitialize
          validationSchema={jobSchema}
          onSubmit={handleUpdateJob}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
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
                    sx={{ backgroundColor: "white" }}
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
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Client:
                  </Typography>
                  <Box>
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
                    sx={{ backgroundColor: "white",  width: "50%" }}
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.firstName} {client.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" component="span" fontWeight="bold">
                    Assigned Staff:
                  </Typography>
                  <Box>
                  <Field
                    as={Select}
                    fullWidth
                    variant="filled"
                    name="assignedStaff"
                    value={values.assignedStaff}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.assignedStaff && Boolean(errors.assignedStaff)
                    }
                    helperText={touched.assignedStaff && errors.assignedStaff}
                    sx={{ backgroundColor: "white",  width: "50%"  }}
                  >
                    {staffs.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Field>
                  </Box>
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
                    sx={{ backgroundColor: "white" }}
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
                    sx={{ backgroundColor: "white" }}
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
                    sx={{ backgroundColor: "white" }}
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
                    error={
                      touched.staffHourRate && Boolean(errors.staffHourRate)
                    }
                    helperText={touched.staffHourRate && errors.staffHourRate}
                    onWheel={(e) => e.target.blur()}
                    sx={{ backgroundColor: "white" }}
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
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>

                {/* Type Field */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="filled">
                    <Typography fontWeight="bold" fontSize="16px">
                      Type*
                    </Typography>
                    <Select
                      fullWidth
                      variant="filled"
                      name="type"
                      sx={{ width: "50%" }}
                      value={values.type}
                      onChange={(e) => {
                        handleChange(e);
                        if (
                          e.target.value === "daily" ||
                          e.target.value === "weekly"
                        ) {
                          setFieldValue("days", []);
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.type && !!errors.type}
                    >
                      {["daily", "weekly", "fortnight", "other"].map(
                        (option) => (
                          <MenuItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <FormHelperText>
                      {touched.type && errors.type}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Job Days Field */}
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    variant="filled"
                    error={touched.days && !!errors.days}
                  >
                    <Typography fontWeight="bold" fontSize="16px">
                      Job Days
                    </Typography>
                    <Select
                      multiple
                      sx={{ width: "50%" }}
                      value={Array.isArray(values.days) ? values.days : []} // Ensure it's always an array
                      onChange={(event) =>
                        setFieldValue("days", event.target.value)
                      }
                      renderValue={(selected) => selected.join(", ")}
                      disabled={
                        values.type === "daily" || values.type === "weekly"
                      }
                    >
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.days && errors.days}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Start Date Field */}
                <Grid item xs={12}>
                  <Typography fontWeight="bold" fontSize="16px">
                    Start Date
                  </Typography>

                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.startDate}
                    name="startDate"
                    error={!!touched.startDate && !!errors.startDate}
                    helperText={touched.startDate && errors.startDate}
                    sx={{ width: "50%" }}
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
                    {isLoading ? "Updating..." : "Update Job"}
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

export default EditJob;
