const Order = require('../models/order');
const Product = require('../models/product');

exports.finalizeOrder = async (req, res) => {
    try {
      const { products } = req.body;
  
      // Calcular o preço total da compra
      const totalAmount = products.reduce((total, product) => {
        return total + (product.total || 0); // Certificar-se de que product.total é um número válido
      }, 0);
  
      // Mapear os produtos para incluir a quantidade e o preço total
      const orderProducts = products.map(product => ({
        product: product._id,
        quantity: product.quantity || 0, // Certificar-se de que product.quantity é um número válido
        total: product.total || 0, // Certificar-se de que product.total é um número válido
      }));
  
      // Criar o pedido no banco de dados
      const newOrder = await Order.create({ products: orderProducts, totalAmount });
  
      // Atualizar a quantidade disponível dos produtos no banco
      await Promise.all(products.map(async (product) => {
        if (product && product._id) {
          const updatedProduct = await Product.findById(product._id);
          if (updatedProduct) {
            updatedProduct.quantity -= product.quantity || 0;
            await updatedProduct.save();
          }
        }
      }));
  
      res.status(201).json({ message: 'Compra finalizada com sucesso!', order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao finalizar a compra.' });
    }
  };

exports.getFinishedOrders = async (req, res) => {
    try {
      const finishedOrders = await Order.find().populate({
        path: 'products.product',
        model: 'Product',
      });
  
      res.status(200).json(finishedOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter a lista de compras finalizadas.' });
    }
};