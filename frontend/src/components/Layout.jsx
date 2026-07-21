import { Link, NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  return (
    <div className="site">
      <header className="header">
        <Link to="/" className="logo">
          Portfolio
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Built with Django REST Framework, React, and Cursor.</p>
      </footer>
    </div>
  )
}
