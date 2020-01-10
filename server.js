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

// variável que vai receber os usuários conectados
let usersConnected = [];

// recebendo o socket de cada cliente conectado
io.on('connection', socket => {
  console.log(`Socket conectado com o id ${socket.id}`);

  // adicionando as mensagens já enviadas para a variável messages
  // para que um socket novo pegar as mensagens antigas
  socket.emit('previousMessage', messages);

  // enviando o userLogged para todos os clientes
  socket.broadcast.emit('previousUser', usersConnected);

  socket.on('sendMessage', data => {
    // adicionando a mensagem para a variável messages
    messages.push(data);
    
    // enviando a mensagem recebida para todos os clientes
    socket.broadcast.emit('receivedMessage', data);
  });

  // recebendo o usersLogged
  socket.on('usersLogged', user => {
    // adicionando o usuário conectado para a variável usersConnected
    usersConnected.push(user);

    socket.broadcast.emit('userInChat', user);
  });

  // recebendo o usersLogged
  socket.on('userLogout', user => {
    let index = usersConnected.indexOf(user);

    if (index > -1) {
      usersConnected.splice(index, 1);
    };

    socket.broadcast.emit('previousUser', usersConnected);
  });
});

// ouvindo a porta 3000
let port = process.env.port || 8080;
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
