import React from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const [auth, setAuth] = React.useState(false);

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
        <Route
          path="/home"
          element={auth ? <Home onLogout={logout} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
