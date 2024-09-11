var bat = null;

function setupBat() {
    var mesh = new THREE.Mesh(geos.box, material || mats.ground);
    mesh.scale.set(10, 10, 100);
    mesh.position.set(0, 0, 10);
    scene.add(mesh);
    grounds.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function updateBat() {
    bat.rotation.set(batRotation.x, batRotation.y, batRotation.z)
}