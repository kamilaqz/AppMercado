const Product = require('../models/product');
const Erros = require('../errors/erros');
const errosTratamento = require('../errors/errosTratamento');


exports.listAll = async (req, res) => {
    try {
        const products = await Product.find();
        if (products) {
            res.json(products);
        } else {
            throw new Erros('Não existem produtos cadastrados', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

exports.listById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            throw new Erros('Produto não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};


exports.create = async (req, res) => {
    try {
        const dadosNovoProduct = req.body;
        const productCadastrado = await new Product(dadosNovoProduct).save();
        res.status(201).json(productCadastrado);
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

/*
exports.update = async (req, res) => {
    try {
        const { nome, precoAtual, precoPromocao, tipo, descricao, dataValidade, quantidade } = req.body;
        const productAtualizado = await product.findByIdAndUpdate(
            req.params.id,
            { nome, precoAtual, precoPromocao, tipo, descricao, dataValidade, quantidade },
            { new: true }
        );
        if (productAtualizado) {
            res.json(productAtualizado);
        } else {
            throw new Erros('product não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
    }
};
*/
exports.delete = async (req, res) => {
    try {
        const productExcluido = await Product.findByIdAndRemove(req.params.id);
        if (productExcluido) {
            res.json({ message: 'Produto removido' });
        } else {
            throw new Erros('Produto não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
    }
};
/*
exports.cadastrarPromocao = async (req, res) => {
    try {
        const { nome, precoPromocao, tipo } = req.body;

        const products = await product.find({ nome, tipo });

        if (products.length === 0) {
            throw new Erros('Nenhum product encontrado com o mesmo nome e tipo', 404);
        }

        const productsAtualizados = [];

        for (const product of products) {
            const productCompleto = await product.findById(product._id);

            const productAtualizado = await atualizarproduct(product._id, {
                nome: productCompleto.nome,
                precoAtual: productCompleto.precoAtual,
                precoPromocao,
                tipo,
                descricao: productCompleto.descricao,
                dataValidade: productCompleto.dataValidade,
                quantidade: productCompleto.quantidade,
                urlImagem: productCompleto.urlImagem
            });

            productsAtualizados.push(productAtualizado);
        }

        res.json({ message: 'Promoção cadastrada para todos os products com o mesmo nome e tipo', products: productsAtualizados });

    } catch (error) {
        errosTratamento (error, res);
    }
};

async function atualizarproduct(id, dadosAtualizados) {
    try {
        const productAtualizado = await product.findByIdAndUpdate(
            id,
            dadosAtualizados,
            { new: true }
        );
        return productAtualizado;
    } catch (error) {
        throw new Error('Erro ao atualizar o product');
    }
}
*/