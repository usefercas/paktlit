const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  },
  image: {
    type: String, // Suponiendo que guardarás la URL de la imagen
  },
  // Otros campos relacionados con la receta...
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
