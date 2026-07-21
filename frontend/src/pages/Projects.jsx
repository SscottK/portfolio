import { useEffect, useState } from 'react'
import { getProjects } from '../api'
import ProjectCard from '../components/ProjectCard'
import './Projects.css'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'built_with_cursor', label: 'Cursor' },
  { key: 'hand_coded', label: 'Hand-coded' },
]

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = filter === 'all' ? {} : { [filter]: true }
    getProjects(params)
      .then(setProjects)
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <h1>Projects</h1>
      <p className="intro">
        Apps built with Cursor, hand-coded work, and everything in between.
      </p>

      <div className="filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'active' : ''}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="status">No projects match this filter.</p>
      )}
    </div>
  )
}
