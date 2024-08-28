import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ResponsiveDrawer from "@/components/Layout/Sidebar/Drawer";

const AuthRoute = () => {
  const { auth, user } = useAuth();
  const location = useLocation();
  const userId = user?.id;

  // Check if the current path is a login or register page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  // Check if the current path is for the StudyMode page
  const isStudyModePage = location.pathname === "/study";

  return (
    <>
      {/* Show the sidebar if authenticated and not on the StudyMode page */}
      {auth && !isStudyModePage && (
        <ResponsiveDrawer>
          <Outlet context={{ userId }} />
        </ResponsiveDrawer>
      )}

      {/* Redirect to login page if not authenticated and not on the login/register page */}
      {!auth && !isAuthPage && <Navigate to={"/login"} replace state={{ path: location.pathname }} />}
      {/* Render the Outlet if not on the StudyMode page */}
      {auth && isStudyModePage && <Outlet context={{ userId }} />}
    </>
  );
};

export default AuthRoute;