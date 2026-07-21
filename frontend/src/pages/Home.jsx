import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getProjects } from '../api'
import ProjectCard from '../components/ProjectCard'
import './Home.css'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProfile(), getProjects({ featured: true })])
      .then(([profileData, projectData]) => {
        setProfile(profileData)
        setProjects(projectData)
      })
      .catch(() => setError('Could not load portfolio data. Is the Django API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status">Loading...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Portfolio</p>
        <h1>{profile?.name ?? 'Developer'}</h1>
        <p className="headline">{profile?.headline}</p>
        <p className="bio">{profile?.bio}</p>
        <Link to="/projects" className="button">
          View all projects
        </Link>
      </section>

      <section>
        <div className="section-header">
          <h2>Featured projects</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {projects.length === 0 && (
          <p className="status">No featured projects yet. Add some in Django Admin.</p>
        )}
      </section>
    </div>
  )
}
