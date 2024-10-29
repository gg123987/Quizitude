import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./components/Layout/AuthRoute";
import HomePage from "./pages/Home/HomePage";
import PasswordReset from "./pages/Auth/PasswordReset.jsx";
import Register from "./pages/Auth/Register.jsx";
import UpdatePassword from "./pages/Auth/UpdatePassword.jsx";
import Signin from "./pages/Auth/LogIn.jsx";
import Decks from "./pages/AllDecks/AllDecks.jsx";
import Categories from "./pages/Categories/Categories";
import DeckDetail from "./pages/AllDecks/SingleDeck.jsx";
import Profile from "./pages/Settings/Profile.jsx";
import Logout from "./pages/Auth/Logout.jsx";
import StudyMode from "./pages/Study/StudyMode.jsx";
import { ModalProvider } from "./context/ModalContext";

const App = () => {
  return (
    <>
      <ModalProvider>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/decks" element={<Decks />} />
            <Route path="/decks/:id" element={<DeckDetail />} />
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
      </ModalProvider>
    </>
  );
};

export default App;
