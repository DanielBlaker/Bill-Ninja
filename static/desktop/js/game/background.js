function setupBackground() {
    var buffgeoBack = new THREE.BufferGeometry();
    buffgeoBack.fromGeometry(new THREE.IcosahedronGeometry(3000, 2));
    var back = new THREE.Mesh(buffgeoBack, new THREE.MeshBasicMaterial({
        map: gradTexture([[0.75, 0.6, 0.4, 0.25], ['#1B1D1E', '#3D4143', '#72797D', '#b0babf']]),
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
    }));
    scene.add(back);
}

function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    var size = 1024;
    c.width = 16; c.height = size;
    var gradient = ct.createLinearGradient(0, 0, 0, size);
    for (var i = 0; i < color[0].length; i++) {
        gradient.addColorStop(color[0][i], color[1][i]);
    }
    ct.fillStyle = gradient;
    ct.fillRect(0, 0, 16, size);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}