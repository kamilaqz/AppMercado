const express = require('express');
const mongoose = require('mongoose');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const userVerificacaoRoutes = require('./src/routes/userVerificacaoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const errosTratamento = require('./src/errors/errosTratamento');

mongoose.connect("mongodb://127.0.0.1/projeto-uniMercado", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app) 
const socketIo = require('socket.io')
const io = socketIo(server, {})

io.on('connection', socket => {
    socket.on('chat', (msg) => {
        io.emit('chat', msg)
    })
    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado')
    })
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/users/verificacao', userVerificacaoRoutes);
app.use('/users/login', authRoutes);
app.use('/finalizeOrder', orderRoutes);
app.use('/favorite', favoriteRoutes);
app.use(errosTratamento);

server.listen(parseInt(3333), () => {
    console.log(`Server is running at http://localhost:mongodb://127.0.0.1/projeto-uniMercado`);
  });