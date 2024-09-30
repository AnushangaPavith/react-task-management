import AnalyticsIcon from "@mui/icons-material/Analytics";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MicIcon from "@mui/icons-material/MicOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import SchoolIcon from "@mui/icons-material/School";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import logoSrc from "../../assets/logo/login_logo.png";
import ReceiptIcon from "@mui/icons-material/Receipt";
const Item = ({ title, to, icon, selected, setSelected, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleSubmenuToggle = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          backgroundColor: selected === title ? "#868dfb" : "transparent",
          "&:hover": {
            backgroundColor: "#868dfb",
          },
        }}
        onClick={() => {
          setSelected(title);
          handleSubmenuToggle();
        }}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
      {isSubmenuOpen && children}
    </>
  );
};

const Subtopic = ({ title, to, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        textAlign: "center",
        backgroundColor: selected === title ? "#868dfb" : "transparent",
        "&:hover": {
          backgroundColor: "#868dfb",
        },
      }}
      onClick={() => setSelected(title)}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [userRole, setUserRole] = useState(localStorage.getItem("User_role"));
  useEffect(() => {
    const role = localStorage.getItem("User_role");
    setUserRole(role);
  }, []);

  const showSuperAdmin = userRole === "superAdmin";
  const showItem = userRole !== "staff";

  return (
    <Box
      sx={{
        zIndex: 500,
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "10px 30px 5px 10px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "30px 20 20px 20px",
              color: colors.grey[100],
              textAlign: "center",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="30px"
              >
                <img
                  alt="profile-user"
                  src={logoSrc}
                  style={{
                    width: "45%",
                    height: "45%",
                    cursor: "pointer",
                    // borderRadius: "50%",
                    transform:
                      theme.palette.mode === "dark" ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box
            pl={!isCollapsed ? "20px" : undefined}
            alignItems="left"
            sx={{ marginTop: "20px" }}
            width={!isCollapsed ? "calc(100% + 40px)" : undefined}
          >
            {showItem && (
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            <Item
              title="Jobs"
              to="/jobs"
              icon={<BusinessCenterOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            >
              {showItem && userRole !== "staff" && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '20%' }}>
                  <Subtopic
                    title="Super Jobs"
                    to="/superjobs"
                    selected={selected}
                    setSelected={setSelected}
                    sx={{ width: '100%'}}
                  />
                  <Subtopic
                    title="Completed Jobs"
                    to="/completedjobs"
                    selected={selected}
                    setSelected={setSelected}
                    sx={{ width: '100%'}}
                  />
                  <Subtopic
                    title="Payment Summery"
                    to="/paymentsummery"
                    selected={selected}
                    setSelected={setSelected}
                    sx={{ width: '100%'}}
                  />
                </Box>
              )}
            </Item>
            {showItem && (
              <Item
                title="Clients"
                to="/clients"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {showItem && (
              <Item
                title="Invoices"
                to="/invoices"
                icon={<ReceiptIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            {showItem && (
              <Item
                title="Notes"
                to="/notes"
                icon={<StickyNote2Icon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            {showItem && (
              <Item
                title="Holidays"
                to="/holidays"
                icon={<CalendarMonthOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            {showItem && (
              <Item
                title="Staff"
                to="/managestaff"
                icon={<GroupOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {showSuperAdmin && (
              <Item
                title="Admin"
                to="/admin"
                icon={<GroupOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
