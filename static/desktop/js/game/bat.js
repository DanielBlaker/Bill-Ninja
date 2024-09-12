var bat = null;

function setupBat() {
    if (bat != null) return;
    bat = { mesh: null, body: null };

    // Create the material for the bat
    var mat = new THREE.MeshStandardMaterial({ color: 0xd4c46a });
    var handleMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    // Create the bat blade (rectangular part)
    var bladeGeometry = new THREE.BoxGeometry(30, 60, 350); // width, height, depth
    var bladeMesh = new THREE.Mesh(bladeGeometry, mat);

    // Create the handle (cylindrical part)
    var handleGeometry = new THREE.CylinderGeometry(10, 10, 100, 32); // radiusTop, radiusBottom, height, radialSegments
    var handleMesh = new THREE.Mesh(handleGeometry, handleMat);

    // Position the handle
    bladeMesh.position.set(0, 0, -200); // Adjust position to align with the blade

    // Rotate the handle to align with the blade
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.rotation.y = Math.PI / 2;

    // Create a pivot group and add the blade and handle to it
    var pivot = new THREE.Group();
    pivot.add(bladeMesh);
    pivot.add(handleMesh);

    // Position the pivot group
    pivot.position.set(0, 175, 0); // Adjust this position if needed

    // Update the bat mesh and add to the scene
    bat.mesh = pivot;
    mesh = bat.mesh
    scene.add(bat.mesh);

    // Set up the physical body with correct position and size
    bat.body = world.add({
        type: 'box',
        size: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        pos: [mesh.position.x, mesh.position.y, pivot.position.z+200],
        move: false,
        world: world,
        isKinematic: true
    });
}

function updateBat() {
    if (bat == null) return;

    bat.mesh.rotation.set(batRotation.x, batRotation.y-Math.PI/2, batRotation.z)
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