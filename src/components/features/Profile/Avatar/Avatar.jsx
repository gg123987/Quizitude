import { useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { supabase } from "@/utils/supabase";
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
 * @function
 * @name Avatar
 */
export default function Avatar({ userId, url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(url);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true); // New state to manage loading

  useEffect(() => {
    if (url) {
      downloadImage(url); // attempt to download from storage
    } else {
      console.log("url is null");
      setAvatarUrl(null);
      setLoading(false); // Mark loading as done
    }
  }, [url]);

  async function downloadImage(path) {
    try {
      setLoading(true); // Mark loading as in progress
      const { data, error } = await supabase.storage
        .from("files")
        .download(path);
      if (error) {
        throw error;
      }
      const downloadedUrl = URL.createObjectURL(data);
      setAvatarUrl(downloadedUrl);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    } finally {
      setLoading(false); // Mark loading as done once download is complete
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);
      console.log("Uploading new avatar...");
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/avatars/${fileName}`; // Use userId as the top-level folder

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath); // Notify parent component of the new avatar URL
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
      console.log("Avatar update complete");
    }
  }

  function handleAvatarClick() {
    if (!uploading) {
      document.getElementById("avatar-upload-input").click();
    }
  }

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
          <span>Loading...</span> {/* Display loading message */}
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
          <span>Click here to set up avatar</span>{" "}
          {/* This only shows if there's no avatar */}
        </div>
      )}
      <input
        type="file"
        id="avatar-upload-input"
        accept="image/*"
        onChange={uploadAvatar}
        style={{ display: "none" }}
        disabled={uploading}
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
