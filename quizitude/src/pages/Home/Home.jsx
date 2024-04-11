import "./home.css"
import { useAuth } from "../../context/AuthProvider";

export const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ fontSize: "24px" }}>
      You are logged in and your email address is {user.email}
    </div>
  );
};

export default Home;
