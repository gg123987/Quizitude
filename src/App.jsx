import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/common/AuthRoute";
import HomePage from "./pages/Home/HomePage";
import PasswordReset from "./pages/Auth/PasswordReset.jsx";
import Register from "./pages/Auth/Register.jsx";
import UpdatePassword from "./pages/Auth/UpdatePassword.jsx";
import Signin from "./pages/Auth/LogIn.jsx";
import Decks from "./pages/Decks/Decks.jsx";
import Categories from "./pages/Categories/Categories";
import Profile from "./pages/Settings/Profile.jsx";
import Logout from "./pages/Auth/Logout.jsx";
import StudyMode from "./pages/Study/StudyMode.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/study" element={<StudyMode />} />
      </Routes>
    </>
  );
};

export default App;
