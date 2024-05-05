import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabase/supabaseClient";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import NavBar from "./components/NavBar";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import UpdatePassword from "./pages/UpdatePassword";

import Signin from "./pages/SignInSide";
import Decks from "./pages/Decks/Decks.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/decks" element={<Decks />} />
      </Routes>
    </>
  );
};

export default App;
