// Para que o client se comunique com o socket.io
let socket = io('http://localhost:3000');

let nick = '';
let avatar = '';
let user = {};

function getChatUser() {
  let userStoraged = localStorage.getItem('chatUser');

  if (userStoraged !== null) {
    user = JSON.parse(userStoraged);
    $('#chatRoom').show();
    $('#loggedWith').append(`Logado como ${user.nick}`);
    $('#loggedAvatar').append(`<img
  src="${user.avatar}"
  class="rounded-circle user-img">`);
  } else {
    $('#chatLogin').show();
  };
};

// Função para fazer logout e apagar o Local Storage
function logout() {
  localStorage.removeItem('chatUser');
  window.location.href = 'http://localhost:3000';
};

// Função para renderizar as mensagens na tela
function renderMessage(message) {
  if (message.author === user.nick) {
    $('#appendDiv').append(`<div id="divStart" class="d-flex justify-content-start mb-4">
    <div class="img-cont-msg" id="avatarMe">
      <img src="${message.avatar}" class="rounded-circle user-img-msg">
    </div>
    <div id="msgContainer" class="msg-container">
      <div id="msgMe">${message.message}</div>
      <span class="msg-time" id="msgTimeMe">${message.date}</span>
    </div>
  </div>`);
  } else {
    $('#appendDiv').append(`<div id="divEnd" class="d-flex justify-content-end mb-4">
    <div id="msgContainerSend" class="msg-container-send">
      <div id="msgOther">${message.message}</div>
      <span class="msg-time" id="msgTimeOther">${message.date}</span>
    </div>
    <div class="img-cont-msg" id="avatarOther">
      <img src="${message.avatar}" class="rounded-circle user-img-msg">
    </div>
  </div>`);
  } 
};

// Recebendo as mensagens anteriores já enviadas
socket.on('previousMessage', function(messages) {
  for (message of messages) {
    renderMessage(message);
  };
});

// Recebendo a mensagem enviadas por todos os clientes
socket.on('receivedMessage', function(message) {
  renderMessage(message);
});

// Função para receber o apelido e avatar
$('#formLogin').submit(function(event) {
  event.preventDefault();
  
  nick = $('#nick').val();
  avatar = $('input[name="avatar"]:checked').val();

  if (avatar === undefined) {
    avatar = './assets/avatars/001.png';
  };

  user = {
    nick: nick,
    avatar: avatar
  };

  // Convertendo o objeto user para String
  // Para ser gravado no Local Storage
  let userStorage = JSON.stringify(user);

  // Gravando o objeto user no Local Storage
  localStorage.setItem('chatUser', userStorage);

  $('#chatLogin').hide();
  $('#chatRoom').show();

  $('#loggedWith').append(`Logado como ${user.nick}`);
  $('#loggedAvatar').append(`<img
  src="${user.avatar}"
  class="rounded-circle user-img">`);
});

// Função para enviar a mensagem do chat para o socket.io
$('#formChat').submit(function(event) {
  event.preventDefault();
  
  let message = $('#textareaMessage').val();
  let now = dateFormatted();
  
  if (message.lenght || message !== "") {
    let messageObject = {
      author: nick,
      avatar: avatar,
      message: message,
      date: now
    };

    renderMessage(messageObject);

    socket.emit('sendMessage', messageObject);

    $('#formChat').each (function() {
      this.reset();
    });
  }
});

// Função toggle do menu de opções nos ...
$(document).ready(function(){
  $('#actionMenuBtn').click(function(){
    $('.action-menu').toggle();
  });
});

// Função para formatar a data
function dateFormatted() {
  let data = new Date(),
      dia  = data.getDate().toString().padStart(2, '0'),
      mes  = (data.getMonth() + 1).toString().padStart(2, '0'), // +1 pois no getMonth Janeiro começa com 0
      ano  = data.getFullYear();
      hora = data.getHours().toString().padStart(2, '0'),
      minuto = data.getMinutes().toString().padStart(2, '0'),
      segundo = data.getSeconds().toString().padStart(2, '0')

  return `${dia}/${mes}/${ano} às ${hora}:${minuto}:${segundo}`;
};
