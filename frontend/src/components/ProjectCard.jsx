import { Link } from 'react-router-dom'
import './ProjectCard.css'

function ProjectBadges({ project }) {
  return (
    <div className="badges">
      {project.built_with_cursor && <span className="badge cursor">Cursor</span>}
      {project.hand_coded && <span className="badge hand">Hand-coded</span>}
      {project.featured && <span className="badge featured">Featured</span>}
    </div>
  )
}

export default function ProjectCard({ project }) {
  const detailPath = `/projects/${project.slug}`

  return (
    <article className="project-card">
      <Link to={detailPath} className="project-card-main">
        {project.image && (
          <div className="project-card-image-wrap">
            <img src={project.image} alt="" className="project-card-image" />
          </div>
        )}
        <div className="project-card-body">
          <ProjectBadges project={project} />
          <h3>{project.name}</h3>
          <p>{project.short_description}</p>
          {project.tech_stack?.length > 0 && (
            <ul className="tech-stack">
              {project.tech_stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          )}
        </div>
        <span className="project-card-cta">View project →</span>
      </Link>

      {(project.demo_url || project.github_url) && (
        <div className="project-card-links">
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
      )}
    </article>
  )
}
