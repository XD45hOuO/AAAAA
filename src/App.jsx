import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import About from './pages/About'
import Inequality from './pages/Inequality'
import Scoreboard from './pages/Scoreboard'
import Rating from './pages/Rating'
import './styles/cyberpunk.css'

function App() {
  return (
    <>
      <Navbar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/inequality" element={<Inequality />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
