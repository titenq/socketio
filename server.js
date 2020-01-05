const express = require('express');
const path = require('path');

const app = express();
// define o server http
const server = require('http').createServer(app);
// define o server wss
const io = require('socket.io')(server);
// define o diretório público
app.use(express.static(path.join(__dirname, 'public')));
// define as views
app.set('views', path.join(__dirname, 'public'));
// define a engine para os arquivos estáticos de ejs para html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// criando o server e renderizar o index.html por padrão
app.use('/', (req, res) => {
  res.render('index.html')
});

// variável que vai receber as mensagens
let messages = [];

// recebendo o socket de cada cliente conectado
io.on('connection', socket => {
  console.log(`Socket conectado com o id ${socket.id}`);

  // adicionando as mensagens já enviadas para a variável messages
  // para que um socket novo pegar as mensagens antigas
  socket.emit('previousMessage', messages);

  socket.on('sendMessage', data => {
    let object = JSON.stringify(data);
    console.log(`data: ${object}`);

    // adicionando a mensagem para a variável messages
    messages.push(data);
    
    // enviando a mensagem recebida para todos os clientes
    socket.broadcast.emit('receivedMessage', data);
  });
});

// ouvindo a porta 3000
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000.');
});
