import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getProjects } from '../api'
import MarkdownContent from '../components/MarkdownContent'
import ProjectCardScroller from '../components/ProjectCardScroller'
import './Home.css'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.body.classList.add('page--card-scroll')
    return () => document.body.classList.remove('page--card-scroll')
  }, [])

  useEffect(() => {
    Promise.all([getProfile(), getProjects({ featured: true })])
      .then(([profileData, projectData]) => {
        setProfile(profileData)
        setProjects(projectData)
      })
      .catch(() => setError('Could not load portfolio data. Is the Django API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status home-status">Loading...</p>
  if (error) return <p className="status error home-status">{error}</p>

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="section-label">Portfolio</span>
            <h1>{profile?.name ?? 'Developer'}</h1>
            <p className="headline">{profile?.headline}</p>
            <MarkdownContent content={profile?.bio} className="bio" />
            <div className="hero-actions">
              <Link to="/projects" className="button button-primary">
                View all projects
              </Link>
              <Link to="/resume" className="button button-secondary">
                Resume
              </Link>
            </div>
          </div>

          <aside className="hero-connect" aria-label="Quick links">
            <div className="hero-panel">
              <p className="hero-panel-title">Connect</p>
              <ul className="hero-panel-links">
                {profile?.github_url && (
                  <li>
                    <a href={profile.github_url} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </li>
                )}
                {profile?.linkedin_url && (
                  <li>
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </li>
                )}
                {profile?.email && (
                  <li>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </li>
                )}
              </ul>
              <p className="hero-panel-note">
                Featured work below — scroll to explore.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <div>
            <span className="section-label">Selected work</span>
            <h2>Featured projects</h2>
          </div>
          <p className="featured-hint">Scroll · ↑ ↓</p>
        </div>

        {projects.length > 0 ? (
          <ProjectCardScroller projects={projects} />
        ) : (
          <p className="status featured-empty">
            No featured projects yet. Add some in Django Admin.
          </p>
        )}
      </section>
    </div>
  )
}
