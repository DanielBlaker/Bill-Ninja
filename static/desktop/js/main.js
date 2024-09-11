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
    setupEvents();
    initOimoPhysics();
}

function loop() {
    updateOimoPhysics();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function populate() {
    clearMesh();
    world.clear();
    bodys = [];

    var texts = [
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
        "The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze",
    ];
    var intervalMs = 200;

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
    var greenGlowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    var redGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 });

    var greenBlock = addStaticBox([40, 40, 390], [-180, 20, 0], [0, 0, 0], greenGlowMaterial);
    var redBlock = addStaticBox([40, 40, 390], [180, 20, 0], [0, 0, 0], redGlowMaterial);
    var floor = addStaticBox([400, 80, 400], [0, -40, 0], [0, 0, 0]);

    addEdgeLines(greenBlock, 0x00ff00);
    addEdgeLines(redBlock, 0xff0000);

    grounds.push(greenBlock);
    grounds.push(redBlock);

    world.add({ size: [40, 40, 390], pos: [-180, 20, 0], world: world });
    world.add({ size: [40, 40, 390], pos: [180, 20, 0], world: world });
    world.add({ size: [400, 80, 400], pos: [0, -40, 0], world: world });
}


function addEdgeLines(mesh, color) {
    var edges = new THREE.EdgesGeometry(mesh.geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
    var line = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(line);
}