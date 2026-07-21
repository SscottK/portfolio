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
  return (
    <article className="project-card">
      <div className="project-card-body">
        <ProjectBadges project={project} />
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.name}</Link>
        </h3>
        <p>{project.short_description}</p>
        {project.tech_stack?.length > 0 && (
          <ul className="tech-stack">
            {project.tech_stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="project-card-links">
        <Link to={`/projects/${project.slug}`}>Details</Link>
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
