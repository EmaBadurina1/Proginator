import React, { useEffect } from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import UserAdd from "./pages/UserAdd";
import AttendanceRecord from "./pages/AttendanceRecord";
import PatientPreview from "./pages/PatientPreview";
import AppointmentsPreview from "./pages/AppointmentsPreview";
import DenyAppointment from "./pages/DenyAppointment";
import ChangeAppointment from "./pages/ChangeAppointment";
import AppointmentRequestsPreview from "./pages/AppointmentRequestsPreview";
import AttendanceDisplay from "./pages/AttendanceDisplay";
import { LoginContext } from "./contexts/LoginContext";
import UserAccount from "./pages/UserAccount";
import MyTherapies from "./pages/MyTherapies";
import CreateTherapy from "./pages/CreateTherapy";
import MyTherapy from "./pages/MyTherapy";
import NewAppointment from "./pages/NewAppointment";
import ChangePassword from "./pages/ChangePassword";
import AlreadyLoggedIn from "./pages/AlreadyLoggedIn";
import DataPreview from "./pages/DataPreview";
import UserAccounts from "./pages/UserAccounts";
import Devices from "./pages/Devices";
import Rooms from "./pages/Rooms";
import UserEdit from "./pages/UserEdit";
import RoomAdd from "./pages/RoomAdd";
import RoomEdit from "./pages/RoomEdit";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [userRole, setUserRole] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  useEffect(() => {
    let userDataLS = localStorage.getItem("user_data");
    let userRoleLS = localStorage.getItem("user_role");

    if (userDataLS === null) {
      setIsAuthenticated(false);
    } else {
      userDataLS = JSON.parse(userDataLS);
      userRoleLS = JSON.parse(userRoleLS);
      setIsAuthenticated(true);
      setUserData(userDataLS);
      setUserRole(userRoleLS);
    }
  }, []);

  function login() {
    let userDataLS = localStorage.getItem("user_data");
    let userRoleLS = localStorage.getItem("user_role");
    userDataLS = JSON.parse(userDataLS);
    userRoleLS = JSON.parse(userRoleLS);
    setIsAuthenticated(true);
    setUserData(userDataLS);
    setUserRole(userRoleLS);
  }

  function logout() {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
  }

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = isAuthenticated;
    return isLoggedIn ? (
      <LoginContext.Provider
        value={{ userData, setUserData, userRole, setUserRole }}
      >
        <Layout onLogout={logout}>{children}</Layout>
      </LoginContext.Provider>
    ) : (
      <Navigate replace to="/login" />
    );
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const PatientRoute = ({ children }) => {
    const isPatient = userRole == "patient";
    return isPatient ? children : <Unauthorized />;
  };

  PatientRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const EmployeeRoute = ({ children }) => {
    const isEmployeeOrAdmin = userRole == "employee" || userRole == "admin";
    return isEmployeeOrAdmin ? children : <Unauthorized />;
  };

  EmployeeRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const AdminRoute = ({ children }) => {
    const isAdmin = userRole == "admin";
    return isAdmin ? children : <Unauthorized />;
  };

  AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AlreadyLoggedIn />
              </ProtectedRoute>
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="/registration"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AlreadyLoggedIn />
              </ProtectedRoute>
            ) : (
              <Registration />
            )
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-account"
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-accounts"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserAccounts />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Devices />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Rooms />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/:appointmentId"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <AttendanceRecord />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance-display/:appointmentId"
          element={<AttendanceDisplay />}
        />
        <Route
          path="/patient-preview"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <PatientPreview />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments-preview/:patientId"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <AppointmentsPreview />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deny-appointment/:appointmentId"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <DenyAppointment />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-appointment/:appointmentId"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <ChangeAppointment />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-requests-preview"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <AppointmentRequestsPreview />
              </EmployeeRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-user"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserAdd />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user/:userId"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-room"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <RoomAdd />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-room/:roomId"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <RoomEdit />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-therapies"
          element={
            <ProtectedRoute>
              <PatientRoute>
                <MyTherapies />
              </PatientRoute>
            </ProtectedRoute>
          }
        >
        </ Route>
        <Route
          path="/my-therapies/:therapy_id"
          element={
            <ProtectedRoute>
              <PatientRoute>
                <MyTherapy />
              </PatientRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-therapy"
          element={
            <ProtectedRoute>
              <PatientRoute>
                <CreateTherapy />
              </PatientRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-appointment"
          element={
            <ProtectedRoute>
              <PatientRoute>
                <NewAppointment />
              </PatientRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-display"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <DataPreview/>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
