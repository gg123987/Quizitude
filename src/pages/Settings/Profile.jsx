import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/utils/supabase";
import Avatar from "@/components/features/Profile/Avatar/Avatar";
import PropTypes from "prop-types";
import "./profile.css";
import SettingsNavbar from "@/components/features/Profile/SettingsNavbar/SettingsNavbar";
import GeneralSettings from "@/components/features/Profile/GeneralSettings/GeneralSettings";
import Streak from "@/components/features/Profile/Streak/Streak";
import ViewScoreHistory from "@/components/features/Profile/ViewScoreHistory/ViewScoreHistory";
import PDFUploads from "@/components/features/Profile/PDFUploads/PDFUpload";
import useFetchUser from "@/hooks/useFetchUser";

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
        <form onSubmit={updateAvatarUrl} className="form-widget">
          <Avatar
            userId={userID}
            url={avatar_url}
            size={150}
            onUpload={(filePath) => {
              setAvatarUrl(filePath);
              updateAvatarUrl(new Event("submit"), filePath);
            }}
          />

          <div className="form-fields">
            <div className="form-field">
              <strong>
                <p id="full_name">{full_name || ""}</p>
              </strong>
            </div>
            <div className="form-field">
              <p id="email">{email || ""}</p>
            </div>
          </div>
          <div className="upload-button-container">
            <button
              className="button block primary"
              type="button"
              disabled={loading}
              onClick={() => setActiveTab("General Settings")}
            >
              {loading ? "Loading ..." : "Edit Profile"}
            </button>
          </div>
        </form>
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
