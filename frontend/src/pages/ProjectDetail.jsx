import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectGallery from '../components/ProjectGallery'
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

  const hasGallery = project.gallery?.length > 0
  const hasHeroImage = Boolean(project.image)
  const hasMedia = hasGallery || hasHeroImage

  const detailBody = (
    <div className="content-panel detail-body">
      {project.description && (
        <div className="description">{project.description}</div>
      )}

      {project.tech_stack?.length > 0 && (
        <section className="detail-section">
          <h2>Tech stack</h2>
          <ul className="tech-stack">
            {project.tech_stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="detail-links">
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noreferrer"
            className="button button-primary"
          >
            Live demo
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="button button-secondary"
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  )

  return (
    <article className="project-detail">
      <Link to="/projects" className="back-link">
        ← All projects
      </Link>

      <header className="detail-header">
        <div className="badges">
          {project.built_with_cursor && <span className="badge cursor">Cursor</span>}
          {project.hand_coded && <span className="badge hand">Hand-coded</span>}
        </div>
        <h1>{project.name}</h1>
        <p className="short-description">{project.short_description}</p>
      </header>

      {hasMedia ? (
        <div className="detail-showcase">
          <ProjectGallery
            gallery={project.gallery}
            projectName={project.name}
            heroImage={hasGallery ? null : project.image}
          />
          {detailBody}
        </div>
      ) : (
        detailBody
      )}
    </article>
  )
}
