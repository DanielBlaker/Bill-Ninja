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
    initOimoPhysics();
    populate()
}

function loop() {
    updateOimoPhysics();
    renderer.render(scene, camera);
    updateBat();
    requestAnimationFrame(loop);
}
function populate() {
    clearMesh();
    world.clear();
    
    bodys = [];

    var texts = [
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"],
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"],
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"],
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"],
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"],
        ["The Expense Is", "By Daniel", "100 AUD", "Spent On Cheeze", "Decision?"]
    ];

    let delayBetweenArrays = 10000; // 2 seconds delay before starting the next array
    let totalDelay = 0;

    texts.forEach((arr, index) => {
        setTimeout(() => {
            dropExpence(arr);
        }, totalDelay);
        totalDelay += delayBetweenArrays + arr.length * 200; // Add delay for each string block
    });

    addGrounds();
}

function dropExpence(texts) {
    var index = 0;
    function dropNextText() {
        if (index < texts.length) {
            var isDecision = index === texts.length - 1;
            addObject(texts[index], isDecision);
            index++;
            setTimeout(dropNextText, 1000);
        }
    }
    dropNextText();
    setupBat();
}

function addObject(text, isDecision) {
    var x = -100 + Math.random() * 200;
    var z = -100 + Math.random() * 200;
    var y = 100 + Math.random() * 1000;

    var textDimensions = calculateTextDimensions(text);
    var w = textDimensions.width * (1 + Math.random() / 5);
    var h = textDimensions.height * (1 + Math.random() / 5);
    var d = 5 + Math.random() * 10;

    var body = world.add({ type: 'box', size: [w, h, d], pos: [x, y, z], move: true, world: world });
    
    // Create glowing material
    var material = new THREE.MeshBasicMaterial({
        map: createTextTexture(text),
        emissive: isDecision ? new THREE.Color(0x000010) : new THREE.Color(0x000000)
    });

    var mesh = new THREE.Mesh(geos.box, material);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Attach `isDecision` property
    mesh.isDecision = isDecision;

    scene.add(mesh);
    bodys.push(body);
    meshs.push(mesh);

    if (isDecision) {
        addEdgeLines(mesh);
    }
}


function addGrounds() {
    var greenGlowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    var redGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 });

    var greenBlock = addStaticBox([40, 40, 390], [-180, 20, 0], [0, 0, 0], greenGlowMaterial);
    var redBlock = addStaticBox([40, 40, 390], [180, 20, 0], [0, 0, 0], redGlowMaterial);
    var floor = addStaticBox([400, 80, 400], [0, -40, 0], [0, 0, 0]);

    addEdgeLines(greenBlock);
    addEdgeLines(redBlock);

    grounds.push(greenBlock);
    grounds.push(redBlock);

    world.add({ size: [40, 40, 390], pos: [-180, 20, 0], world: world });
    world.add({ size: [40, 40, 390], pos: [180, 20, 0], world: world });
    world.add({ size: [400, 80, 400], pos: [0, -40, 0], world: world });
}
