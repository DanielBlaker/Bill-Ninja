
const socket = io();
socket.on('rotation', console.log);
socket.on('acceleration', (e) => {
    console.log(e)
    floor.rotation.y = (e.alpha/360)*2*3.142
    floor.rotation.x = (e.beta/360)*2*3.142
    floor.rotation.z = -(e.gamma/360)*2*3.142
    console.log(floor.rotation)
})