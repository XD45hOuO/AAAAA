import { Link } from 'react-router-dom'

export default function PostCard({ post }) {
  return (
    <article className="card glow-cyan">
      <h3 className="card-title neon-text">
        <Link to={`/posts/${post.slug}`} className="neon-text" style={{ textDecoration: 'none' }}>{post.title}</Link>
      </h3>
      <div className="muted" style={{ marginBottom: 8 }}>{post.date}</div>
      <p style={{ marginTop: 0 }}>{post.excerpt}</p>
      <div style={{ marginTop: 8 }}>
        {post.tags?.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </article>
  )
}


