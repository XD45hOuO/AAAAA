export const posts = [
  {
    id: '1',
    slug: 'welcome-to-neon-city',
    title: 'Welcome to Neon City',
    date: '2025-09-25',
    excerpt: 'Booting up the grid. This is a journal of code, circuits, and city glow.',
    tags: ['intro', 'cyberpunk'],
    content: [
      'In the alleys between servers and streetlights, this blog comes online.',
      'Expect write-ups on front-end rigs, design systems, and synthwave aesthetics.',
    ],
  },
  {
    id: '2',
    slug: 'building-neon-uis',
    title: 'Building Neon UIs',
    date: '2025-09-20',
    excerpt: 'How to craft glowing interfaces without burning the eyes or the GPU.',
    tags: ['ui', 'design'],
    content: [
      'Neon is a spice. Use sparingly around edges and interaction points.',
      'Contrast, spacing, and motion sell the effect more than pure brightness.',
    ],
  },
]

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug)
}


