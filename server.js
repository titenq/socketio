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

// ouvindo a porta 3000
server.listen(3000);
