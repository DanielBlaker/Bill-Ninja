var bat = { mesh: null, body: null };

function setupBat() {
    if (bat.mesh != null) return;

    var mat = new THREE.MeshBasicMaterial({ color: 0x444444 })
    var mesh = new THREE.Mesh(geos.box, mat);
    mesh.scale.set(30, 30, 350);
    mesh.position.set(0, 200, 50);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bat.mesh = mesh;
    scene.add(bat.mesh);

    bat.body = world.add({
        type: 'box',
        size: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        pos: [mesh.position.x, mesh.position.y, mesh.position.z],
        move: false,
        world: world
    });
}

function updateBat() {
    // bat.body.rot = ([batRotation.x * 360/3.14/2, batRotation.y * 360/3.24/2, batRotation.z * 360/3.14/2])
    bat.mesh.rotation.set(batRotation.x, batRotation.y, batRotation.z)
    // bat.mesh.quaternion.copy(bat.body.getQuaternion());
    var quat = bat.mesh.quaternion;
    // bat.body.position = bat.mesh.position.clone();
    // bat.body.orientation = quat // [quat.x, quat.y, quat.z, quat.w];
    bat.body.orientation.x = quat.x
    bat.body.orientation.y = quat.y
    bat.body.orientation.z = quat.z
    bat.body.orientation.w = quat.w
    // bat.body.rot.x++;
    console.log(bat.body)
    // bat.mesh.quaternion.set(quat.x, quat.y, quat.z,quat.w)

    // bat.body.position.x = bat.mesh.position.x
    // bat.body.position.y = bat.mesh.position.y
    // bat.body.position.z = bat.mesh.position.z

    bat.mesh.position.copy(bat.body.getPosition());
    bat.mesh.quaternion.copy(bat.body.getQuaternion());
}