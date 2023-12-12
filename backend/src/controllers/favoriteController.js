const Favorite = require('../models/favorite');
const Erros = require('../errors/erros');
const errosTratamento = require('../errors/errosTratamento');

exports.listAll = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('products.product');
    res.json(favorites);
  } catch (error) {
    errosTratamento(error, res);
  }
};

exports.create = async (req, res) => {
  try {
    const { productId } = req.body;

    const existingFavorite = await Favorite.findOne({
      'products.product': productId,
    });

    if (existingFavorite) {
      throw new Erros('Produto já está nos favoritos.');
    }

    const newFavorite = new Favorite({
      products: [{ product: productId }],
    });

    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    errosTratamento(error, res);
  }
};

/*exports.delete = async (req, res) => {
    try {
        const existingFavorite = await Favorite.findByIdAndRemove(req.params.id);
        if (existingFavorite) {
            res.json({ message: 'Favorito removido' });
        } else {
            throw new Erros('Favorito não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
    }
};*/
exports.delete = async (req, res) => {
    try {
        const productId = req.params.id;
        const existingFavorite = await Favorite.findOneAndRemove({ 'products.product': productId });

        if (existingFavorite) {
            res.json({ message: 'Favorito removido' });
        } else {
            throw new Erros('Favorito não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
    }
};