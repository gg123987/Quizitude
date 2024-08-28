import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import { supabase } from '@/utils/supabase'
import Avatar from '@/components/features/Profile/Avatar'
import PropTypes from 'prop-types';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [full_name, setFullName] = useState(null)
  const [email, setEmail] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const { user } = useAuth();

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      console.log(user)

      const { data, error } = await supabase
        .from('users')
        .select(`full_name, email, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setFullName(data.full_name)
          setEmail(data.email)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session, user])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      full_name,
      email,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className="form-widget">
        <Avatar
        url={avatar_url}
        size={150}
        onUpload={(event, url) => {
            updateProfile(event, url)
        }}
        />
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={user.email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          type="text"
          required
          value={user.user_metadata.full_name || ''}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
    </form>
  )
}

Account.propTypes = {
  session: PropTypes.object,
};