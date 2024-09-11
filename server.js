const express = require('express')
const { createServer } = require('node:https')
const { Server } = require('socket.io');
const fs = require('fs')

const app = express()
const server = createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem') 
}, app);
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('acceleration', (acceleration) => {
        console.log(acceleration)
    })
    socket.on('rotation', (rotation) => {
        // console.log(JSON.stringify(rotation))
    })
    socket.onAny((eventName, ...args) => {
        // console.log(eventName, args)
    });
});

app.use(express.static('static'))

server.listen(443, '10.50.0.230', function (err) {
    if (err) console.log(err);
    console.log("Live at :8080")
});