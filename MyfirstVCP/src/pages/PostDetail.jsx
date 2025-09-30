import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../data/posts'

export default function PostDetail() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="container">
        <p className="muted">Post not found.</p>
        <Link className="btn" to="/posts">Back to posts</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="neon-text" style={{ marginTop: 12 }}>{post.title}</h1>
      <div className="muted" style={{ marginBottom: 16 }}>{post.date} · {post.tags?.join(' / ')}</div>
      {post.content.map((para, idx) => (
        <p key={idx} className="card glow-magenta" style={{ marginTop: 12 }}>{para}</p>
      ))}
      <div style={{ marginTop: 16 }}>
        <Link className="btn" to="/posts">← Back to posts</Link>
      </div>
    </div>
  )
}


