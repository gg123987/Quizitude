import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '@/utils/supabase';
import './avatar.css'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath); // Notify parent component of the new avatar URL
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleAvatarClick() {
    if (!uploading) {
      document.getElementById('avatar-upload-input').click();
    }
  }

  return (
    <div className="avatar-container" onClick={handleAvatarClick} style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <input
        type="file"
        id="avatar-upload-input"
        accept="image/*"
        onChange={uploadAvatar}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </div>
  );
}

Avatar.propTypes = {
  url: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  onUpload: PropTypes.func.isRequired,
};
