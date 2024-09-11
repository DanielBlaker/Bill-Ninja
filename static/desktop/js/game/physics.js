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

        if (checkCollision(mesh, grounds[0])) {
            console.log("Touched green block");
            createParticleEffect(mesh.position, new THREE.Color(0xff0000));
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }

        if (checkCollision(mesh, grounds[1])) {
            console.log("Touched red block");
            createParticleEffect(mesh.position, new THREE.Color(0xff0000));
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }
    }
}

function initOimoPhysics() {
    world = new OIMO.World({ info: true, worldscale: 100 });
}


function checkCollision(mesh1, mesh2) {
    var box1 = new THREE.Box3().setFromObject(mesh1);
    var box2 = new THREE.Box3().setFromObject(mesh2);
    return box1.intersectsBox(box2);
}