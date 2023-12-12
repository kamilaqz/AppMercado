const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    image: String,
    expirationDate: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;