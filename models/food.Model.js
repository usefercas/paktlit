const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  ingredients: [String],
  nutritionGrade: { type: String, enum: ['A', 'B', 'C', 'D', 'E'] },
  // Otros campos que tengas en tus documentos de alimentos
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
