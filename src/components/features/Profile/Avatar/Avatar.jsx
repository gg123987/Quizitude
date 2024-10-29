import PropTypes from "prop-types";
import useAvatar from "@/hooks/useAvatar";
import { CircularProgress } from "@mui/material";
import "./avatar.css";

/**
 * Avatar component for displaying and uploading user avatars.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.url - The URL of the current avatar image.
 * @param {number|string} props.size - The size of the avatar image.
 * @param {function} props.onUpload - Callback function to handle avatar upload.
 *
 * @example
 * <Avatar userId="123" url="https://example.com/avatar.jpg" size={100} onUpload={handleUpload} />
 *
 * @returns {JSX.Element} The Avatar component.
 *
 * @description
 * This component displays a user's avatar and allows the user to upload a new avatar image.
 * It handles image downloading from a storage service and manages loading and uploading states.
 *
 */
export default function Avatar({ userId, url, size, onUpload }) {
  const { avatarUrl, loading, uploading, handleUpload } = useAvatar(
    userId,
    url,
    onUpload
  );

  const handleAvatarClick = () => {
    if (!uploading) {
      document.getElementById("avatar-upload-input").click();
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div
      className="avatar-container"
      onClick={handleAvatarClick}
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
    >
      {loading ? (
        <div
          className="avatar loading"
          style={{
            height: size,
            width: size,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={size / 2} color="inherit" />
        </div>
      ) : avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{
            height: size,
            width: size,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Click here to set up avatar</span>
        </div>
      )}
      <input
        type="file"
        id="avatar-upload-input"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
        disabled={uploading}
        aria-label="Avatar Upload Input"
      />
    </div>
  );
}

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  url: PropTypes.string,
  size: PropTypes.number.isRequired,
  onUpload: PropTypes.func.isRequired,
};
