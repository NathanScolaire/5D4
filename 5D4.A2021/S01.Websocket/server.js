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
})

async function newUser(socket) {
    const newUser = {
        id:socket.id,
        name:'Anonyme'
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