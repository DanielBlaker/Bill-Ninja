

let speed = 0;
const scalingFactor = 10; // Adjust this factor to control how much farther the objects move

function client() {
    const socket = io();
    const orientationDisplay = document.getElementById('orientation');

    function handleOrientation(event) {
        const { alpha, beta, gamma } = event;
        const data = { alpha, beta, gamma };
        socket.emit('acceleration', data);
        orientationDisplay.textContent = `Alpha: ${alpha?.toFixed(2)}, Beta: ${beta?.toFixed(2)}, Gamma: ${gamma?.toFixed(2)}`;
    }

    function requestOrientationPermission() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        orientationDisplay.textContent = 'Permission to access device orientation was denied';
                    }
                })
                .catch(console.error);
        } else if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else {
            orientationDisplay.textContent = 'Device Orientation API not supported.';
        }
    }
    document.getElementById('startButton').addEventListener('click', requestOrientationPermission);
}

if (typeof document !== "undefined") {
    client();
}