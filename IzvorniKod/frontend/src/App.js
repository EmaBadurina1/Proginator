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

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [userRole, setUserRole] = React.useState(null);

  useEffect(() => {
    let userData = localStorage.getItem("user_data");

    if (userData === null) {
      setIsAuthenticated(false);
    } else {
      userData = JSON.parse(userData);
      let userRole = Object.keys(userData)[0];
      if (userRole == "employee" && userData.employee.is_admin) {
        userRole = "admin";
      }
      setIsAuthenticated(true);
      setUserRole(userRole);
    }
  }, []);

  function login() {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    let userRole = Object.keys(userData)[0];
    if (userRole == "employee" && userData.employee.is_admin) {
      userRole = "admin";
    }
    setIsAuthenticated(true);
    setUserRole(userRole);
  }

  function logout() {
    setIsAuthenticated(false);
    setUserRole(null);
  }

  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = isAuthenticated;
    return isLoggedIn ? (
      <Layout>
        {children}
      </Layout>
    ) : <Navigate replace to="/login" />;
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
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
        />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <EmployeeRoute>
                <AttendanceRecord />
              </EmployeeRoute>
            </ProtectedRoute>
          }
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
          path="/home"
          element={
            <ProtectedRoute>
              <Home onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserAdd />
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
