import { useEffect, useState } from 'react'
import { getResume } from '../api'
import './Resume.css'

function BulletList({ items }) {
  if (!items?.length) return null

  return (
    <ul className="resume-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function Resume() {
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResume()
      .then(setResume)
      .catch(() => setError('Could not load resume.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status">Loading...</p>
  if (error) return <p className="status error">{error}</p>

  return (
    <div className="resume">
      <header className="resume-header">
        <span className="section-label">Resume</span>
        <h1>{resume.name}</h1>
        <div className="resume-contact">
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          {resume.phone && <span>{resume.phone}</span>}
          {resume.linkedin_url && (
            <a href={resume.linkedin_url} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {resume.github_url && (
            <a href={resume.github_url} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </header>

      <section>
        <h2>Summary</h2>
        <p>{resume.summary}</p>
      </section>

      <section>
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          {resume.skills.map((category) => (
            <div key={category.name} className="skill-category">
              <h3>{category.name}</h3>
              <p>{category.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Education & Training</h2>
        <div className="resume-entries">
          {resume.education.map((entry) => (
            <article key={`${entry.institution}-${entry.program}`} className="resume-entry">
              <div className="entry-heading">
                <h3>{entry.institution}</h3>
                <p className="entry-subtitle">{entry.program}</p>
              </div>
              <BulletList items={entry.bullets} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Projects</h2>
        <div className="resume-entries">
          {resume.projects.map((project) => (
            <article key={project.name} className="resume-entry">
              <div className="project-heading">
                <h3>
                  {project.github_url ? (
                    <a href={project.github_url} target="_blank" rel="noreferrer">
                      {project.name}
                    </a>
                  ) : (
                    project.name
                  )}
                </h3>
                <div className="project-links">
                  {project.built_with_cursor && (
                    <span className="badge cursor">Built with Cursor</span>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noreferrer">
                      Live demo{project.access_note ? '*' : ''}
                    </a>
                  )}
                </div>
              </div>
              {project.access_note && (
                <p className="access-note">*{project.access_note}</p>
              )}
              {project.tech_stack?.length > 0 && (
                <p className="entry-meta">
                  <strong>Tech stack:</strong> {project.tech_stack.join(', ')}
                </p>
              )}
              <BulletList items={project.bullets} />
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Experience</h2>
        <div className="resume-entries">
          {resume.experience.map((job) => (
            <article
              key={`${job.company}-${job.title}-${job.date_range}`}
              className="resume-entry"
            >
              <div className="entry-heading">
                <h3>
                  {job.company}
                  {job.location && <span className="entry-location"> — {job.location}</span>}
                </h3>
                <p className="entry-subtitle">
                  {job.title} | {job.date_range}
                </p>
              </div>
              <BulletList items={job.bullets} />
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
