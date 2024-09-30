import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes.jsx";
import { jwtDecode } from "jwt-decode";

import Sidebar from "./scenes/global/Sidebar";
import SidebarStaff from "./scenes/global/SidebarStaff";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";

import Jobs from "./scenes/jobs";
import AddJob from "./scenes/jobs/AddJob.jsx";
import ViewJob from "./scenes/jobs/ViewJob.jsx";
import EditJob from "./scenes/jobs/EditJob.jsx";
import CompletedJobs from "./scenes/jobs/completedJobs";
import PaymentSummery from "./scenes/jobs/paymentSummery";

import SuperJobs from "./scenes/jobs/superJobs/index.jsx";
import AddSuperJob from "./scenes/jobs/superJobs/AddJob.jsx";
import ViewSuperJob from "./scenes/jobs/superJobs/ViewJob.jsx";
import EditSuperJob from "./scenes/jobs/superJobs/EditJob.jsx";

import Staff from "./scenes/staff";
import ViewStaff from "./scenes/staff/ViewStaff.jsx";
import AddStaff from "./scenes/staff/AddStaff.jsx";
import EditStaff from "./scenes/staff/EditStaff.jsx";

import Clients from "./scenes/clients";
import AddClient from "./scenes/clients/AddClient.jsx";
import ViewClient from "./scenes/clients/ViewClient.jsx";
import EditClient from "./scenes/clients/EditClient.jsx";
import StaffJobs from "./scenes/staff/StaffJobs.jsx";

import ChangePw from "./scenes/profile/ChangePw";
import EditProfile from "./scenes/profile/EditProfile";
import { ColorModeContext, useMode } from "./theme";
import ClientJobs from "./scenes/clients/ClientJobs .jsx";
import Dashboard from "./scenes/dashboard/dashboard.jsx";
import PrivateRoute from "./PrivateRoutes.js";
import Admin from "./scenes/admins/index.jsx";
import CreateAdmin from "./scenes/admins/CreateAdmin.jsx";
import ViewAdmin from "./scenes/admins/ViewAdmin.jsx";
import EditAdmin from "./scenes/admins/EditAdmin.jsx";

import Invoices from "./scenes/invoices/index.jsx";
import AddInvoice from "./scenes/invoices/AddInvoices.jsx";
import EditInvoice from "./scenes/invoices/EditInvoices.jsx";
import ViewInvoice from "./scenes/invoices/ViewInvoice.jsx";

import Notes from "./scenes/notes/index.jsx";

import Holidays from "./scenes/Holidays/index.jsx";

import Staff_Jobs from "./scenes/staffpages/index.jsx";
import Staff_Jobs_View from "./scenes/staffpages/ViewJob.jsx";
import StaffInvoices from "./scenes/staffpages/Invoices.jsx";
import AddStaffInvoice from "./scenes/staffpages/AddInvoices.jsx";
import ViewStaffInvoice from "./scenes/staffpages/ViewInvoice.jsx";
import EditStaffInvoice from "./scenes/staffpages/EditInvoices.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/";

  const getUserRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.role; // Adjust according to your token structure
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  // Determine the sidebar based on the user role
  const renderSidebar = () => {
    if (getUserRoleFromToken() === "staff") {
      return <SidebarStaff isSidebar={isSidebar} />;
    } else if (
      getUserRoleFromToken() === "admin" ||
      getUserRoleFromToken() === "superAdmin"
    ) {
      return <Sidebar isSidebar={isSidebar} />;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && renderSidebar()}
          <main className="content">
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <Staff_Jobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/viewjob/:id"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <Staff_Jobs_View />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staffinvoice"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <StaffInvoices />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staffinvoice/newInvoice"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <AddStaffInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staffinvoice/viewInvoice/:id"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <ViewStaffInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staffinvoice/editInvoice/:id"
                element={
                  <PrivateRoute allowedRoles={["staff"]}>
                    <EditStaffInvoice />
                  </PrivateRoute>
                }
              />

              <Route
                path="/jobs"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Jobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs/newjob"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <AddJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs/viewjob/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin", "staff"]}>
                    <ViewJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs/editjob/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/completedjobs"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <CompletedJobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/paymentsummery"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <PaymentSummery />
                  </PrivateRoute>
                }
              />
              <Route
                path="/superjobs"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <SuperJobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/superjobs/newjob"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <AddSuperJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/superjobs/viewjob/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ViewSuperJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/superjobs/editjob/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditSuperJob />
                  </PrivateRoute>
                }
              />



              <Route
                path="/clients"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Clients />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients/newclient"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <AddClient />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients/viewclient/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ViewClient />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients/editclient/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditClient />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients/viewclient/:id/jobs"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ClientJobs />
                  </PrivateRoute>
                }
              />

              <Route
                path="/managestaff"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Staff />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/newstaff"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <AddStaff />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/viewstaff/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ViewStaff />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/editstaff/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditStaff />
                  </PrivateRoute>
                }
              />
              <Route
                path="/staff/viewstaff/:id/jobs"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <StaffJobs />
                  </PrivateRoute>
                }
              />

              <Route
                path="/invoices"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Invoices />
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoices/newInvoice"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <AddInvoice />
                  </PrivateRoute>
                }
              />

              <Route
                path="/invoices/editInvoice/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditInvoice />
                  </PrivateRoute>
                }
              />

              <Route
                path="/invoices/viewInvoice/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ViewInvoice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/changepassword"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin", "staff"]}>
                    <ChangePw />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin", "staff"]}>
                    <EditProfile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Admin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/createadmin"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <CreateAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/viewadmin/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <ViewAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/editadmin/:id"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <EditAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Notes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/holidays"
                element={
                  <PrivateRoute allowedRoles={["superAdmin", "admin"]}>
                    <Holidays />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
