const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    }
  ]
});

module.exports = mongoose.model('Favorite', favoriteSchema);