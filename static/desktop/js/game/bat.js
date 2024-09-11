var bat = null;

function setupBat() {
    if (bat != null) return;
    bat = { mesh: null, body: null };

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
        world: world,
        isKinematic: true
    });
}

function updateBat() {
    if (bat == null) return;

    bat.mesh.rotation.set(batRotation.x, batRotation.y, batRotation.z)
    var quat = bat.mesh.quaternion;
    bat.body.orientation.x = quat.x
    bat.body.orientation.y = quat.y
    bat.body.orientation.z = quat.z
    bat.body.orientation.w = quat.w
    bat.body.isStatic = false

    // bat.body.angularVelocity.x = batRotation.x * 360/3.14/2
    // bat.body.angularVelocity.y = batRotation.y * 360/3.14/2
    // bat.body.angularVelocity.z = batRotation.z * 360/3.14/2

    bat.body.kinematic = true
    console.log(bat.body)

    bat.mesh.position.copy(bat.body.getPosition());
    bat.mesh.quaternion.copy(bat.body.getQuaternion());
}