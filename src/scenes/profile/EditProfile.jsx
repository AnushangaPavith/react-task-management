import { CameraAlt, Delete } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import Header from "../../components/Header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { environment } from "../../environment";

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    ProfileImage: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const token = localStorage.getItem("token")

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        environment.apiUrl + `/user/getUser/${userId}`
      );
      if (response) {
        const data = await response.data;
        const userData = data.userDetails;
        setUserDetails({
          name: userData.userName ? userData.userName : " " ,
          email: userData.email ? userData.email : " ",
          ProfileImage: userData.image || "",
        });

        formik.setValues({
          name: userData.userName ? userData.userName : " " ,
          email: userData.email ? userData.email : " ",
        });
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Enter valid mail")
  });

  const formik = useFormik({
    initialValues: userDetails,
    validationSchema: () => checkoutSchema,
    onSubmit: async (values) => {
      try {
        // const response = await fetch(
        //   `https://jcgnapi.hasthiya.org/admin/updateUserDetails/1`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       email: userDetails.email,
        //       name: values.name,
        //     }),
        //   }
        // );
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const userValues ={
        userName : values.name,
        email : values.email

        }
    
        const response = await axios.put(environment.apiUrl+`/user/userUpdate/${userId}`, userValues, { headers });
        if (response.data.success) {
          setAlertSeverity("success");
          setAlertMessage("Profile name updated successfully!");
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
          fetchUserDetails();
          setHasChanges(false);
        } else {
          console.error("Failed to update profile:", response.statusText);
          setAlertSeverity("error");
          setAlertMessage("Failed to update profile. Please try again.");
          setOpenSnackbar(true);

        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setAlertSeverity("error");
        setAlertMessage(
          "An error occurred while updating profile. Please try again later."
        );
        setOpenSnackbar(true);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails({
          ...userDetails,
          ProfileImage: reader.result,
        });

        uploadProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("imageURL", file);
      const response = await fetch(
        `https://jcgnapi.hasthiya.org/admin/updateAdminImage/1`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (response.ok) {
        setAlertSeverity("success");
        setAlertMessage("Image changed successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
        setOpenSnackbar(true);
      } else {
        console.error("Failed to update profile image:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeProfileImage = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the profile picture. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6870fa",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveImage();
      }
    });
  };

  const handleRemoveImage = async () => {
    try {
      const defaultAvatar = await fetch("./avatar.png");
      const avatarBlob = await defaultAvatar.blob();

      const formData = new FormData();
      formData.append("imageURL", avatarBlob);

      const response = await fetch(
        `https://jcgnapi.hasthiya.org/admin/updateAdminImage/1`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Profile image updated successfully!");
        setAlertSeverity("success");
        setAlertMessage("Profile picture removed successfully!");
        setOpenSnackbar(true);

        setUserDetails({
          ...userDetails,
          ProfileImage: "./avatar.png",
        });
      } else {
        console.error("Failed to remove profile image:", response.statusText);
        setAlertSeverity("error");
        setAlertMessage("Failed to remove profile picture. Please try again.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      setAlertSeverity("error");
      setAlertMessage(
        "An error occurred while removing profile picture. Please try again later."
      );
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (event) => {
    formik.handleChange(event);
    setHasChanges(true); // Set hasChanges to true when input changes
  };

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <div className ="row d-flex justify-content-between">
        <div className = "col-md-6">
        <Header
        title={`Edit Profile`}
        subtitle={
          // <Typography sx={{ fontSize: "1.1rem" }}>
          //   {`Name: ${userDetails.name}`} <br />
          //   {`Email: ${userDetails.email}`}
          // </Typography>
          <>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {`Name: ${userDetails.name}`} <br />
              {`Email: ${userDetails.email}`}
            </Typography>
            
          </>
        }
       />
        </div>
        <div className ="col-md-6 d-flex justify-content-end mt-2">
        <Button
              variant="outlined"
              sx={{ ml: 2, color: "#6870fa", borderColor: "#6870fa",  height:"30%" }}
              onClick={() => navigate("/profile/changepassword")}
              mt = {2}
            >
              Change Password
            </Button>
      </div>
        </div>
      
       
      

      <Box ml={"40px"}>
        <Grid container spacing={2}>
          <Grid item xs={10.2}>
            {/* <Box display="flex" alignItems="center">
              <Box mb={3.5}>
                <Avatar
                  alt="profile-avatar"
                  src={userDetails.ProfileImage || undefined}
                  sx={{ width: 150, height: 150, cursor: "pointer" }}
                />
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "40%",
                      left: "60%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ mt: 2, fontWeight: 600, fontSize: 19.2 }}>
                      Profile Image Uploading
                    </Typography>

                    <CircularProgress size={40} />
                  </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    style={{ color: "#6870fa" }}
                  >
                    <CameraAlt />
                  </IconButton>
                </label>
                {userDetails.ProfileImage && (
                  <>
                    <IconButton
                      aria-label="delete"
                      onClick={removeProfileImage}
                    >
                      <Delete />
                      <Typography variant="body2" component="span" ml={1}>
                        Remove Profile Picture
                      </Typography>{" "}
                    </IconButton>
                  </>
                )}
              </Box>
            </Box> */}
          </Grid>
          <Grid item xs={2} mt={4}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Enter New Name:
              {formik.touched.name && formik.errors.name && (
                <Typography
                  component="span"
                  color="error"
                  style={{ marginLeft: "3px" }}
                >
                  *
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={10} mt={4}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="name"
              value={formik.values.name}
              onChange={handleInputChange}
              error={
                (formik.touched.name && Boolean(formik.errors.name))
              }
              helperText={
                (formik.touched.name && formik.errors.name) 
                  ? formik.errors.name && "Enter User Name"
                  : null
              }
              style={{ marginTop: "-10px", width: "70%" }}
            />
          </Grid>

          <Grid item xs={2} mt={3}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Enter New Email:
              {formik.touched.email && formik.errors.email && (
                <Typography
                  component="span"
                  color="error"
                  style={{ marginLeft: "3px" }}
                >
                  *
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={10} mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={handleInputChange}
              error={
                (formik.touched.email && Boolean(formik.errors.email))
              }
              helperText={
                (formik.touched.email && formik.errors.email)
                  ? formik.errors.email && "Enter valid"
                  : null
              }
              style={{ marginTop: "-10px", width: "70%" }}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            onClick={formik.handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#6870fa",
              color: "white",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#3e4396",
              },
            }}
            disabled = {!hasChanges}
            
          >
            Update
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          style={{ color: "white" }}
        >
          <AlertTitle>
            {alertSeverity === "success" ? "Success" : "Error"}
          </AlertTitle>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditProfile;
