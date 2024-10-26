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

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [full_name, setFullName] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Streak");

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select(`full_name, email, avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setFullName(data.full_name);
          setEmail(data.email);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session, user]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      full_name,
      email,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <div className="profile-container">
      <div>
        <form onSubmit={updateProfile} className="form-widget">
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(filePath) => {
              setAvatarUrl(filePath); // Set the avatar URL when upload is complete
            }}
          />
          <div className="form-fields">
            <div className="form-field">
              <strong>
                <p id="full_name">{user.user_metadata.full_name || ""}</p>
              </strong>
            </div>
            <div className="form-field">
              <p id="email">{user.email || ""}</p>
            </div>
          </div>
          <div className="upload-button-container">
            <button
              className="button block primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading ..." : "Edit Profile"}
            </button>
          </div>
        </form>
        <SettingsNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {activeTab === "General Settings" && (
        <GeneralSettings
          user={{ email, user_metadata: { full_name } }}
          setEmail={setEmail}
          setFullName={setFullName}
          avatar_url={avatar_url}
          setAvatarUrl={setAvatarUrl}
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
