const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io');

const app = express()
const server = createServer(app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.use(express.static('static'))

server.listen(8080, function (err) {
    if (err) console.log(err);
    console.log("Live at :8080")
});