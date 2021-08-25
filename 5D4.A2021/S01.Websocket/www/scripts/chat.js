import IOEVENTS from '../../io-events.js';

const socket = io();

const users = [];

$(document).ready(() => {

    $("#btnSend").click(() => {
        sendMessage()
    });

    $("#txtMessage").keypress(e => {
        if(13 == e.keyCode)
            sendMessage()
    });

    $("#btnUpdateUsername").click(() => {
        const newUsername = $("#txtUsername").val();
        socket.emit(IOEVENTS.UPDATE_USERNAME, newUsername);
    })

});

//TODO: Réceptions des évenement
socket.on(IOEVENTS.USER_ONLINE, users => {
    $(".users").empty();
    users.forEach(u => {
        const userLi = createUserUI(u);
        $(".users").append(userLi);
    });
    
});

socket.on(IOEVENTS.RECEIVED, message => {
    const isFromMe = socket.id === message.sender.id;

    const newMessage = createMessageUI(message, isFromMe)
    console.log(newMessage);
    $('#chat-messages').append(newMessage);
})


function createMessageUI(message, isFromMe) {
    let messageLi = "";

    if(isFromMe) {
        messageLi = 
            `<li class="chat-left">
                <div class="chat-avatar">
                <img src="${message.sender.avatar}" alt="${message.sender.name}">
                <div class="chat-name">${message.name}</div>
                </div>  
                <div class="chat-text">${message.text}</div>
                <div class="chat-hour">${dayjs(message.timestamp).format('HH:mm')} <span class="fa fa-check-circle"></span></div>
            </li>`;
    } else {
        messageLi = 
            `<li class="chat-right">
                <div class="chat-hour">${dayjs(message.timestamp).format('HH:mm')} <span class="fa fa-check-circle"></span></div>
                <div class="chat-text">${message.text}</div>
                <div class="chat-avatar">
                    <img src="${message.sender.avatar}" alt="${message.sender.name}">
                    <div class="chat-name">${message.sender.name}</div>
                </div>
            </li>`
    }
   
    return messageLi;
}

function createUserUI(user){

    const userLi = 
        `<li class="person" data-chat="${user.id}">
            <div class="user">
                <img src="${user.avatar}" alt="${user.name}">
            </div>
            <p class="name-time">
                <span class="name">${user.name}</span>
            </p>
        </li>`;

    
    return userLi;

}

function sendMessage() {
    const message = $('#txtMessage').val();
    $('#txtMessage').val("");
    socket.emit(IOEVENTS.SEND, message);
}


