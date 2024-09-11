const socket = io();

var batRotation = { x: 0, y: 0, z: 0}

socket.on('rotation', console.log);
socket.on('acceleration', (e) => {
    console.log(e)
    batRotation.x = (e.beta/360)*2*3.142
    batRotation.y = (e.alpha/360)*2*3.142
    batRotation.z = -(e.gamma/360)*2*3.142
})