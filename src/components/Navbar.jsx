import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand">
          <span className="brand-title neon-text">NEON CITY</span>
          <span className="brand-badge">BLOG</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Home</NavLink>
          <NavLink to="/posts" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Posts</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>About</NavLink>
          <NavLink to="/inequality" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Inequality</NavLink>
          <NavLink to="/scoreboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Scoreboard</NavLink>
          <NavLink to="/rating" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Rating</NavLink>
        </nav>
      </div>
    </header>
  )
}


