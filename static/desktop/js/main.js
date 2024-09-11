// Global variables
var camera, scene, light, renderer, canvas, controls;
var meshs = [], grounds = [], bodys = [];
var geos = {}, mats = {};
var antialias = true;
var world = null;
var ToRad = 0.0174532925199432957;
var infos, floor;

// Initialize and start the loop
init();
loop();

function init() {
    setupScene();
    setupRenderer();
    setupCamera();
    setupControls();
    setupLights();
    setupBackground();
    setupGeometries();
    setupMaterials();
    setupEvents();
    initOimoPhysics();
}

function setupScene() {
    infos = document.getElementById("info");
    canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, precision: "mediump", antialias: antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
}

function setupCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 160, 400);
}

function setupControls() {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 20, 0);
    controls.update();
}

function setupLights() {
    scene.add(new THREE.AmbientLight(0x3D4143));
    light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(300, 1000, 500);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    var d = 300;
    light.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 500, 1600);
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
    scene.add(light);
}

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

function setupGeometries() {
    geos['sphere'] = new THREE.BufferGeometry().fromGeometry(new THREE.SphereGeometry(1, 16, 10));
    geos['box'] = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 1));
    geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1, 1, 1));
}

function setupMaterials() {
    var materialType = 'MeshPhongMaterial';
    mats['sph'] = new THREE[materialType]({ shininess: 10, map: basicTexture(0), name: 'sph' });
    mats['box'] = new THREE[materialType]({ shininess: 10, map: basicTexture(2), name: 'box' });
    mats['cyl'] = new THREE[materialType]({ shininess: 10, map: basicTexture(4), name: 'cyl' });
    mats['ground'] = new THREE[materialType]({ shininess: 10, color: 0x3D4143, transparent: true, opacity: 0.5 });
}

function setupEvents() {
    window.addEventListener('resize', onWindowResize, false);
}

function loop() {
    updateOimoPhysics();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
}

function initOimoPhysics() {
    world = new OIMO.World({ info: true, worldscale: 100 });
    populate();
}

function populate() {
    clearMesh();
    world.clear();
    bodys = [];

    var texts = ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze"];
    var intervalMs = 2000;


    var expenceText = "The Expence Is";
    var letterTexture = createTextTexture(expenceText);
    var letterMaterial = new THREE.MeshBasicMaterial({ map: letterTexture });

    addGrounds(letterMaterial);

    var index = 0;
    function dropNextText() {
        if (index < texts.length) {
            addObject(texts[index]);
            index++;
            setTimeout(dropNextText, intervalMs);
        }
    }
    dropNextText();
}

function addObject(text) {
    var x = -100 + Math.random() * 200;
    var z = -100 + Math.random() * 200;
    var y = 100 + Math.random() * 1000;

    var textDimensions = calculateTextDimensions(text);
    var w = textDimensions.width * (1 + Math.random() / 5);
    var h = textDimensions.height * (1 + Math.random() / 5);
    var d = 5 + Math.random() * 10;

    var body = world.add({ type: 'box', size: [w, h, d], pos: [x, y, z], move: true, world: world });
    var mesh = new THREE.Mesh(geos.box, new THREE.MeshBasicMaterial({ map: createTextTexture(text) }));
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    bodys.push(body);
    meshs.push(mesh);
}

function addGrounds(letterMaterial) {
    world.add({ size: [40, 40, 390], pos: [-180, 20, 0], world: world });
    world.add({ size: [40, 40, 390], pos: [180, 20, 0], world: world });
    world.add({ size: [400, 80, 400], pos: [0, -40, 0], world: world });

    floor = addStaticBox([400, 80, 400], [0, -40, 0], [0, 0, 0]);
    addStaticBox([40, 40, 390], [-180, 20, 0], [0, 0, 0]);
    addStaticBox([40, 40, 390], [180, 20, 0], [0, 0, 0], letterMaterial);
}


function updateOimoPhysics() {
    if (!world) return;

    world.step();
    for (var i = 0; i < bodys.length; i++) {
        var body = bodys[i];
        var mesh = meshs[i];
        mesh.position.copy(body.getPosition());
        mesh.quaternion.copy(body.getQuaternion());

        if (mesh.material.name === 'sbox') mesh.material = mats.box;
        if (mesh.material.name === 'ssph') mesh.material = mats.sph;
        if (mesh.material.name === 'scyl') mesh.material = mats.cyl;

        if (mesh.position.y < -100) {
            var x = -100 + Math.random() * 200;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            body.resetPosition(x, y, z);
        }
    }
    infos.innerHTML = "Test text";
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

function createTextTexture(text, fontSize = 20, fontFamily = 'Impact') {
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

const socket = io();
socket.on('rotation', console.log);
socket.on('acceleration', (e) => {
    console.log(e)
    floor.rotation.y = (e.alpha/360)*2*3.142
    floor.rotation.x = (e.beta/360)*2*3.142
    floor.rotation.z = -(e.gamma/360)*2*3.142
    console.log(floor.rotation)
})