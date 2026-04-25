const Recipe = require('../models/Recipe');
const ytSearch = require('yt-search');

// Fetch YouTube video dynamically
const getYoutubeVideo = async (query) => {
  try {
    const r = await ytSearch(query);
    const videos = r.videos;
    if (videos && videos.length > 0) {
      const video = videos[0];
      return {
        title: video.title,
        thumbnail: video.image || video.thumbnail,
        url: video.url
      };
    }
  } catch (error) {
    console.error('yt-search Error:', error.message);
  }
  return null;
};

// Map city/location to region
const mapLocationToRegion = (location) => {
  const loc = location.toLowerCase();
  if (['kolkata', 'west bengal', 'bengal'].includes(loc)) return 'Bengali';
  if (['chennai', 'bangalore', 'south india', 'kerala', 'tamil nadu'].includes(loc)) return 'South Indian';
  if (['delhi', 'punjab', 'north india'].includes(loc)) return 'North Indian';
  if (['mumbai', 'maharashtra'].includes(loc)) return 'Maharashtrian';
  if (['hyderabad', 'telangana'].includes(loc)) return 'Hyderabadi';
  return 'Global'; // Default
};

const { GoogleGenAI } = require('@google/genai');

const generateRecipes = async (req, res) => {
  const { ingredients, craving, location } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert culinary AI for an app called MasalaMatch. Suggest exactly 6 exquisite recipe ideas based on the following:
- Ingredients available: ${(ingredients || []).join(', ')}
- Craving: ${craving || 'Anything'}
- Location context: ${location || 'Global'}

Respond ONLY with a valid JSON array of objects. Each object must have these exact keys:
"name" (string, the recipe name),
"region" (string, the regional cuisine style),
"ingredients" (array of strings, key ingredients used in the recipe),
"tags" (array of strings, e.g., ["comfort", "dinner", "spicy"]),
"score" (number, a match percentage score from 60 to 100 based on how well it fits)

Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let generatedText = response.text.trim();
    if (generatedText.startsWith('```json')) {
      generatedText = generatedText.slice(7, -3).trim();
    } else if (generatedText.startsWith('```')) {
      generatedText = generatedText.slice(3, -3).trim();
    }

    let topRecipes = [];
    try {
      topRecipes = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Failed to generate valid recipes from AI');
    }

    // Assign actual youtube video and use its thumbnail as the exact recipe image
    const recipesWithVideos = await Promise.all(topRecipes.map(async (recipe) => {
      const query = `authentic ${recipe.name} recipe step by step`;
      const video = await getYoutubeVideo(query);
      
      const defaultFallback = 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop';
      return { 
        ...recipe, 
        imageUrl: video ? video.thumbnail : defaultFallback, 
        video 
      };
    }));

    res.json(recipesWithVideos);

  } catch (error) {
    console.error('Recipe Generation Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const seedRecipes = async (req, res) => {
  const recipes = [
    {
      name: 'Classic Butter Chicken',
      region: 'North Indian',
      ingredients: ['Chicken', 'Tomatoes', 'Butter', 'Cream', 'Garam Masala', 'Kasuri Methi', 'Onion', 'Garlic', 'Ginger'],
      tags: ['comfort', 'sweet', 'dinner'],
      imageUrl: '/butter_chicken.png',
    },
    {
      name: 'Spicy Shorshe Ilish (Mustard Hilsa)',
      region: 'Bengali',
      ingredients: ['Hilsa Fish', 'Mustard Oil', 'Mustard Seeds', 'Green Chilies', 'Turmeric', 'Salt', 'Nigella Seeds'],
      tags: ['spicy', 'comfort', 'seafood'],
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Crispy Ghee Roast Dosa',
      region: 'South Indian',
      ingredients: ['Rice batter', 'Urad dal', 'Ghee', 'Potato', 'Onion', 'Mustard seeds', 'Curry leaves'],
      tags: ['comfort', 'healthy', 'breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Kashmiri Dum Aloo',
      region: 'North Indian',
      ingredients: ['Baby Potatoes', 'Yogurt', 'Fennel Powder', 'Ginger Powder', 'Kashmiri Red Chili', 'Mustard Oil'],
      tags: ['spicy', 'comfort', 'vegetarian'],
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Mumbai Style Pav Bhaji',
      region: 'Maharashtrian',
      ingredients: ['Potatoes', 'Peas', 'Tomatoes', 'Capsicum', 'Onion', 'Pav Bhaji Masala', 'Butter', 'Bread'],
      tags: ['street food', 'spicy', 'snack'],
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Authentic Hyderabadi Biryani',
      region: 'Hyderabadi',
      ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Fried Onions', 'Mint', 'Saffron', 'Whole Spices', 'Ghee'],
      tags: ['comfort', 'spicy', 'dinner'],
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Kolkata Chicken Kathi Roll',
      region: 'Bengali',
      ingredients: ['Paratha', 'Chicken', 'Egg', 'Onion', 'Green Chili', 'Lemon', 'Chat Masala'],
      tags: ['street food', 'spicy'],
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Creamy Palak Paneer',
      region: 'North Indian',
      ingredients: ['Spinach', 'Paneer', 'Garlic', 'Cream', 'Onion', 'Tomato', 'Garam Masala'],
      tags: ['healthy', 'comfort', 'vegetarian'],
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Chettinad Pepper Chicken',
      region: 'South Indian',
      ingredients: ['Chicken', 'Black Pepper', 'Fennel Seeds', 'Coconut', 'Curry Leaves', 'Turmeric', 'Red Chili'],
      tags: ['spicy', 'comfort'],
      imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Misal Pav',
      region: 'Maharashtrian',
      ingredients: ['Sprouts', 'Onion', 'Tomato', 'Godaa Masala', 'Farsan', 'Pav', 'Lemon'],
      tags: ['spicy', 'street food', 'breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1626295325854-f8d227b8bfbc?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Classic Margherita Pizza',
      region: 'Global',
      ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Basil', 'Olive Oil'],
      tags: ['comfort', 'dinner'],
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Aglio e Olio Pasta',
      region: 'Global',
      ingredients: ['Spaghetti', 'Garlic', 'Olive Oil', 'Red Chili Flakes', 'Parsley', 'Parmesan'],
      tags: ['healthy', 'comfort'],
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Gulab Jamun',
      region: 'North Indian',
      ingredients: ['Khoya', 'Paneer', 'Maida', 'Sugar', 'Cardamom', 'Rose Water', 'Ghee'],
      tags: ['sweet', 'dessert'],
      imageUrl: 'https://images.unsplash.com/photo-1593457579893-6c84132a933f?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Pineapple Kesari Bath',
      region: 'South Indian',
      ingredients: ['Semolina', 'Pineapple', 'Sugar', 'Ghee', 'Cashews', 'Saffron'],
      tags: ['sweet', 'breakfast'],
      imageUrl: 'https://images.unsplash.com/photo-1605556277747-49f9958dc180?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Tangy Pani Puri',
      region: 'Global',
      ingredients: ['Puri', 'Potato', 'Mint', 'Tamarind', 'Spices', 'Chickpeas'],
      tags: ['street food', 'spicy', 'snack'],
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
    }
  ];

  try {
    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);
    res.json({ message: 'Recipes seeded successfully with stunning high-quality data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateRecipes, seedRecipes };
