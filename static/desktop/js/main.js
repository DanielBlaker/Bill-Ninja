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
        ["By Daniel", "20 GBP", "At Ye Olde Pub", "Work Drinkees", "Decision?"],
        ["By Daniel", "100 JPY", "At Crown Hotel", "Work Trip", "Decision?"],
        ["By Daniel", "100 AUD", "At Kobab", "Big Lunch!", "Decision?"],
    ];

    let delayBetweenArrays = 5000; // 1 minute delay before starting the next array
    let totalDelay = 0;

    texts.forEach((arr, index) => {
        setTimeout(() => {
            dropExpence(arr);
        }, totalDelay);
        totalDelay += delayBetweenArrays + arr.length * 900; // Add delay for each string block
    });

    addGrounds();
}

function dropExpence(texts) {
    var index = 0;
    function dropNextText() {
        if (index < texts.length) {
            var isDecision = index === texts.length - 1;
            addObject(texts, index, isDecision);
            index++;
            setTimeout(dropNextText, 900);
        }
    }
    dropNextText();
    setupBat();
}

function addObject(texts, textIndex, isDecision) {
    var x = -100 + Math.random() * 200;
    var z = -100 + Math.random() * 200;
    var y = 500 + Math.random() * 100;

    var text = texts[textIndex];
    var textDimensions = calculateTextDimensions(text);
    var w = textDimensions.width * (1 + Math.random() / 5);
    var h = textDimensions.height * (1 + Math.random() / 5);
    var d = 5 + Math.random() * 10;

    var body = world.add({ type: 'box', size: [w, h, d], pos: [x, y, z], move: true, world: world });
    
    var material = new THREE.MeshBasicMaterial({
        map: createTextTexture(text),
    });

    var material = new THREE.MeshBasicMaterial({
        map: createTextTexture(text),
    });

    var mesh = new THREE.Mesh(geos.box, material);
    
    if (isDecision) {
        mesh.scale.set(w * 2, h * 2, d * 2); 
        mesh.material.color = new THREE.Color(0xf000f0);  
        mesh.attachedTexts = texts;
        addEdgeLines(mesh);
    } else {
        mesh.scale.set(w, h, d);
    }
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.isDecision = isDecision;

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

    addEdgeLines(greenBlock);
    addEdgeLines(redBlock);

    grounds.push(greenBlock);
    grounds.push(redBlock);

    world.add({ size: [40, 40, 390], pos: [-180, 20, 0], world: world });
    world.add({ size: [40, 40, 390], pos: [180, 20, 0], world: world });
    world.add({ size: [400, 80, 400], pos: [0, -40, 0], world: world });
}
