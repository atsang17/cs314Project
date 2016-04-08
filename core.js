// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000); // white background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

// SETUP HELPER GRID
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);
scene.add(grid);

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );
var lights = [];
// sun light
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;
lights[0].position.set( 0, 0, 0 );
scene.add( lights[0] );

// Create Solar System
var sunGeometry = new THREE.SphereGeometry( 5, 32, 32 );
generateVertexColors( sunGeometry );
var material = new THREE.MeshBasicMaterial();
material.map = THREE.ImageUtils.loadTexture('assets/sunmap.jpg');
var sun = new THREE.Mesh( sunGeometry, material);
scene.add( sun );

// initialize mercury
var material = new THREE.MeshPhongMaterial();
var mercuryGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
generateVertexColors(mercuryGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/mercurymap.jpg');
var mercury = new THREE.Mesh( mercuryGeometry, material);
var mercuryPosition = new THREE.Matrix4().makeTranslation(10, 0, 0);
mercury.applyMatrix(mercuryPosition);
sun.add(mercury);
//createOrbitCircle(10);

// initialize venus
var material = new THREE.MeshPhongMaterial();
var venusGeometry = new THREE.SphereGeometry( 0.75, 32, 32 );
generateVertexColors(venusGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/venusmap.jpg');
var venus = new THREE.Mesh( venusGeometry, material);
var venusPosition = new THREE.Matrix4().makeTranslation(13, 0, 0);
venus.applyMatrix(venusPosition);
sun.add(venus);
//createOrbitCircle(13);

// initialize earth
var material = new THREE.MeshPhongMaterial();
material.map = THREE.ImageUtils.loadTexture('assets/earthmap1k.jpg');
var earthGeometry = new THREE.SphereGeometry( 1, 32, 32 );
generateVertexColors(earthGeometry);
var earth = new THREE.Mesh( earthGeometry, material);
var earthPosition = new THREE.Matrix4().makeTranslation(16, 0, 0);
earth.applyMatrix(earthPosition);
sun.add(earth);
//createOrbitCircle(16);

// initialize mars
var material = new THREE.MeshPhongMaterial();
var marsGeometry = new THREE.SphereGeometry( 1, 32, 32 );
generateVertexColors(venusGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/mars_1k_color.jpg');
var mars = new THREE.Mesh( marsGeometry, material);
var marsPosition = new THREE.Matrix4().makeTranslation(19, 0, 0);
mars.applyMatrix(marsPosition);
sun.add(mars);
//createOrbitCircle(19);

// initialize jupiter
var material = new THREE.MeshPhongMaterial();
var jupiterGeometry = new THREE.SphereGeometry( 3, 32, 32 );
generateVertexColors(jupiterGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/jupitermap.jpg');
var jupiter = new THREE.Mesh( jupiterGeometry, material);
var jupiterPosition = new THREE.Matrix4().makeTranslation(25, 0, 0);
jupiter.applyMatrix(jupiterPosition);
sun.add(jupiter);
//createOrbitCircle(25);

// initialize saturn
var material = new THREE.MeshPhongMaterial();
var saturnGeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors(saturnGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/saturnmap.jpg');
var saturn = new THREE.Mesh( saturnGeometry, material);
var saturnPosition = new THREE.Matrix4().makeTranslation(35, 0, 0);
saturn.applyMatrix(saturnPosition);
//createOrbitCircle(35);

// initialize saturn rings
var geometry = new THREE.RingGeometry( 3, 5, 32, 32 );
var material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } );
material.map = THREE.ImageUtils.loadTexture('assets/saturnringcolor.jpg');
var saturn_rings = new THREE.Mesh( geometry, material );
saturn_rings.lookAt(new THREE.Vector3(0,1,0));
saturn.add(saturn_rings);
sun.add(saturn);

// initialize uranus
var material = new THREE.MeshPhongMaterial();
var uranusGeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors(uranusGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/uranusmap.jpg');
var uranus = new THREE.Mesh( uranusGeometry, material);
var uranusPosition = new THREE.Matrix4().makeTranslation(45, 0, 0);
uranus.applyMatrix(uranusPosition);
sun.add(uranus);
//createOrbitCircle(45);

// initialize neptune
var material = new THREE.MeshPhongMaterial();
var neptuneGeometry = new THREE.SphereGeometry( 2, 32, 32 );
generateVertexColors(uranusGeometry);
material.map = THREE.ImageUtils.loadTexture('assets/neptunemap.jpg');
var neptune = new THREE.Mesh( neptuneGeometry, material);
var neptunePosition = new THREE.Matrix4().makeTranslation(55, 0, 0);
neptune.applyMatrix(neptunePosition);
sun.add(neptune);
//createOrbitCircle(55);

// adds a circle to scene of given radius
function createOrbitCircle(radius) {
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });

  var segments = 32;

  var orbitGeometry = new THREE.CircleGeometry( radius, segments );
  orbitGeometry.vertices.shift();
  var orbit = new THREE.Line( orbitGeometry, material );
  orbit.lookAt(new THREE.Vector3(0,1,0));
  scene.add( orbit );
}

function updateSystem()
{
  // orbit around sun
  sun.applyMatrix(new THREE.Matrix4().makeRotationY(0.001));
  mercury.applyMatrix(new THREE.Matrix4().makeRotationY(0.04));
  venus.applyMatrix(new THREE.Matrix4().makeRotationY(0.02));
  earth.applyMatrix(new THREE.Matrix4().makeRotationY(0.01));
  mars.applyMatrix(new THREE.Matrix4().makeRotationY(0.008));
  jupiter.applyMatrix(new THREE.Matrix4().makeRotationY(0.005));
  saturn.applyMatrix(new THREE.Matrix4().makeRotationY(0.003));
  uranus.applyMatrix(new THREE.Matrix4().makeRotationY(0.002));
  neptune.applyMatrix(new THREE.Matrix4().makeRotationY(0.001));

  // planet individual rotations
  mercury.rotateOnAxis(new THREE.Vector3(0,1,0), 0.000853);
  venus.rotateOnAxis(new THREE.Vector3(0,1,0), -0.0002057);
  earth.rotateOnAxis(new THREE.Vector3(0,1,0), 0.05);
  mars.rotateOnAxis(new THREE.Vector3(0,1,0), 0.0487);
  jupiter.rotateOnAxis(new THREE.Vector3(0,1,0), 0.1219);
  saturn.rotateOnAxis(new THREE.Vector3(0,1,0), 0.11737);
  uranus.rotateOnAxis(new THREE.Vector3(1,0,0), 0.0696);
  neptune.rotateOnAxis(new THREE.Vector3(0,1,0), 0.07448);

}

var keyboard = new THREEx.KeyboardState();

// SETUP UPDATE CALL-BACK
function update() {
  updateSystem();

  requestAnimationFrame(update);
  renderer.render(scene,camera);
}

update();
