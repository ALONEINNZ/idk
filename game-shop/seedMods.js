const mongoose = require('mongoose');
const Mod = require('./models/Mod');
require('dotenv').config();

const sampleMods = [
  {
    title: "Ultra Graphics Enhancement",
    description: "Transform your game with stunning 4K textures, enhanced lighting, and realistic weather effects. This comprehensive graphics overhaul brings your favorite games to life with breathtaking visual fidelity.",
    shortDescription: "4K textures and enhanced lighting for ultimate visual experience",
    price: 9.99,
    isFree: false,
    category: "Graphics",
    gameTitle: "Cyberpunk 2077",
    gameEngine: "REDengine",
    author: "VisualMaster",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/ultra-graphics.zip",
    fileSize: "2.5 GB",
    version: "2.1.0",
    tags: ["Graphics", "4K", "Lighting", "Weather"],
    approved: true,
    featured: true,
    active: true,
    downloads: 15420,
    rating: {
      average: 4.8,
      count: 342,
      breakdown: { one: 2, two: 5, three: 18, four: 67, five: 250 }
    }
  },
  {
    title: "Realistic Combat Overhaul",
    description: "Experience intense, tactical combat with this complete gameplay modification. Features realistic weapon physics, enhanced AI behavior, and immersive damage systems.",
    shortDescription: "Tactical combat with realistic physics and enhanced AI",
    price: 0,
    isFree: true,
    category: "Gameplay",
    gameTitle: "Skyrim",
    gameEngine: "Creation Engine",
    author: "CombatPro",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/combat-overhaul.zip",
    fileSize: "156 MB",
    version: "1.8.3",
    tags: ["Combat", "Gameplay", "AI", "Realistic"],
    approved: true,
    featured: true,
    active: true,
    downloads: 28750,
    rating: {
      average: 4.6,
      count: 567,
      breakdown: { one: 8, two: 12, three: 45, four: 156, five: 346 }
    }
  },
  {
    title: "Modern UI Redesign",
    description: "A sleek, modern interface that enhances usability and visual appeal. Features customizable themes, improved navigation, and responsive design elements.",
    shortDescription: "Modern, customizable UI with improved navigation",
    price: 4.99,
    isFree: false,
    category: "UI/UX",
    gameTitle: "Minecraft",
    gameEngine: "Custom",
    author: "UIDesigner",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/modern-ui.zip",
    fileSize: "45 MB",
    version: "3.2.1",
    tags: ["UI", "Interface", "Modern", "Customizable"],
    approved: true,
    featured: false,
    active: true,
    downloads: 9876,
    rating: {
      average: 4.4,
      count: 198,
      breakdown: { one: 3, two: 7, three: 22, four: 78, five: 88 }
    }
  },
  {
    title: "Epic Soundtrack Pack",
    description: "Immerse yourself with orchestral masterpieces and ambient soundscapes. Over 50 high-quality tracks that dynamically adapt to gameplay situations.",
    shortDescription: "50+ orchestral tracks with dynamic audio system",
    price: 7.99,
    isFree: false,
    category: "Audio",
    gameTitle: "The Witcher 3",
    gameEngine: "REDengine",
    author: "AudioMaestro",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/epic-soundtrack.zip",
    fileSize: "890 MB",
    version: "1.5.0",
    tags: ["Audio", "Music", "Orchestral", "Ambient"],
    approved: true,
    featured: true,
    active: true,
    downloads: 12340,
    rating: {
      average: 4.9,
      count: 276,
      breakdown: { one: 1, two: 2, three: 8, four: 35, five: 230 }
    }
  },
  {
    title: "Survival Challenge Mode",
    description: "Test your survival skills with this hardcore gameplay modification. Features realistic hunger, thirst, temperature systems, and challenging resource management.",
    shortDescription: "Hardcore survival with realistic systems",
    price: 0,
    isFree: true,
    category: "Gameplay",
    gameTitle: "Rust",
    gameEngine: "Unity",
    author: "SurvivalExpert",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/survival-challenge.zip",
    fileSize: "78 MB",
    version: "2.0.4",
    tags: ["Survival", "Hardcore", "Challenge", "Realistic"],
    approved: true,
    featured: false,
    active: true,
    downloads: 18650,
    rating: {
      average: 4.3,
      count: 423,
      breakdown: { one: 12, two: 18, three: 56, four: 167, five: 170 }
    }
  },
  {
    title: "Vehicle Expansion Pack",
    description: "Add over 100 new vehicles to your game world. From sports cars to military vehicles, each with unique handling and customization options.",
    shortDescription: "100+ new vehicles with unique handling",
    price: 12.99,
    isFree: false,
    category: "Vehicles",
    gameTitle: "GTA V",
    gameEngine: "Source",
    author: "VehicleMod",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/vehicle-pack.zip",
    fileSize: "1.2 GB",
    version: "4.1.2",
    tags: ["Vehicles", "Cars", "Customization", "Expansion"],
    approved: true,
    featured: true,
    active: true,
    downloads: 34560,
    rating: {
      average: 4.7,
      count: 789,
      breakdown: { one: 5, two: 12, three: 34, four: 178, five: 560 }
    }
  },
  {
    title: "Character Creator Plus",
    description: "Unlimited character customization with advanced sliders, new hairstyles, clothing options, and facial features. Create your perfect avatar.",
    shortDescription: "Advanced character customization system",
    price: 0,
    isFree: true,
    category: "Characters",
    gameTitle: "Fallout 4",
    gameEngine: "Creation Engine",
    author: "CharacterArtist",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/character-creator.zip",
    fileSize: "234 MB",
    version: "1.9.1",
    tags: ["Characters", "Customization", "Avatar", "Creation"],
    approved: true,
    featured: false,
    active: true,
    downloads: 22100,
    rating: {
      average: 4.5,
      count: 445,
      breakdown: { one: 8, two: 15, three: 42, four: 145, five: 235 }
    }
  },
  {
    title: "Weapon Arsenal Mod",
    description: "Massive collection of realistic weapons with authentic sounds, animations, and ballistics. Over 200 weapons from different eras and conflicts.",
    shortDescription: "200+ realistic weapons with authentic details",
    price: 8.99,
    isFree: false,
    category: "Weapons",
    gameTitle: "Counter-Strike 2",
    gameEngine: "Source",
    author: "WeaponSmith",
    authorId: new mongoose.Types.ObjectId(),
    images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"],
    downloadUrl: "/uploads/mod-files/weapon-arsenal.zip",
    fileSize: "567 MB",
    version: "3.4.0",
    tags: ["Weapons", "Realistic", "Arsenal", "Combat"],
    approved: true,
    featured: true,
    active: true,
    downloads: 19870,
    rating: {
      average: 4.6,
      count: 356,
      breakdown: { one: 4, two: 8, three: 28, four: 98, five: 218 }
    }
  }
];

async function seedMods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gameshop');
    console.log('Connected to MongoDB');

    // Clear existing mods
    await Mod.deleteMany({});
    console.log('Cleared existing mods');

    // Insert sample mods
    const insertedMods = await Mod.insertMany(sampleMods);
    console.log(`Inserted ${insertedMods.length} sample mods`);

    console.log('Sample mods added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding mods:', error);
    process.exit(1);
  }
}

// Run the seed function
seedMods();