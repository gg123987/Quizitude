import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";
import PropTypes from 'prop-types';
import Avatar from '@/components/features/Profile/Avatar/Avatar'; // Ensure this path is correct
import { supabase } from '@/utils/supabase'
import './generalSettings.css';

const GeneralSettings = ({ user, setEmail, setFullName, avatar_url, setAvatarUrl, updateProfile, isGoogleUser }) => {

  const [showDeletePopup, setShowDeletePopup] = useState(false); // For popup visibility state
  const { passwordReset } = useAuth();
  const [loading, setLoading] = useState(false);
  //const [tempEmail, setTempEmail] = useState(user.email || '');
  //const [tempFullName, setTempFullName] = useState(user.user_metadata.full_name || '');

  
  const handleSaveChanges = (event) => {
    setLoading(true);
    event.preventDefault();

    console.log('new name:', user.user_metadata.tempFullName);
    setLoading(false);
    updateProfile(new Event('submit'));
  }

  const resetPassword = async () => {
    setLoading(true);
    const { error } = await passwordReset(user.tempEmail);
    if (error) {
      console.error('Error sending password reset email:', error.message);
    } else {
      setLoading(false);
      alert('Password reset email sent');
    }
  }

  const handleDeleteAccount = async () => {
    console.log('Deleting account...');
    try{
      const response = await supabase
        .from('users')
        .delete()
        .eq('id', user.userID);

      console.log('Account successfully deleted:', response);
      alert('Account successfully deleted');
      //redirect the user to the login page
      window.location.href = '/login';
      
    } catch(error){
      console.error('Error deleting account:', error.message);
      alert('Failed to delete the account');
    }
  };

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
              //value={tempEmail}
              //onChange={(e) => setTempEmail(e.target.value)}
              value={user.tempEmail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              //value={tempFullName}
              //onChange={(e) => setTempFullName(e.target.value)}
              value={user.user_metadata.tempFullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <button className="save-changes-btn" onClick={handleSaveChanges}>{loading ? 'Loading ...' : 'Save changes'}</button>
        </div>

        <div className="section">
          <h3>Profile Photo</h3>
          <div className="profile-photo-upload">
            <Avatar
              userId={user.userID}
              url={avatar_url}
              size={150}
              onUpload={(filePath) => {
                setAvatarUrl(filePath); // Set the avatar URL when upload is complete
              }}
            />
          </div>
        </div>
        {/* Password Reset Section */}
        {!isGoogleUser && (
          <div className="section password-section">
            <h3>Password Reset</h3>
            <p>To reset your password, click below to receive a reset link to your email.</p>
            <button className="reset-password-btn" onClick={resetPassword}>{loading ? 'Loading ...' : 'Reset Password'}</button>
          </div>
        )}
        
        {/* Delete Account Section */}
        <div className="section">
          <h3>Deactivate your account</h3>
          <button className="delete-account-btn" onClick={() => setShowDeletePopup(true)}>Delete Account</button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Are you sure you want to delete your account?</h4>
            <p>This action cannot be undone.</p>
            <button onClick={handleDeleteAccount} className="confirm-delete-btn">Yes, Delete</button>
            <button onClick={() => setShowDeletePopup(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
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
  updateProfile: PropTypes.func.isRequired,
  isGoogleUser: PropTypes.bool.isRequired,
};

export default GeneralSettings;
