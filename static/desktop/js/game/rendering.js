function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, precision: "mediump", antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
}

function setupEvents() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    scene.add(new THREE.AmbientLight(0xc1c2a5));
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

function setupGeometries() {
    geos['box'] = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 1));
}

function setupMaterials() {
    var materialType = 'MeshPhongMaterial';
    mats['box'] = new THREE[materialType]({ shininess: 10, map: basicTexture(2), name: 'box' });
    mats['ground'] = new THREE[materialType]({ shininess: 10, color: 0x3D4143, transparent: true, opacity: 0.5 });
}
