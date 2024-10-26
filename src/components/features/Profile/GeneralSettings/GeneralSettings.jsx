import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import PropTypes from "prop-types";
import Avatar from "@/components/features/Profile/Avatar/Avatar"; // Ensure this path is correct
import { supabase } from "@/utils/supabase";
import ProVersion from "@/components/features/Payment/ProVersion/ProVersion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./generalSettings.css";

const GeneralSettings = ({
  user,
  setEmail,
  setFullName,
  avatar_url,
  setAvatarUrl,
  updateProfile,
  isGoogleUser,
}) => {
  const [showProVersion, setShowProVersion] = useState(false); // State to control ProVersion visibility

  const handleUpgradeClick = () => {
    setShowProVersion(true); // Set state to show ProVersion
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false); // For popup visibility state
  const { passwordReset } = useAuth();
  const [loading, setLoading] = useState(false);
  //const [tempEmail, setTempEmail] = useState(user.email || '');
  //const [tempFullName, setTempFullName] = useState(user.user_metadata.full_name || '');

  const handleSaveChanges = (event) => {
    setLoading(true);
    event.preventDefault();

    console.log("new name:", user.user_metadata.tempFullName);
    setLoading(false);
    updateProfile(new Event("submit"));
  };

  const resetPassword = async () => {
    setLoading(true);
    const { error } = await passwordReset(user.tempEmail);
    if (error) {
      console.error("Error sending password reset email:", error.message);
    } else {
      setLoading(false);
      alert("Password reset email sent");
    }
  };

  const handleDeleteAccount = async () => {
    console.log("Deleting account...");
    try {
      const response = await supabase
        .from("users")
        .delete()
        .eq("id", user.userID);

      console.log("Account successfully deleted:", response);
      alert("Account successfully deleted");
      //redirect the user to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error.message);
      alert("Failed to delete the account");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="section">
          <h4 className="left-aligned">General Settings</h4>
        </div>

        <div className="section">
          <h6 className="left-aligned">Upgrade your Account</h6>
          <div className="box">
            <div className="text">
              <strong>
                <p>You are on a free plan</p>
              </strong>
              <p>Upgrade to our premium plan to enjoy more features</p>
            </div>
            <div className="upgrade-button">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3538cd",
                }}
                onClick={handleUpgradeClick}
              >
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>

        <div className="section">
          <h6 className="left-aligned">Profile</h6>
          <p className="left-aligned">
            Update your profile and personal details
          </p>
          <TextField
            id="email-address"
            label="Email address"
            variant="outlined"
            type="email"
            value={user.tempEmail}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            id="full-name"
            label="Full name"
            variant="outlined"
            type="text"
            value={user.user_metadata.tempFullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              color: "black",
              marginRight: "1rem",
              ":hover": {
                backgroundColor: "#e0e0e0e0",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            sx={{
              backgroundColor: "#3538cd",
            }}
          >
            {loading ? "Loading ..." : "Save changes"}
          </Button>
        </div>

        <div className="section">
          <h6 className="left-aligned">Profile Photo</h6>
          <p className="left-aligned">Update your profile photo</p>
          <Avatar
            userId={user.userID}
            url={avatar_url}
            size={150}
            onUpload={(filePath) => {
              setAvatarUrl(filePath); // Set the avatar URL when upload is complete
            }}
          />
        </div>
        {/* Password Reset Section */}
        {!isGoogleUser && (
          <div className="section">
            <h6 className="left-aligned">Password Reset</h6>
            <p className="left-aligned">
              To reset your password, click below to receive a reset link to
              your email.
            </p>
            <Button
              variant="contained"
              onClick={resetPassword}
              sx={{
                backgroundColor: "#3538cd",
              }}
            >
              {loading ? "Loading ..." : "Reset Password"}
            </Button>
          </div>
        )}

        {/* Delete Account Section */}
        <div className="section">
          <h6 className="left-aligned">Deactivate your account</h6>
          <div className="box">
            <p className="text">You will lose access to all your information</p>
            <Button
              variant="contained"
              onClick={() => setShowDeletePopup(true)}
              sx={{
                backgroundColor: "#b32318",
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Are you sure you want to delete your account?</h4>
            <p>This action cannot be undone.</p>
            <button
              onClick={handleDeleteAccount}
              className="confirm-delete-btn"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pro Version Popup */}
      {showProVersion && <ProVersion setShowProVersion={setShowProVersion} />}
    </div>
  );
};

GeneralSettings.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    user_metadata: PropTypes.shape({
      full_name: PropTypes.string,
    }),
  }).isRequired,
  setEmail: PropTypes.func.isRequired,
  setFullName: PropTypes.func.isRequired,
  avatar_url: PropTypes.string,
  setAvatarUrl: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  isGoogleUser: PropTypes.bool.isRequired,
};

export default GeneralSettings;
