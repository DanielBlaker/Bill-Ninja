// three var
var camera, scene, light, renderer, canvas, controls;
var meshs = [];
var grounds = [];

var antialias = true;

var geos = {};
var mats = {};

//oimo var
var world = null;
var bodys = [];

var ToRad = 0.0174532925199432957;
var infos;

init();
loop();

function init() {
    infos = document.getElementById("info");
    canvas = document.getElementById("canvas");

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 0, 160, 400 );

    controls = new THREE.OrbitControls( camera, canvas );
    controls.target.set(0, 20, 0);
    controls.update();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas:canvas, precision: "mediump", antialias:antialias });
    renderer.setSize( window.innerWidth, window.innerHeight );

    var materialType = 'MeshBasicMaterial';
    
    scene.add( new THREE.AmbientLight( 0x3D4143 ) );
    light = new THREE.DirectionalLight( 0xffffff , 1.4);
    light.position.set( 300, 1000, 500 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;

    var d = 300;
    light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  500, 1600 );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;

    scene.add(light);

    materialType = 'MeshPhongMaterial';

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;

    // background
    var buffgeoBack = new THREE.BufferGeometry();
    buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(3000,2) );
    var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[0.75,0.6,0.4,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false, fog:false }  ));
    //back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
    scene.add( back );

    // geometrys
    geos['sphere'] = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(1,16,10));
    geos['box'] = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry(1,1,1));
    geos['cylinder'] = new THREE.BufferGeometry().fromGeometry(new THREE.CylinderGeometry(1,1,1));

    // materials
    mats['sph']    = new THREE[materialType]( {shininess: 10, map: basicTexture(0), name:'sph' } );
    mats['box']    = new THREE[materialType]( {shininess: 10, map: basicTexture(2), name:'box' } );
    mats['cyl']    = new THREE[materialType]( {shininess: 10, map: basicTexture(4), name:'cyl' } );
    mats['ground'] = new THREE[materialType]( {shininess: 10, color:0x3D4143, transparent:true, opacity:0.5 } );

    // events
    window.addEventListener('resize', onWindowResize, false);

    // physics
    initOimoPhysics();
}

function loop() {
    updateOimoPhysics();
    renderer.render( scene, camera );
    requestAnimationFrame(loop);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addStaticBox(size, position, rotation) {
    var mesh = new THREE.Mesh( geos.box, mats.ground );
    mesh.scale.set( size[0], size[1], size[2] );
    mesh.position.set( position[0], position[1], position[2] );
    mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
    scene.add( mesh );
    grounds.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh
}

function clearMesh(){
    var i=meshs.length;
    while (i--) scene.remove(meshs[i]);
    i = grounds.length;
    while (i--) scene.remove(grounds[i]);
    grounds = [];
    meshs = [];
}

//----------------------------------
//  OIMO PHYSICS
//----------------------------------
function initOimoPhysics(){
    world = new OIMO.World({info:true, worldscale:100} );
    populate();
}

var floor

function populate() {
    // reset old
    clearMesh();
    world.clear();
    bodys = [];

    //add ground
    var ground0 = world.add({size:[40, 40, 390], pos:[-180,20,0], world:world});
    var ground1 = world.add({size:[40, 40, 390], pos:[180,20,0], world:world});
    var ground2 = world.add({size:[400, 80, 400], pos:[0,-40,0], world:world});

    addStaticBox([40, 40, 390], [-180,20,0], [0,0,0]);
    addStaticBox([40, 40, 390], [180,20,0], [0,0,0]);
    floor = addStaticBox([400, 80, 400], [0,-40,0], [0,0,0]);

    //add object
    var x, y, z, w, h, d;

    var max = 100;
    var i = max;
    while (i--){
        x = -100 + Math.random()*200;
        z = -100 + Math.random()*200;
        y = 100 + Math.random()*1000;
        w = 10 + Math.random()*10;
        h = 10 + Math.random()*10;
        d = 10 + Math.random()*10;

        bodys[i] = world.add({type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world});
        meshs[i] = new THREE.Mesh( geos.box, mats.box );
        meshs[i].scale.set( w, h, d );

        meshs[i].castShadow = true;
        meshs[i].receiveShadow = true;

        scene.add( meshs[i] );
    }
}

function updateOimoPhysics() {
    if(world==null) return;

    world.step();

    var x, y, z, mesh, body, i = bodys.length;

    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        mesh.position.copy(body.getPosition());
        mesh.quaternion.copy(body.getQuaternion());

        // change material
        if(mesh.material.name === 'sbox') mesh.material = mats.box;
        if(mesh.material.name === 'ssph') mesh.material = mats.sph;
        if(mesh.material.name === 'scyl') mesh.material = mats.cyl; 

        // reset position
        if(mesh.position.y<-100){
            x = -100 + Math.random()*200;
            z = -100 + Math.random()*200;
            y = 100 + Math.random()*1000;
            body.resetPosition(x,y,z);
        }
    }

    infos.innerHTML = "Test text";
}

//----------------------------------
//  TEXTURES
//----------------------------------
function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    var size = 1024;
    c.width = 16; c.height = size;
    var gradient = ct.createLinearGradient(0,0,0,size);
    var i = color[0].length;
    while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
    ct.fillStyle = gradient;
    ct.fillRect(0,0,16,size);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}

function basicTexture(n){
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var color;
    if(n===0) color = "#3884AA";// sphere58AA80
    if(n===1) color = "#61686B";// sphere sleep
    if(n===2) color = "#AA6538";// box
    if(n===3) color = "#61686B";// box sleep
    if(n===4) color = "#AAAA38";// cyl
    if(n===5) color = "#61686B";// cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}


const socket = io();
socket.on('rotation', console.log)
socket.on('acceleration', (e) => {
    console.log(e)
    floor.rotation.x = e.rotationRate.alpha/360
    floor.rotation.y = e.rotationRate.beta/360
    floor.rotation.z = e.rotationRate.gamma/360
    console.log(floor.rotation)
})