const User = require('../models/user');
const Erros = require('../errors/erros');
const errosTratamento = require('../errors/errosTratamento');

exports.listAll = async (req, res) => {
    try {
        const users = await User.find();
        if (users) {
            res.json(users);
        } else {
            throw new Erros('Não existem usuários cadastrados', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

exports.listById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            throw new Erros('Usuário não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

exports.listByEmail = async (req, res) => {
    try {
        const user = await User.findById(req.params.email);
        if (user) {
            res.json(user);
        } else {
            throw new Erros('Usuário não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

exports.create = async (req, res) => {
    try {
        const dadosNovoUser = req.body;
        const userCadastrado = await new User(dadosNovoUser).save();
        res.status(201).json(userCadastrado);
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

/*exports.update = async (req, res) => {
    try {
        const { nome, idade, matricula, cpf, endereco, telefone } = req.body;
        const funcionarioAtualizado = await Funcionario.findByIdAndUpdate(
            req.params.id,
            { nome, idade, matricula, cpf, endereco, telefone },
            { new: true }
        );
        if (funcionarioAtualizado) {
            res.json(funcionarioAtualizado);
        } else {
            throw new Erros('Funcionário não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const funcionarioExcluido = await Funcionario.findByIdAndRemove(req.params.id);
        if (funcionarioExcluido) {
            res.json({ message: 'Funcionário removido' });
        } else {
            throw new Erros('Funcionário não encontrado', 404);
        }
    } catch (error) {
        errosTratamento (error, res);
        console.error(error);
    }
};*/

exports.verificarUser = async (req, res) => {
    try {
      const { email } = req.params;
  
      const userExistente = await User.findOne({ email });
  
      if (userExistente) {
        res.json({ existe: true });
      } else {
        res.json({ existe: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
      const userEmail = req.body.email;
  
      if (!userEmail) {
        return res.status(400).json({ error: 'Email não fornecido' });
      }
  
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      res.json({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
      console.error(error);
    }
  };