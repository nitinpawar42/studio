import type { Product, Category, BlogPost } from '@/types';

export const categories: Category[] = [
  {
    id: 'rudraksha',
    name: 'Rudraksha',
    subcategories: [
      { id: '1-mukhi', name: '1 Mukhi' },
      { id: '2-mukhi', name: '2 Mukhi' },
      { id: '5-mukhi', name: '5 Mukhi' },
      { id: 'ganesh-rudraksha', name: 'Ganesh Rudraksha' },
    ],
  },
  {
    id: 'karungali',
    name: 'Karungali',
  },
  {
    id: 'combo-deals',
    name: 'Combo Deals',
  },
  {
    id: 'sphatik',
    name: 'Sphatik',
  },
  {
    id: 'sandalwood',
    name: 'Sandalwood',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: '5 Mukhi Rudraksha Mala',
    description: 'A beautiful and authentic 5 Mukhi Rudraksha Mala, perfect for meditation and spiritual practices. Blessed by Lord Shiva.',
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    price: 1299,
    originalPrice: 1999,
    category: 'Rudraksha',
    tags: ['5 mukhi', 'mala', 'meditation'],
    details: {
      beadCount: 108,
      material: 'Rudraksha Beads',
      certification: 'Lab Certified',
      origin: 'Nepal',
    },
  },
  {
    id: '2',
    name: 'Karungali (Ebony) Bracelet',
    description: 'Protect yourself from negative energy with this powerful Karungali wood bracelet. Known for its grounding properties.',
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    price: 799,
    category: 'Karungali',
    tags: ['karungali', 'ebony', 'bracelet', 'protection'],
    details: {
      material: 'Karungali Wood',
      certification: 'Authentic Wood Sourced',
      origin: 'India',
    },
  },
  {
    id: '3',
    name: 'Spiritual Combo Pack',
    description: 'A complete spiritual kit including a Rudraksha mala, a Karungali bracelet, and sacred ash (vibhuti).',
    images: ['https://placehold.co/600x600.png'],
    price: 1999,
    originalPrice: 2499,
    category: 'Combo Deals',
    tags: ['combo', 'rudraksha', 'karungali'],
    details: {
      material: 'Mixed',
      certification: 'Certified Components',
    },
  },
  {
    id: '4',
    name: 'Certified 1 Mukhi Rudraksha',
    description: 'An extremely rare and powerful 1 Mukhi Rudraksha from Nepal. A symbol of pure consciousness.',
    images: ['https://placehold.co/600x600.png'],
    price: 25000,
    category: 'Rudraksha',
    tags: ['1 mukhi', 'rare', 'collector'],
    details: {
      beadCount: 1,
      material: 'Rudraksha Bead',
      certification: 'IGI Certified',
      origin: 'Nepal',
    },
  },
  {
    id: '5',
    name: 'Sandalwood Mala',
    description: 'A fragrant sandalwood mala that calms the mind and enhances meditation. Sourced from authentic Mysore sandalwood.',
    images: ['https://placehold.co/600x600.png'],
    price: 1599,
    category: 'Sandalwood',
    tags: ['sandalwood', 'mala', 'meditation', 'calming'],
    details: {
      beadCount: 108,
      material: 'Mysore Sandalwood',
      certification: 'Authenticity Guaranteed',
      origin: 'India',
    },
  },
  {
    id: '6',
    name: 'Sphatik Crystal Mala',
    description: 'Clear quartz (Sphatik) mala for clarity of thought, concentration, and spiritual healing. It cools the body and mind.',
    images: ['https://placehold.co/600x600.png'],
    price: 999,
    originalPrice: 1499,
    category: 'Sphatik',
    tags: ['sphatik', 'crystal', 'healing', 'concentration'],
    details: {
      beadCount: 108,
      material: 'Sphatik Crystal',
      certification: 'Lab Certified',
      origin: 'Himalayas',
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
