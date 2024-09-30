import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ColorModeContext, tokens } from "../../theme";
import profile from "../../assets/logo/profile.png"
import { environment } from "../../environment";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import logoSrc from "../../assets/logo/logo.png"
const Topbar = () => {

  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    image: profile,
    role: ''
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    const fetchAdminData = async () => {
      try {
         await axios.get(
          environment.apiUrl + `/user/getUser/${userId}`
        ).then(async (res)=>{
          const data = res.data.userDetails
          data.image = profile;
        ;
        if (data) {
          const uData = {
            name:  data.userName,
            image: profile,
            role:data.role

          }
          await setAdminData(data);
          
        }
        });
        
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor={colors.primary[400]}
      p={0}
    >
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        // borderRadius="50%"
        overflow="hidden"
        width="170px"
        height="50px"
      >
        {/* <img
          alt="profile-user"
          src={logoSrc}
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
            // borderRadius: "50%",
            transform:
              theme.palette.mode === "dark" ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        /> */}
      </Box>
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <img
          alt="profile-user-2"
          width="100px"
          height="100px"
          src={`./JCGN Logo.png`}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
          }} // Ensure image fills parent box
        />
      </Box> */}

      {/* ICONS */}
      <Box>
        {/* <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon style={{ fontSize: "1.8rem" }} />
          ) : (
            <LightModeOutlinedIcon style={{ fontSize: "1.8rem" }} />
          )}
        </IconButton> */}
        {/* <IconButton>
          <NotificationsOutlinedIcon style={{ fontSize: "1.8rem" }} />
        </IconButton> */}

        <IconButton
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginRight="20px"
        >
          <img
            alt="profile-user"
            width="50px"
            height="50px"
            src={adminData.image}
            style={{ cursor: "pointer", borderRadius: "50%" }}
          />
          <Typography
            sx={{ display: "flex", flexDirection: "column", m: "10px" }}
            onClick={handleClick}
          >
            <Typography
              variant="h4"
              color={colors.grey[100]}
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              {adminData.userName} <ArrowDropDownCircleOutlined />
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]}>
              {adminData.role}
            </Typography>
          </Typography>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              component={Link}
              to="/profile"
              onClick={handleClose}
              style={{ fontSize: "larger" }}
            >
              <IconButton>
                <AccountCircleIcon />
              </IconButton>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} style={{ fontSize: "larger" }}>
              <IconButton>
                <ExitToAppIcon />
              </IconButton>
              Logout
            </MenuItem>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
