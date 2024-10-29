import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ResponsiveDrawer from "@/components/Layout/Sidebar/Drawer";

/**
 * AuthRoute component is responsible for handling route-based authentication and conditional rendering.
 *
 * This component performs the following:
 * - Checks if the user is authenticated using the `useAuth` hook.
 * - Determines the current location using the `useLocation` hook.
 * - Checks if the current path is a login or register page.
 * - Checks if the current path is for the StudyMode page.
 *
 * The component renders different elements based on the authentication status and the current path:
 * - If the user is authenticated and not on the StudyMode page, it renders the `ResponsiveDrawer` component with an `Outlet` for nested routes.
 * - If the user is not authenticated and not on the login/register page, it redirects to the login page.
 * - If the user is authenticated and on the StudyMode page, it renders the `Outlet` for nested routes.
 *
 * @component
 * @returns {JSX.Element} The rendered component based on the authentication status and current path.
 */
const AuthRoute = () => {
  const { auth, user } = useAuth();
  const location = useLocation();
  const userId = user?.id;

  console.log("auth", auth);
  console.log("location", location);
  console.log("user", user);

  // Check if the current path is a login or register page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
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
      {!auth && !isAuthPage && (
        <Navigate to={"/login"} replace state={{ path: location.pathname }} />
      )}
      {/* Render the Outlet if not on the StudyMode page */}
      {auth && isStudyModePage && <Outlet context={{ userId }} />}
    </>
  );
};

export default AuthRoute;
