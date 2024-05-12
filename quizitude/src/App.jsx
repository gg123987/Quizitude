import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import Home from "./pages/Home/Home.jsx";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import UpdatePassword from "./pages/UpdatePassword";
import Signin from "./pages/LogIn";
import Decks from "./pages/Decks/Decks.jsx";
import Categories from "./pages/Categories/Categories";

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
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </>
  );
};

export default App;
