import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import NavBar from "../components/NavBar"; // Import NavBar component

const AuthRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // Check if the current path is a login or register page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {/* Render NavBar if the user is authenticated */}
      {auth && <NavBar />}
      
      {/* Redirect to login page if not authenticated and not on the login/register page */}
      {!auth && !isAuthPage && <Navigate to={"/login"} replace state={{ path: location.pathname }} />}
    </>
  );
};

export default AuthRoute;