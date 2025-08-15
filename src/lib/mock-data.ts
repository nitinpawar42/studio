import type { Product, Category, BlogPost } from '@/types';

export const categories: Category[] = [
  {
    id: 'ganesha',
    name: 'Ganesha',
  },
  {
    id: 'krishna',
    name: 'Krishna',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
  },
   {
    id: 'shiva',
    name: 'Shiva',
  },
  {
    id: 'rudraksha',
    name: 'Rudraksha',
  },
  {
    id: 'karungali',
    name: 'Karungali',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Lord Ganesha',
    description: 'A beautiful and authentic Ganesha idol, perfect for your home altar.',
    images: ['https://placehold.co/600x600.png'],
    price: 1199,
    category: 'Ganesha',
    tags: ['ganesha', 'idol'],
    details: {
      material: 'Brass',
      certification: 'Hand-crafted',
    },
  },
   {
    id: '2',
    name: 'Lord Krishna',
    description: 'A serene and divine Krishna idol, radiating peace and love.',
    images: ['https://placehold.co/600x600.png'],
    price: 1489,
    category: 'Krishna',
    tags: ['krishna', 'idol'],
    details: {
      material: 'Marble Dust',
      certification: 'Hand-painted',
    },
  },
  {
    id: '3',
    name: 'Goddess Lakshmi',
    description: 'Bring home prosperity and good fortune with this exquisite Lakshmi idol.',
    images: ['https://placehold.co/600x600.png'],
    price: 1299,
    category: 'Lakshmi',
    tags: ['lakshmi', 'idol'],
    details: {
      material: 'Polyresin',
      certification: 'Gold-plated',
    },
  },
    {
    id: '4',
    name: 'Lord Shiva',
    description: 'A powerful and meditative Shiva idol for your spiritual space.',
    images: ['https://placehold.co/600x600.png'],
    price: 1289,
    category: 'Shiva',
    tags: ['shiva', 'idol'],
    details: {
      material: 'Stone',
      certification: 'Hand-carved',
    },
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'spiritual-significance-sawan-month',
    title: 'Understanding the Spiritual Significance of the Sawan Month',
    date: 'July 22, 2024',
    excerpt: 'The month of Sawan, or Shravan, is highly auspicious in Hinduism, dedicated to Lord Shiva. Discover why this period is celebrated with such devotion and learn about the rituals that can bring you closer to the divine.',
    content: '<p>The month of Sawan, also known as Shravan, holds a paramount significance in Hindu culture. It is the fifth month of the Hindu lunar calendar and is dedicated to Lord Shiva. Devotees observe fasts, perform pujas, and engage in various religious activities to seek his blessings. The entire month is filled with an aura of divinity and devotion.</p><p>Legend has it that during the Samudra Manthan (churning of the ocean), Lord Shiva consumed the poison "halahala" to save the universe. To soothe the effects of the poison, the gods offered him water from the holy river Ganges. This act is commemorated by devotees offering water to Shiva Lingams during Sawan. It is believed that doing so pleases Lord Shiva immensely, and he grants the wishes of his devotees.</p>',
    imageUrl: 'https://placehold.co/800x400.png',
  },
  {
    slug: 'power-of-rudraksha',
    title: 'The Unseen Power of Rudraksha Beads',
    date: 'July 15, 2024',
    excerpt: 'Rudraksha beads are not mere accessories; they are powerful tools for spiritual growth and well-being. This article delves into the science and mythology behind these sacred beads.',
    content: '<p>Rudraksha beads, the seeds of the Elaeocarpus ganitrus tree, are considered sacred in Hinduism. The name "Rudraksha" translates to "Tears of Rudra (Shiva)," and it is believed that the beads originated from the teardrops of Lord Shiva. Each bead has a certain number of facets or "mukhis," ranging from one to twenty-one, each with its unique properties and significance.</p><p>Wearing Rudraksha beads is said to have numerous benefits, including calming the nervous system, improving concentration, and protecting against negative energies. Scientific studies have also indicated that Rudraksha beads have electromagnetic properties that can have a positive effect on the human body. Whether for spiritual or health reasons, Rudraksha continues to be a revered object of faith.</p>',
    imageUrl: 'https://placehold.co/800x400.png',
  },
];
