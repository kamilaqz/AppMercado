const User = require('../models/user');
const Erros = require('../errors/erros');
const errosTratamento = require('../errors/errosTratamento');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
    
        const userExiste = await User.findOne({email});

        if (!userExiste) {
            throw new Erros('Usuário não encontrado', 404);
        }
        
        if (userExiste.password !== password) {
            throw new Erros('E-mail ou senha incorretos', 401);
        }
    
        const tokenResult = await jwt.sign({email, password}, 'secreto');
        
        const mensagem = "Usuário logado no sistema";
    
        return res.status(200).json({ mensagem, userData: {token: tokenResult, login: req.body.login, name: userExiste.name}});
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};