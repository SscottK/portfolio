import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()
  const isCardScrollPage = pathname === '/'

  return (
    <div className={`site ${isCardScrollPage ? 'site--card-scroll' : ''}`}>
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            SK
          </span>
          <span className="logo-text">Scott Kinnear</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <NavLink to="/certifications">Certifications</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className={`main ${isCardScrollPage ? 'main--card-scroll' : ''}`}>
        <Outlet />
      </main>
      <footer className="footer">
        <p className="footer-tagline">Full-stack developer · Django & React</p>
        <p className="footer-meta">Built with Django REST Framework, React, and Cursor</p>
      </footer>
    </div>
  )
}
