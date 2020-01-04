// Para que o client se comunique com o socket.io
let socket = io('http://localhost:3000');

// Função para enviar a mensagem do chat para o socket.io
$('#chat').submit(function(event) {
  event.preventDefault();
  
  let message = $('#textareaMessage').val();
  let author = socket.id;
  let date = new Date;

  let messageObject = {
    author: author,
    message: message,
    date: date
  };
  
  if (message.lenght || message !== "") {
    let messageObject = {
      author: author,
      message: message,
      date: date
    }
    socket.emit('sendMessage', messageObject);
  }
});

// Função toggle do menu de opções nos ...
$(document).ready(function(){
  $('#action_menu_btn').click(function(){
    $('.action_menu').toggle();
  });
});
