import PropTypes from "prop-types";
import { useState } from "react";
import Avatar from "@/components/features/Profile/Avatar/Avatar";
import "./generalSettings.css";
import ProVersion from "@/components/features/Payment/ProVersion/ProVersion";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const GeneralSettings = ({
  user,
  setEmail,
  setFullName,
  avatar_url,
  setAvatarUrl,
}) => {
  const [showProVersion, setShowProVersion] = useState(false); // State to control ProVersion visibility

  const handleUpgradeClick = () => {
    setShowProVersion(true); // Set state to show ProVersion
  };

  if (showProVersion) {
    return <ProVersion setShowProVersion={setShowProVersion} />; // Return ProVersion component if showProVersion is true
  }

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
            value={user.email || ""}
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
            value={user.user_metadata.full_name || ""}
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
            sx={{
              backgroundColor: "#3538cd",
            }}
          >
            Save Changes
          </Button>
        </div>

        <div className="section">
          <h6 className="left-aligned">Profile Photo</h6>
          <p className="left-aligned">Update your profile photo</p>
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(filePath) => {
              setAvatarUrl(filePath); // Set the avatar URL when upload is complete
            }}
          />
        </div>

        <div className="section">
          <h6 className="left-aligned">Password</h6>
          <p className="left-aligned">Update your password</p>
          <TextField
            id="current-password"
            label="Current Password"
            type="password"
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            id="new-password"
            label="New Password"
            type="password"
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
          <p className="left-aligned">
            Your new password must be more than 8 characters.
          </p>
          <TextField
            id="confirm-password"
            label="Confirm Password"
            type="password"
            fullWidth
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
            sx={{
              backgroundColor: "#3538cd",
            }}
          >
            Update Password
          </Button>
        </div>

        <div className="section">
          <h6 className="left-aligned">Deactivate your account</h6>
          <div className="box">
            <p className="text">You will lose access to all your information</p>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#b32318",
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
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
  avatar_url: PropTypes.string.isRequired,
  setAvatarUrl: PropTypes.func.isRequired,
};

export default GeneralSettings;
