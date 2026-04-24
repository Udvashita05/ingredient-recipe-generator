const express = require('express');
const { generateRecipes, seedRecipes } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-recipes', protect, generateRecipes);
router.post('/seed', seedRecipes); // Optional endpoint to quickly populate DB

module.exports = router;
