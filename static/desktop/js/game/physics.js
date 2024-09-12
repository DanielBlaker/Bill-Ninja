function updateOimoPhysics() {
    if (!world) return;

    world.step();
    for (var i = 0; i < bodys.length; i++) {
        var body = bodys[i];
        var mesh = meshs[i];
        mesh.position.copy(body.getPosition());
        mesh.quaternion.copy(body.getQuaternion());

        if (mesh.material.name === 'sbox') mesh.material = mats.box;

        if (mesh.position.y < -100) {
            var x = -100 + Math.random() * 200;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            body.resetPosition(x, y, z);
        }

        if (bat !== null && checkCollision(mesh, bat.mesh)) {
            console.log("Touched bat");
            createParticleEffect(mesh, new THREE.Color(0x0000ff));
            handleBatCollision(body, mesh, bat.mesh)
        }

        if (checkCollision(mesh, grounds[0])) {
            console.log("Touched green block");
            createParticleEffect(mesh, new THREE.Color(0x00ff00));
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }

        if (checkCollision(mesh, grounds[1])) {
            console.log("Touched red block");
            createParticleEffect(mesh, new THREE.Color(0xff0000));
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }
    }
}

function initOimoPhysics() {
    world = new OIMO.World({ info: true, worldscale: 100, gravity: [0, -1, 0] });
}


function checkCollision(mesh1, mesh2) {
    console.log("checking collision between", mesh1, mesh2);
    var box1 = new THREE.Box3().setFromObject(mesh1);
    var box2 = new THREE.Box3().setFromObject(mesh2);
    return box1.intersectsBox(box2);
}

function handleBatCollision(body, mesh, batMesh) {

    // Get the positions of the bat and the mesh
    const meshPosition = mesh.position.clone();
    const batPosition = batMesh.position.clone();

    // Determine the direction of the hit
    const hitDirection = meshPosition.x - batPosition.x;

    // Move the mesh based on the direction of the hit
    if (hitDirection > 0) {
        // Bat hit from right to left
        body.resetPosition(meshPosition.x + 10, meshPosition.y, meshPosition.z);
    } else {
        // Bat hit from left to right
        body.resetPosition(meshPosition.x - 10, meshPosition.y, meshPosition.z);
    }
}