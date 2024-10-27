import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/utils/supabase";
import Avatar from "@/components/features/Profile/Avatar/Avatar";
import PropTypes from "prop-types";
import "./profile.css";
import CustomButton from "@/components/common/CustomButton";
import SettingsNavbar from "@/components/features/Profile/SettingsNavbar/SettingsNavbar";
import GeneralSettings from "@/components/features/Profile/GeneralSettings/GeneralSettings";
import Streak from "@/components/features/Profile/Streak/Streak";
import ViewScoreHistory from "@/components/features/Profile/ViewScoreHistory/ViewScoreHistory";
import PDFUploads from "@/components/features/Profile/PDFUploads/PDFUpload";
import useFetchUser from "@/hooks/useFetchUser";

/**
 * Account component for managing user profile settings.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.session - The current user session.
 *
 * @returns {JSX.Element} The rendered Account component.
 *
 * @example
 * <Account session={session} />
 *
 * @description
 * This component fetches and displays the user's profile information, including full name, email, and avatar URL.
 * It allows the user to update their profile information and avatar. The component also includes navigation tabs
 * for different settings sections such as "General Settings", "Streak", "View Score History", and "PDF Uploads".
 *
 * @param {Object} session - The current user session.
 *
 * @property {boolean} loading - Indicates if the profile data is being loaded.
 * @property {string|null} full_name - The user's full name.
 * @property {string|null} email - The user's email address.
 * @property {string|null} avatar_url - The URL of the user's avatar.
 * @property {Object} user - The authenticated user object from useAuth.
 * @property {string} activeTab - The currently active settings tab.
 * @property {string} userID - The ID of the authenticated user.
 * @property {Object} userData - The fetched user data.
 * @property {boolean} userLoading - Indicates if the user data is being loaded.
 * @property {Object|null} userError - Error object if there was an error fetching user data.
 * @property {string} tempFullName - Temporary state for the user's full name during editing.
 * @property {string} tempEmail - Temporary state for the user's email during editing.
 * @property {boolean} isGoogleUser - Indicates if the user signed in with Google.
 *
 * @method
 * @name getProfile
 * @description Fetches the user's profile data and updates the state.
 *
 * @method
 * @name updateProfile
 * @description Updates the user's profile information in the authentication and database.
 * @param {Event} event - The form submission event.
 *
 * @method
 * @name updateAvatarUrl
 * @description Updates the user's avatar URL in the database.
 * @param {Event} event - The form submission event.
 * @param {string} avatarUrl - The new avatar URL.
 */

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [full_name, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Streak");
  const userID = user.id;
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetchUser(userID);
  const [tempFullName, setTempFullName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      setLoading(true);
      console.log("userData in here", userData);
      console.log("user from useAuth", user);

      // Check if the user is loaded and the user data is fetched
      if (!ignore && !userLoading && userData) {
        if (full_name !== userData.full_name) {
          setFullName(userData.full_name);
          setTempFullName(userData.full_name);
        }

        if (email !== userData.email) {
          setEmail(userData.email);
          setTempEmail(userData.email);
        }

        if (avatar_url !== userData.avatar_url) {
          setAvatarUrl(userData.avatar_url);
        }

        if (user.app_metadata.provider === "google") {
          setIsGoogleUser(true);
        }
      }
      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session, user, userData, userLoading, userError]);

  async function updateProfile(event) {
    event.preventDefault();

    setLoading(true);

    //update the full_name and email in auth using the temp values
    const { user, error } = await supabase.auth.updateUser({
      data: { full_name: tempFullName },
    });
    if (error) {
      alert("Error updating name: " + error.message);
    } else {
      //reload the user data from the users table
      setFullName(tempFullName);
    }

    //then update the email in supabase auth using updateUser()
    const { user2, error2 } = await supabase.auth.updateUser({
      email: tempEmail,
    });
    if (error2) {
      alert("Error updating email: " + error2.message);
    } else if (tempEmail !== email) {
      alert(
        "Email address will only be updated once the verification email is confirmed"
      );
      setTempEmail(email);
    }

    setLoading(false);
  }

  //create a new async function to update the users avatar_url which only needs to be updated in the users table
  async function updateAvatarUrl(event, avatarUrl) {
    console.log("in here updating avatar url in db");
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .upsert({ id: userID, avatar_url: avatarUrl });
    if (error) {
      alert("Error updating avatar: " + error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <div className="profile-container">
      <div>
        <div className="profile-header">
          <form onSubmit={updateAvatarUrl} className="form-widget">
            <Avatar
              userId={userID}
              url={avatar_url}
              size={100}
              onUpload={(filePath) => {
                setAvatarUrl(filePath);
                updateAvatarUrl(new Event("submit"), filePath);
              }}
            />

            <div className="form-fields">
              <div className="form-field">
                <p id="full_name">{full_name || ""}</p>
              </div>
              <div className="form-field">
                <p id="email">{email || ""}</p>
              </div>
            </div>
            <div className="upload-button-container">
              <CustomButton
                disabled={loading}
                onClick={() => setActiveTab("General Settings")}
                style={{
                  color: "#3538CD",
                  backgroundColor: "transparent",
                  width: "120px",
                  border: "1.4px solid #3538CD",
                }}
              >
                {loading ? "Loading ..." : "Edit Profile"}
              </CustomButton>
            </div>
          </form>
        </div>
        <SettingsNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {activeTab === "General Settings" && (
        <GeneralSettings
          user={{ userID, tempEmail, user_metadata: { tempFullName } }}
          setEmail={setTempEmail}
          setFullName={setTempFullName}
          avatar_url={avatar_url}
          setAvatarUrl={setAvatarUrl}
          updateProfile={updateProfile}
          isGoogleUser={isGoogleUser}
        />
      )}
      {activeTab === "Streak" && <Streak />}
      {activeTab === "View Score History" && <ViewScoreHistory />}
      {activeTab === "PDF Uploads" && <PDFUploads />}
    </div>
  );
}

Account.propTypes = {
  session: PropTypes.object,
};
