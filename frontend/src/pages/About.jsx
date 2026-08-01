import { useEffect, useState } from 'react'
import { getProfile } from '../api'
import './About.css'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError('Could not load profile.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status">Loading...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <div className="about">
      <header className="page-header">
        <span className="section-label">About</span>
        <h1>{profile.name}</h1>
        <p className="page-lead">{profile.headline}</p>
      </header>

      <div className="content-panel">
        <p className="bio">{profile.bio}</p>

        {profile.about_cursor && (
          <section className="about-section">
            <h2>Building with Cursor</h2>
            <p>{profile.about_cursor}</p>
          </section>
        )}

        <section className="about-links">
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
            >
              GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
            >
              LinkedIn
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="button button-secondary">
              Email
            </a>
          )}
        </section>
      </div>
    </div>
  )
}
