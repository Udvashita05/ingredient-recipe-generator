const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true }, // e.g. Bengali, South Indian, North Indian
  ingredients: [{ type: String, required: true }],
  tags: [{ type: String }], // e.g. spicy, dessert, healthy, sweet, comfort
  imageUrl: { type: String }, // Can be mocked
  youtubeQuery: { type: String } // Original search query
});

module.exports = mongoose.model('Recipe', recipeSchema);
