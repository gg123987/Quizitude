import PropTypes from 'prop-types';
import Avatar from '@/components/features/Profile/Avatar/Avatar'; // Ensure this path is correct
import './generalSettings.css';

const GeneralSettings = ({ user, setEmail, setFullName, avatar_url, setAvatarUrl }) => {
  console.log('GeneralSettings Props:', { user, setEmail, setFullName, avatar_url }); // Debugging line

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h4>General Settings</h4>

        <div className="section">
          <p>Upgrade your account</p>
          <div className="upgrade-box">
            <div className="upgrade-text">
              <strong><p>You are on a free plan</p></strong>
              <p>Upgrade to our premium plan to enjoy more features</p>
            </div>
            <div className="upgrade-button">
              <button className="upgrade-btn">Upgrade Plan</button>
            </div>
          </div>
        </div>

        <div className="section profile-section">
          <h3>Profile</h3>
          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              value={user.email || ''}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={user.user_metadata.full_name || ''}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <button className="save-changes-btn">Save changes</button>
        </div>

        <div className="section">
          <h3>Profile Photo</h3>
          <div className="profile-photo-upload">
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(filePath) => {
                setAvatarUrl(filePath); // Set the avatar URL when upload is complete
              }}
            />
          </div>
        </div>

        <div className="section password-section">
          <h3>Password</h3>
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" />
          </div>
          <button className="update-password-btn">Update Password</button>
        </div>

        <div className="section">
          <h3>Deactivate your account</h3>
          <button className="delete-account-btn">Delete Account</button>
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
