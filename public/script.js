// Para que o client se comunique com o socket.io
let socket = io('http://localhost:3000');

// Função para renderizar as mensagens na tela
function renderMessage(message) {
  if (message.author === socket.id) {
    $('#appendDiv').append(`<div id="divStart" class="d-flex justify-content-start mb-4">
    <div class="img-cont-msg" id="avatarMe">
      <img src="./assets/superman.jfif" class="rounded-circle user-img-msg">
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
      <img src="./assets/wonderwoman.jfif" class="rounded-circle user-img-msg">
    </div>
  </div>`);
  } 
};

// Recebendo a mensagem enviadas por todos os clientes
socket.on('receivedMessage', function(message) {
  renderMessage(message);
});

// Função para enviar a mensagem do chat para o socket.io
$('#chat').submit(function(event) {
  event.preventDefault();
  
  let message = $('#textareaMessage').val();
  let author = socket.id;
  let now = dateFormatted();
  
  if (message.lenght || message !== "") {
    let messageObject = {
      author: author,
      message: message,
      date: now
    };

    renderMessage(messageObject);

    socket.emit('sendMessage', messageObject);
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
