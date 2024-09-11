function basicTexture(n) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var colors = ["#3884AA", "#61686B", "#AA6538", "#61686B", "#AAAA38", "#61686B"];
    ctx.fillStyle = colors[n];
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}
function createTextTexture(text, fontSize = 40, fontFamily = 'Impact') {
    var dimensions = calculateTextDimensions(text, fontSize, fontFamily);
    var canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, 0, index * fontSize);
    });
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function calculateTextDimensions(text, fontSize = 20, fontFamily = 'Arial') {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    var lines = text.split('\n');
    var width = 0;
    var height = lines.length * fontSize;
    lines.forEach(line => {
        var lineWidth = ctx.measureText(line).width;
        if (lineWidth > width) {
            width = lineWidth;
        }
    });
    return { width, height };
}

function addStaticBox(size, position, rotation, material) {
    var mesh = new THREE.Mesh(geos.box, material || mats.ground);
    mesh.scale.set(size[0], size[1], size[2]);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
    scene.add(mesh);
    grounds.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function clearMesh() {
    var i = meshs.length;
    while (i--) scene.remove(meshs[i]);
    i = grounds.length;
    while (i--) scene.remove(grounds[i]);
    grounds = [];
    meshs = [];
    scene.remove(bat.mesh)
}

function addEdgeLines(mesh, color = 0x000000) {
    var edges = new THREE.EdgesGeometry(mesh.geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
    var line = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(line);
}

function createParticleEffect(mesh, targetColor) {
    var particleCount = 100;
    var particles = new THREE.Geometry();
    var boundingBox = new THREE.Box3().setFromObject(mesh);
    var size = new THREE.Vector3();
    boundingBox.getSize(size);

    var enlargedSize = size.multiplyScalar(1.4);

    function generateParticles() {
        particles.vertices = [];
        for (var i = 0; i < particleCount; i++) {
            var pX = mesh.position.x + (Math.random() - 0.5) * enlargedSize.x;
            var pY = mesh.position.y + (Math.random() - 0.5) * enlargedSize.y;
            var pZ = mesh.position.z + (Math.random() - 0.5) * enlargedSize.z;
            var particle = new THREE.Vector3(pX, pY, pZ);
            particles.vertices.push(particle);
        }
        particles.verticesNeedUpdate = true;
    }

    generateParticles();

    var pMaterial = new THREE.PointsMaterial({
        color: targetColor,
        size: 4,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    var particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    setTimeout(() => {
        generateParticles();
        setTimeout(() => {
            scene.remove(particleSystem);
            particles.dispose(); // Dispose of the geometry to free up memory
            pMaterial.dispose(); // Dispose of the material to free up memory
        }, 200);
    }, 200);
}