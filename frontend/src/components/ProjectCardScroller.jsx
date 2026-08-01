import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import './ProjectCardScroller.css'

export default function ProjectCardScroller({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef(null)
  const wheelLock = useRef(false)

  useEffect(() => {
    setActiveIndex(0)
  }, [projects])

  const goTo = useCallback(
    (index) => {
      if (isAnimating || !projects.length) return

      const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
      if (nextIndex === activeIndex) return

      setIsAnimating(true)
      setActiveIndex(nextIndex)
    },
    [activeIndex, isAnimating, projects.length],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const onWheel = (event) => {
      event.preventDefault()

      if (wheelLock.current || isAnimating) return

      if (event.deltaY > 25) {
        goTo(activeIndex + 1)
      } else if (event.deltaY < -25) {
        goTo(activeIndex - 1)
      } else {
        return
      }

      wheelLock.current = true
      window.setTimeout(() => {
        wheelLock.current = false
      }, 700)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [activeIndex, goTo, isAnimating])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        goTo(activeIndex + 1)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        goTo(activeIndex - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, goTo])

  if (!projects.length) {
    return <p className="status card-carousel-empty">No projects match this filter.</p>
  }

  return (
    <div className="card-carousel" ref={containerRef}>
      <div
        className="card-carousel-track"
        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        onTransitionEnd={() => setIsAnimating(false)}
      >
        {projects.map((project) => (
          <section key={project.id} className="card-carousel-slide">
            <ProjectCard project={project} />
          </section>
        ))}
      </div>

      {projects.length > 1 && (
        <div className="card-carousel-ui">
          <p className="card-carousel-count">
            {activeIndex + 1} / {projects.length}
          </p>
          <div className="card-carousel-dots">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                aria-label={`Show ${project.name}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
