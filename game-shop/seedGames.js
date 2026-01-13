const mongoose = require('mongoose');
const Game = require('./models/Game');
require('dotenv').config();

const sampleGames = [
  {
    title: "Cyber Nexus 2077",
    description: "Immerse yourself in a dystopian cyberpunk world where technology and humanity collide. Make choices that shape the future of Neo-Tokyo in this epic RPG adventure.",
    price: 59.99,
    category: "RPG",
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/cyber-nexus-2077",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 / AMD RX 580",
        storage: "50 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
        storage: "50 GB SSD space"
      }
    },
    tags: ["Cyberpunk", "Open World", "Story Rich", "Futuristic"],
    rating: 4.8,
    featured: true
  },
  {
    title: "Mystic Realms: Chronicles",
    description: "Embark on an epic fantasy journey through magical realms filled with ancient mysteries, powerful spells, and legendary creatures waiting to be discovered.",
    price: 49.99,
    category: "Adventure",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/mystic-realms",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "35 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
        memory: "12 GB RAM",
        graphics: "NVIDIA RTX 3060 / AMD RX 6600",
        storage: "35 GB SSD space"
      }
    },
    tags: ["Fantasy", "Magic", "Adventure", "Exploration"],
    rating: 4.6,
    featured: true
  },
  {
    title: "Stellar Command",
    description: "Build and command your space fleet in this strategic masterpiece. Explore galaxies, manage resources, and engage in tactical battles across the cosmos.",
    price: 39.99,
    category: "Strategy",
    images: ["https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/stellar-command",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-7100 / AMD Ryzen 3 1200",
        memory: "4 GB RAM",
        graphics: "NVIDIA GTX 950 / AMD RX 460",
        storage: "25 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-9400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1660 / AMD RX 5500 XT",
        storage: "25 GB SSD space"
      }
    },
    tags: ["Space", "Strategy", "Management", "Tactical"],
    rating: 4.4,
    featured: false
  },
  {
    title: "Neon Racer X",
    description: "Experience high-octane racing in a neon-soaked futuristic city. Customize your ride, master impossible tracks, and dominate the underground racing scene.",
    price: 29.99,
    category: "Racing",
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/neon-racer-x",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 1050 Ti / AMD RX 570",
        storage: "20 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
        memory: "12 GB RAM",
        graphics: "NVIDIA RTX 3060 / AMD RX 6600",
        storage: "20 GB SSD space"
      }
    },
    tags: ["Racing", "Futuristic", "Customization", "Arcade"],
    rating: 4.3,
    featured: false
  },
  {
    title: "Shadow Ops: Infiltration",
    description: "Master the art of stealth in this tactical espionage thriller. Use cutting-edge gadgets and strategic thinking to complete impossible missions.",
    price: 44.99,
    category: "Action",
    images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/shadow-ops",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 / AMD RX 580",
        storage: "40 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
        storage: "40 GB SSD space"
      }
    },
    tags: ["Stealth", "Tactical", "Espionage", "Single Player"],
    rating: 4.7,
    featured: true
  },
  {
    title: "Puzzle Dimension",
    description: "Challenge your mind with mind-bending 3D puzzles that defy logic. Each level presents unique mechanics and increasingly complex challenges.",
    price: 19.99,
    category: "Puzzle",
    images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/puzzle-dimension",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-6100 / AMD Ryzen 3 1200",
        memory: "4 GB RAM",
        graphics: "NVIDIA GTX 750 Ti / AMD RX 460",
        storage: "8 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "8 GB SSD space"
      }
    },
    tags: ["Puzzle", "3D", "Logic", "Relaxing"],
    rating: 4.2,
    featured: false
  },
  {
    title: "Indie Dreams",
    description: "A heartwarming indie adventure about following your dreams. Beautiful hand-drawn art meets compelling storytelling in this emotional journey.",
    price: 24.99,
    category: "Indie",
    images: ["https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/indie-dreams",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-6100 / AMD Ryzen 3 1200",
        memory: "4 GB RAM",
        graphics: "NVIDIA GTX 750 Ti / AMD RX 460",
        storage: "12 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "12 GB SSD space"
      }
    },
    tags: ["Indie", "Story Rich", "Emotional", "Hand-drawn"],
    rating: 4.9,
    featured: false
  },
  {
    title: "Sports Arena 2024",
    description: "The ultimate sports simulation featuring multiple disciplines. Compete in tournaments, build your career, and become a legendary athlete.",
    price: 54.99,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/sports-arena-2024",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 / AMD RX 580",
        storage: "45 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
        storage: "45 GB SSD space"
      }
    },
    tags: ["Sports", "Simulation", "Career Mode", "Multiplayer"],
    rating: 4.1,
    featured: false
  },
  {
    title: "City Builder Pro",
    description: "Design and manage the city of your dreams. Balance economics, environment, and citizen happiness in this comprehensive city simulation.",
    price: 34.99,
    category: "Simulation",
    images: ["https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/city-builder-pro",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "30 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
        memory: "12 GB RAM",
        graphics: "NVIDIA RTX 3060 / AMD RX 6600",
        storage: "30 GB SSD space"
      }
    },
    tags: ["City Builder", "Management", "Strategy", "Sandbox"],
    rating: 4.5,
    featured: true
  },
  {
    title: "Quantum Warfare",
    description: "Experience the future of combat in this sci-fi shooter. Master quantum abilities, manipulate time and space, and fight across multiple dimensions.",
    price: 49.99,
    category: "Action",
    images: ["https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/quantum-warfare",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-9400 / AMD Ryzen 5 3600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1660 / AMD RX 5600 XT",
        storage: "35 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-11700K / AMD Ryzen 7 5800X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 4060 / AMD RX 7600",
        storage: "35 GB SSD space"
      }
    },
    tags: ["Sci-Fi", "Shooter", "Quantum", "Multiplayer"],
    rating: 4.6,
    featured: true
  },
  {
    title: "Medieval Legends",
    description: "Forge your destiny in a vast medieval world. Build kingdoms, lead armies, and write your own legend in this epic strategy RPG.",
    price: 39.99,
    category: "Strategy",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/medieval-legends",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "25 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
        memory: "12 GB RAM",
        graphics: "NVIDIA RTX 3060 / AMD RX 6600",
        storage: "25 GB SSD space"
      }
    },
    tags: ["Medieval", "Strategy", "Kingdom", "RPG"],
    rating: 4.4,
    featured: false
  },
  {
    title: "Ocean Explorer",
    description: "Dive into the mysterious depths of the ocean. Discover ancient civilizations, encounter sea creatures, and uncover underwater treasures.",
    price: 32.99,
    category: "Adventure",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/ocean-explorer",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-7100 / AMD Ryzen 3 1200",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "20 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-9400 / AMD Ryzen 5 2600",
        memory: "12 GB RAM",
        graphics: "NVIDIA GTX 1660 / AMD RX 5500 XT",
        storage: "20 GB SSD space"
      }
    },
    tags: ["Ocean", "Exploration", "Underwater", "Discovery"],
    rating: 4.3,
    featured: false
  },
  {
    title: "Retro Arcade Collection",
    description: "Relive the golden age of gaming with this collection of classic arcade games. Over 50 retro games with modern enhancements and online leaderboards.",
    price: 19.99,
    category: "Indie",
    images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/retro-arcade",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-6100 / AMD Ryzen 3 1200",
        memory: "4 GB RAM",
        graphics: "NVIDIA GTX 750 Ti / AMD RX 460",
        storage: "5 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1050 / AMD RX 560",
        storage: "5 GB SSD space"
      }
    },
    tags: ["Retro", "Arcade", "Classic", "Collection"],
    rating: 4.7,
    featured: false
  },
  {
    title: "Mech Warrior Elite",
    description: "Pilot giant mechs in intense battles across alien worlds. Customize your war machine and engage in epic multiplayer combat.",
    price: 44.99,
    category: "Action",
    images: ["https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/mech-warrior",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1060 / AMD RX 580",
        storage: "40 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
        storage: "40 GB SSD space"
      }
    },
    tags: ["Mech", "Combat", "Multiplayer", "Customization"],
    rating: 4.5,
    featured: false
  },
  {
    title: "Farming Paradise",
    description: "Build and manage your dream farm in this relaxing simulation. Grow crops, raise animals, and create a thriving agricultural business.",
    price: 27.99,
    category: "Simulation",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop"],
    downloadUrl: "https://example.com/download/farming-paradise",
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i3-7100 / AMD Ryzen 3 1200",
        memory: "4 GB RAM",
        graphics: "NVIDIA GTX 950 / AMD RX 460",
        storage: "15 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Intel Core i5-9400 / AMD Ryzen 5 2600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1660 / AMD RX 5500 XT",
        storage: "15 GB SSD space"
      }
    },
    tags: ["Farming", "Relaxing", "Management", "Peaceful"],
    rating: 4.6,
    featured: false
  }
];

async function seedGames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop');
    console.log('Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert sample games
    const insertedGames = await Game.insertMany(sampleGames);
    console.log(`Inserted ${insertedGames.length} sample games`);

    console.log('Sample games added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
}

// Run the seed function
seedGames();