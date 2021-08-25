import http from 'http';
import express from 'express';

import { Server } from 'socket.io';

import IOEVENTS from './public/io-events.js';
import dayjs from 'dayjs';

const PORT = 1337;

const app = express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.use(express.static('public'));
app.use(express.static('www'));

httpServer.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});


//TODO: Connexion des clients
socketServer.on(IOEVENTS.CONNECTION, async (socket) => {
    console.log(socket.id);

    await newUser(socket);

    socket.on(IOEVENTS.SEND, async (message) => {
        const messageToBroadcast = {
            text:message,
            sender:socket.data.identity,
            timestamp: dayjs()
        }
        socketServer.emit(IOEVENTS.RECEIVED, messageToBroadcast)
    })

    socket.on(IOEVENTS.UPDATE_USERNAME, async (newUsername) => {
        socket.data.identity.name = newUsername
        sendUserIdentities()
    })

    socket.on(IOEVENTS.UPDATE_USERNAME, async (newUsername) => {
        socket.data.identity.name = newUsername
        socketServer.emit(IOEVENTS.UPDATED_USERNAME, socket.data.identity)
    })

    socket.on(IOEVENTS.DISCONNECT, reason => {
        sendUserIdentities()
    })
})

async function newUser(socket) {
    const newUser = {
        id:socket.id,
        name:'Anonyme',
        avatar: randomAvatarImage()
    }

    socket.data.identity = newUser

    await sendUserIdentities();
}


async function sendUserIdentities() {
    
    const sockets = await socketServer.fetchSockets();
    // Créer un tableau avec le data.identity de chaque socket users
    const users = sockets.map(s => s.data.identity);
    
    socketServer.emit(IOEVENTS.USER_ONLINE, users)
}

function randomAvatarImage() {
    const avatarNumber = Math.floor(Math.random() * 8 + 1);
    return `./images/avatar${avatarNumber}.png`;
}