//setting up the renderer and scene
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF);
canvas.appendChild(renderer.domElement);

//Camera setup
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
camera.setPosition(45,20,40);
cacmera.lookAt(scene.position);
scene.add(camera);

//setup controllers
var controls = new THREE.OrbitControls(camera);

//Adapt to Window Size
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

//event listener resize
window.addEventListener('resize', resize);
resize();

//scroll bar function disable
window.onscroll = function() {
    window.scrollTo(0,0);
}

//setup helper grid
var gridGeometry = new THREE.Geometry();
var i;
for (i=-50; i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0, 50));
    gridGeometry.vertices.push( new THREE.Vector3( 50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));    
}

var gridMaterial = new THREE.LineBasicMaterial(0xBBBBBB);
var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);

//!!!!!!!!!!!!!!!!!!
//!!!    WORK    !!!
//!!!!!!!!!!!!!!!!!!


//Animation and keypresses
var clock = new THREE.Clock(true);

var p0; // start position or angle
var p1; // end position or angle
var time_length; // total time of animation
var time_start; // start time of animation
var time_end; // end time of animation
var p; // current frame
var animate = false; // animate?

// Initializes parameters and sets animate flag to true..
function init_animation(p_start,p_end,t_length){
  p0 = p_start;
  p1 = p_end;
  time_length = t_length;
  time_start = clock.getElapsedTime();
  time_end = time_start + time_length;
  animate = true; // flag for animation
  return;
}

//key commands
keyboard.domElement.addEventListener('keydown',function(event){
  if (event.repeat)
    return;
  if(keyboard.eventMatches(event,"Z")){  // Z: Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);}   
  else if(keyboard.eventMatches(event,"0")){    // 0: Set camera to neutral position, view reset
    camera.position.set(45,0,0);
    camera.lookAt(scene.position);}
  else if(keyboard.eventMatches(event,"U")){ 
    (key == "U")? init_animation(p1,p0,time_length) : (init_animation(0,Math.PI/4,1), key = "U")}  
    });

function update() {
    updateBody();
    
    
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}

update();