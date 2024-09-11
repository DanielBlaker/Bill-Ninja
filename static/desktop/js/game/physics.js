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
    }
}