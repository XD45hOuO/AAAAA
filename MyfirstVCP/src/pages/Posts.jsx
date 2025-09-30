import { posts } from '../data/posts'
import PostCard from '../components/PostCard'

export default function Posts() {
  return (
    <div className="container">
      <h2 className="neon-text" style={{ marginTop: 12 }}>Posts</h2>
      <div style={{ marginTop: 16 }}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}


