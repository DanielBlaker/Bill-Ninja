const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io');
const fs = require('fs')

const app = express()
const server = createServer({
    // key: fs.readFileSync('./server.key'),
    // cert: fs.readFileSync('./server.cert'),
    // requestCert: false,
    // rejectUnauthorized: false
}, app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('acceleration', (acceleration) => {
        console.log(acceleration)
        socket.broadcast.emit('acceleration', acceleration)
    })
    socket.on('rotation', (rotation) => {
        // console.log(JSON.stringify(rotation))
        socket.broadcast.emit('rotation', rotation)
    })
});

app.use(express.static('static'))

server.listen(8080, 'localhost', function (err) {
    if (err) console.log(err);
    console.log("Live at :8080")
});