export const SIGNATURE_BOWLS = [
  {
    id: 'bowl-1',
    name: 'Amazonian Açai Bliss',
    tagline: 'Signature organic Brazilian açaí topped with fresh mountain berries',
    category: 'acai',
    price: 329,
    calories: 340,
    protein: '8g',
    fiber: '9g',
    rating: 4.9,
    reviews: 428,
    badge: 'Best Seller',
    image: '/images/hero_bowl.jpg',
    ingredients: ['Organic Açai Puree', 'Fresh Mahabaleshwar Strawberries', 'Wild Blueberries', 'Ratnagiri Alphonso Mango', 'Toasted Coconut', 'Chia Seeds', 'Raw Wildflower Honey']
  },
  {
    id: 'bowl-2',
    name: 'Pink Pitaya Tropical Dream',
    tagline: 'Vibrant hot-pink dragonfruit blend with passionfruit & mango stars',
    category: 'tropical',
    price: 349,
    calories: 310,
    protein: '6g',
    fiber: '11g',
    rating: 4.95,
    reviews: 312,
    badge: 'Chef Choice',
    image: '/images/pitaya_bowl.jpg',
    ingredients: ['Pink Pitaya / Dragonfruit', 'Ripe Alphonso Mango', 'Passionfruit Pulp', 'Kiwi Stars', 'Coconut Ribbons', 'Edible Lavender']
  },
  {
    id: 'bowl-3',
    name: 'Green Goddess Glow',
    tagline: 'Nutrient-packed ceremonial matcha, creamy avocado & kiwi energy booster',
    category: 'detox',
    price: 369,
    calories: 290,
    protein: '11g',
    fiber: '12g',
    rating: 4.88,
    reviews: 194,
    badge: 'Superfood Detox',
    image: '/images/green_bowl.jpg',
    ingredients: ['Organic Ceremonial Matcha', 'Hass Avocado', 'Baby Spinach Blend', 'SunGold Kiwi', 'Green Grapes', 'Hemp Hearts', 'Pistachios']
  },
  {
    id: 'bowl-4',
    name: 'Power Cacao & Peanut Butter',
    tagline: 'Decadent natural peanut butter swirl, dark cacao nibs & sliced banana',
    category: 'protein',
    price: 379,
    calories: 460,
    protein: '22g',
    fiber: '10g',
    rating: 4.92,
    reviews: 580,
    badge: 'High Protein',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Peanut Butter Puree', 'Plant Protein (20g)', 'Robusta Banana Coins', 'Dark Peruvian Cacao Nibs', 'Ancient Grains Granola', 'Walnuts']
  },
  {
    id: 'bowl-5',
    name: 'Santorini Honey & Greek Yogurt',
    tagline: 'Authentic rich strained Greek yogurt, candied walnuts & organic figs',
    category: 'protein',
    price: 299,
    calories: 380,
    protein: '19g',
    fiber: '7g',
    rating: 4.85,
    reviews: 215,
    badge: 'Probiotic Rich',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Authentic Greek Yogurt', 'Blackberry Compote', 'Toasted Kashmiri Walnuts', 'Pure Forest Honey', 'Fresh Mint', 'Golden Flaxseeds']
  },
  {
    id: 'bowl-6',
    name: 'Sunshine Mango Chia Parfait',
    tagline: 'Overnight organic coconut milk chia seed pudding with fresh mango glaze',
    category: 'tropical',
    price: 269,
    calories: 270,
    protein: '7g',
    fiber: '14g',
    rating: 4.82,
    reviews: 167,
    badge: 'Zero Added Sugar',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Coconut Milk Chia Pudding', 'Fresh Crushed Alphonso Mango', 'Pomegranate Arils', 'Roasted Almond Flakes', 'Cardamom Dust']
  }
];

export const BUILDER_DATA = {
  bases: [
    { id: 'b1', name: 'Brazilian Açaí Sorbet', cal: 130, price: 169, desc: 'Rich, antioxidant-dense superberry', icon: '🫐' },
    { id: 'b2', name: 'Hot Pink Pitaya Blend', cal: 110, price: 169, desc: 'Naturally sweet & vibrant dragonfruit', icon: '🌺' },
    { id: 'b3', name: 'Coconut Chia Pudding', cal: 140, price: 139, desc: 'Overnight chia soaked in coconut milk', icon: '🥥' },
    { id: 'b4', name: 'Ceremonial Matcha Green', cal: 95, price: 159, desc: 'Uji matcha, baby spinach & avocado', icon: '🍵' },
    { id: 'b5', name: 'Artisan Greek Yogurt', cal: 120, price: 139, desc: 'Thick, creamy 15g protein base', icon: '🥛' }
  ],
  fruits: [
    { id: 'f1', name: 'Sweet Strawberries', cal: 25, price: 39, icon: '🍓' },
    { id: 'f2', name: 'Wild Blueberries', cal: 30, price: 49, icon: '🫐' },
    { id: 'f3', name: 'Alphonso Mango', cal: 35, price: 39, icon: '🥭' },
    { id: 'f4', name: 'Kiwi Slices', cal: 28, price: 39, icon: '🥝' },
    { id: 'f5', name: 'Banana Coins', cal: 45, price: 25, icon: '🍌' },
    { id: 'f6', name: 'Ruby Pomegranate', cal: 30, price: 39, icon: '💎' },
    { id: 'f7', name: 'Sweet Pineapple', cal: 32, price: 29, icon: '🍍' }
  ],
  crunches: [
    { id: 'c1', name: 'Organic Honey Granola', cal: 80, price: 35, icon: '🥣' },
    { id: 'c2', name: 'Toasted Coconut Flakes', cal: 65, price: 29, icon: '🥥' },
    { id: 'c3', name: 'Peruvian Cacao Nibs', cal: 70, price: 45, icon: '🍫' },
    { id: 'c4', name: 'Slivered Roasted Almonds', cal: 75, price: 39, icon: '🥜' },
    { id: 'c5', name: 'Organic Chia & Hemp', cal: 50, price: 35, icon: '🌱' },
    { id: 'c6', name: 'Crushed Pistachios', cal: 80, price: 49, icon: '🟢' }
  ],
  drizzles: [
    { id: 'd1', name: 'Raw Mountain Honey', cal: 40, price: 25, icon: '🍯' },
    { id: 'd2', name: 'Creamy Peanut Butter', cal: 90, price: 35, icon: '🥜' },
    { id: 'd3', name: 'Almond Butter Swirl', cal: 85, price: 45, icon: '🌰' },
    { id: 'd4', name: '70% Dark Chocolate', cal: 60, price: 35, icon: '🍫' },
    { id: 'd5', name: 'Passionfruit Nectar', cal: 35, price: 29, icon: '✨' }
  ]
};

export const PROMO_CODES = {
  'FRESH50': { discount: 0.50, type: 'percent', label: '50% OFF First Order' },
  'BOWLLOVER': { discount: 0.20, type: 'percent', label: '20% OFF Everything' },
  'FREESHIP': { discount: 49, type: 'fixed', label: 'Free Delivery (₹49 Off)' }
};
