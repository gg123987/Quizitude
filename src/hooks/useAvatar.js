import { useEffect, useState } from "react";
import {
  downloadAvatarImage,
  uploadAvatarImage,
} from "@/services/avatarService";

const useAvatar = (userId, url, onUpload) => {
  const [avatarUrl, setAvatarUrl] = useState(url);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      setLoading(true);
      downloadAvatarImage(url)
        .then(setAvatarUrl)
        .catch(() => setAvatarUrl(null))
        .finally(() => setLoading(false));
    } else {
      setAvatarUrl(null);
      setLoading(false);
    }
  }, [url]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const filePath = await uploadAvatarImage(userId, file);
      onUpload(filePath); // Update parent component with new path
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return { avatarUrl, loading, uploading, handleUpload };
};

export default useAvatar;
