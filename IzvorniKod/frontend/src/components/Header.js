import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Container from "@mui/material/Container";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import PropTypes from 'prop-types';
import { LoginContext } from "../contexts/LoginContext";


const pagesPatient = ["Moje terapije"];
const pagesEmployee = ["Pacijenti", "Evidentiraj"];
const pagesAdmin = ["Pacijenti", "Evidentiraj", "Inventar", "Prostorije", "Korisnički računi"];

const routes = {
  "Prijava": "/login",
  "Registracija": "/registration",
  "Korisnički račun": "/user-account",
  "Promjena lozinke": "/change-password",
  "Početna": "/home",
  "Pacijenti": "/patient-preview",
  "Evidentiraj": "/appointment-requests-preview",
  "Korisnički računi": "/user-accounts",
  "Dodavanje korisnika": "/new-user",
  "Moje terapije": "/my-therapies",
  "Nova terapija": "/create-therapy",
  "Inventar": "/devices",
  "Prostorije": "/rooms",
}

const Header = ({ onLogout }) => {
  const { userRole } = React.useContext(LoginContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const nav = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateToPage = (page) => {
    nav(routes[page]);
    handleCloseNavMenu();
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    AuthService.logout().then(() => {
      onLogout();
      nav("/login");
    });
  }

  const handleUserAccount = (e) => {
    e.preventDefault();

    nav("/user-account");
    handleCloseUserMenu();
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccessibleForwardIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            REH_APP
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {userRole === "patient" && 
                pagesPatient.map((page) => (
                  <MenuItem key={page} onClick={() => navigateToPage(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                {userRole === "employee" && 
                pagesEmployee.map((page) => (
                  <MenuItem key={page} onClick={() => navigateToPage(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                {userRole === "admin" && 
                pagesAdmin.map((page) => (
                  <MenuItem key={page} onClick={() => navigateToPage(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
          
            </Menu>
          </Box>
          <AccessibleForwardIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            REH_APP
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {userRole == "patient" && pagesPatient.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                sx={{ mx: 2, my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
            {userRole == "employee" && pagesEmployee.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                sx={{ mx: 2, my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
            {userRole == "admin" && pagesAdmin.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                sx={{ mx: 2, my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Opcije">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0,
                  backgroundColor: "white", // This sets the background color to white
                  "&:hover": {
                    backgroundColor: "darkgrey", // Optional: change color on hover
                  },
                }}
              >
                <AccountCircleIcon fontSize="large"></AccountCircleIcon>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="userAccount" onClick={handleUserAccount}>
                <Typography textAlign="center">Korisnički račun</Typography>
              </MenuItem>
              <MenuItem key="logout" onClick={handleLogout}>
                <Typography textAlign="center" color="red">
                  Odjavi se <LogoutIcon sx={{ color: "red", mx: 2 }}></LogoutIcon>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

Header.propTypes = {
  onLogout: PropTypes.func,
};

export default Header;
