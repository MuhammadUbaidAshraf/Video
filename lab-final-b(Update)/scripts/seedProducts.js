require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    id: 'prod1',
    name: 'Video Editing Software',
    description: 'Professional editing suite for creators. Full-featured video editing software with advanced color grading, audio mixing, and effects library.',
    price: 99.99,
    category: 'software',
    image: 'https://ih1.redbubble.net/image.325764859.0459/icr,iphone_17_toughmagsafe,back,a,x1000-pad,1000x1000,f8f8f8.u2.jpg',
    stock: 100,
    featured: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 'prod2',
    name: '4K Camera Lens',
    description: 'Capture stunning clarity with this lens. Professional-grade 4K camera lens with advanced optics and image stabilization technology.',
    price: 499.00,
    category: 'hardware',
    image: 'https://preview.redd.it/what-would-be-your-response-if-you-saw-a-black-vigo-at-your-v0-xai5rw6bzs0b1.png?width=650&format=png&auto=webp&s=decd08e41cbe7ce39a8f7a40a786308b740388dc',
    stock: 45,
    featured: true,
    rating: 4.8,
    reviews: 93
  },
  {
    id: 'prod3',
    name: 'Tripod Stand',
    description: 'Stable and portable tripod for all setups. Lightweight aluminum construction with adjustable height and quick-release plate.',
    price: 55.50,
    category: 'accessories',
    image: 'https://houseofscotland.pk/cdn/shop/products/house-of-scotland-military-officer-stick-with-chain-36-inches.jpg?v=1678706156&width=1200',
    stock: 200,
    featured: false,
    rating: 4.3,
    reviews: 67
  },
  {
    id: 'prod4',
    name: 'Wireless Microphone System',
    description: 'Crystal clear audio recording system. Professional wireless lavalier microphone with noise cancellation and long battery life.',
    price: 149.99,
    category: 'hardware',
    image: 'https://via.placeholder.com/400x300/4A90E2/ffffff?text=Wireless+Mic',
    stock: 75,
    featured: false,
    rating: 4.6,
    reviews: 54
  },
  {
    id: 'prod5',
    name: 'LED Ring Light',
    description: 'Professional lighting for video production. Dimmable LED ring light with adjustable color temperature and remote control.',
    price: 79.99,
    category: 'accessories',
    image: 'https://via.placeholder.com/400x300/E84855/ffffff?text=Ring+Light',
    stock: 120,
    featured: true,
    rating: 4.4,
    reviews: 102
  },
  {
    id: 'prod6',
    name: 'Green Screen Backdrop',
    description: 'Collapsible chroma key background for video effects. Professional-grade fabric with wrinkle-resistant material and carrying case.',
    price: 39.99,
    category: 'accessories',
    image: 'https://via.placeholder.com/400x300/2ECC71/ffffff?text=Green+Screen',
    stock: 150,
    featured: false,
    rating: 4.2,
    reviews: 78
  },
  {
    id: 'prod7',
    name: 'Video Production Course',
    description: 'Comprehensive online video production training. Learn cinematography, editing, color grading, and audio production from industry experts.',
    price: 199.99,
    category: 'services',
    image: 'https://via.placeholder.com/400x300/9B59B6/ffffff?text=Video+Course',
    stock: 999,
    featured: true,
    rating: 4.9,
    reviews: 245
  },
  {
    id: 'prod8',
    name: 'Camera Stabilizer Gimbal',
    description: 'Professional 3-axis gimbal stabilizer. Smooth video capture with intelligent tracking and extended battery life for all-day shooting.',
    price: 329.00,
    category: 'hardware',
    image: 'https://via.placeholder.com/400x300/F39C12/ffffff?text=Gimbal',
    stock: 60,
    featured: true,
    rating: 4.7,
    reviews: 89
  },
  {
    id: 'prod9',
    name: 'External Hard Drive 2TB',
    description: 'High-speed storage for video files. Rugged portable hard drive with USB-C connectivity and hardware encryption.',
    price: 89.99,
    category: 'hardware',
    image: 'https://via.placeholder.com/400x300/1ABC9C/ffffff?text=Hard+Drive',
    stock: 180,
    featured: false,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 'prod10',
    name: 'Camera Lens Cleaning Kit',
    description: 'Complete cleaning solution for camera equipment. Includes microfiber cloths, cleaning solution, air blower, and lens pen.',
    price: 24.99,
    category: 'accessories',
    image: 'https://via.placeholder.com/400x300/E67E22/ffffff?text=Cleaning+Kit',
    stock: 300,
    featured: false,
    rating: 4.1,
    reviews: 43
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bevideo_ecommerce');

    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Existing products removed');

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted successfully!`);

    console.log('\nSample products:');
    createdProducts.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - PKR ${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts();
