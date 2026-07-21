import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '../api'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProject(slug)
      .then(setProject)
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="status">Loading...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <article className="project-detail">
      <Link to="/projects" className="back-link">
        ← Back to projects
      </Link>

      <div className="badges">
        {project.built_with_cursor && <span className="badge cursor">Cursor</span>}
        {project.hand_coded && <span className="badge hand">Hand-coded</span>}
      </div>

      <h1>{project.name}</h1>
      <p className="short-description">{project.short_description}</p>

      {project.image && (
        <img src={project.image} alt={project.name} className="project-image" />
      )}

      {project.description && <div className="description">{project.description}</div>}

      {project.tech_stack?.length > 0 && (
        <section>
          <h2>Tech stack</h2>
          <ul className="tech-stack">
            {project.tech_stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="links">
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noreferrer">
            Live demo
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
      </div>
    </article>
  )
}
