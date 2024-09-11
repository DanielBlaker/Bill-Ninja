// Global variables
var camera, scene, light, renderer, canvas, controls;
var meshs = [], grounds = [], bodys = [];
var geos = {}, mats = {};
var world = null;
var ToRad = Math.PI / 360;
var floor;

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
    setupBat();
    setupEvents();
    initOimoPhysics();
}

function setupScene() {
    canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
}

function loop() {
    updateOimoPhysics();
    renderer.render(scene, camera);
    updateBat();
    requestAnimationFrame(loop);
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

    addGrounds();

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

function addGrounds() {
    world.add({ size: [40, 40, 390], pos: [-180, 20, 0], world: world });
    world.add({ size: [40, 40, 390], pos: [180, 20, 0], world: world });
    world.add({ size: [400, 80, 400], pos: [0, -40, 0], world: world });

    floor = addStaticBox([400, 80, 400], [0, -40, 0], [0, 0, 0]);
    addStaticBox([40, 40, 390], [-180, 20, 0], [0, 0, 0]);
    addStaticBox([40, 40, 390], [180, 20, 0], [0, 0, 0]);
}