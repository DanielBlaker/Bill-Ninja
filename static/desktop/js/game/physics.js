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
            createParticleEffect(mesh, new THREE.Color(0x00ff00));
            if (mesh.isDecision && mesh.attachedTexts) {
                displayTextsInBackground(mesh.attachedTexts, new THREE.Color(0x00ff00));
            }
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }

        if (checkCollision(mesh, grounds[1])) {
            console.log("Touched red block");
            createParticleEffect(mesh, new THREE.Color(0xff0000));
            if (mesh.isDecision && mesh.attachedTexts) {
                displayTextsInBackground(mesh.attachedTexts, new THREE.Color(0xff0000));
            }
            scene.remove(mesh);
            world.removeRigidBody(body);
            bodys.splice(i, 1);
            meshs.splice(i, 1);
        }
    }
}

function displayTextsInBackground(texts, color) {
    if (!texts || texts.length === 0) return;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 512;

    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
    context.font = 'bold 100px Arial';  // Smaller font size
    context.textAlign = 'center';

    texts.forEach((text, i) => {
        context.fillText(text, canvas.width / 2, 150 + i * 150);
    });

    var texture = new THREE.CanvasTexture(canvas);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
    var planeGeometry = new THREE.PlaneGeometry(800, 400);  // Smaller plane
    var plane = new THREE.Mesh(planeGeometry, material);

    plane.position.set(0, 200, -1000);  // Placed further away
    plane.scale.set(5, 2.5, 1);  // Slightly reduced scale
    scene.add(plane);

    setTimeout(() => {
        scene.remove(plane);
    }, 2000);
}

function initOimoPhysics() {
    world = new OIMO.World({ info: true, worldscale: 100, gravity: [0, -1, 0] });
}


function checkCollision(mesh1, mesh2) {
    var box1 = new THREE.Box3().setFromObject(mesh1);
    var box2 = new THREE.Box3().setFromObject(mesh2);
    return box1.intersectsBox(box2);
}