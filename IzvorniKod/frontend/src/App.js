import React, {useEffect} from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import '../node_modules/react-toastify/dist/ReactToastify.css';

import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserAdd from "./pages/UserAdd";
import AttendanceRecord from "./pages/AttendanceRecord";
import PatientPreview from "./pages/PatientPreview";

function App() {
  const [auth, setAuth] = React.useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');

    if (userData === null) {
      setAuth(false);
    }
    else{
      setAuth(true);
    }
  }, []);

  function login() {
    setAuth(true);
  }

  function logout() {
    setAuth(false);
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route exact path='/'>
        <Route
          path="/"
          element={<Navigate to={auth ? "/home" : "/login"} replace />}
        />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/attendance" element={<AttendanceRecord />} />
        <Route path="/patientpreview" element={<PatientPreview />} />
        <Route
          path="/home"
          element={auth ? <Home onLogout={logout} /> : <Navigate to="/login" replace />}
        />
        <Route path="/super-secret-route" element={<UserAdd/>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <h1>{auth}</h1>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
