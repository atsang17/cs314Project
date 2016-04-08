// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var keyboard = new THREEx.KeyboardState();
var renderer = new THREE.WebGLRenderer();

var aspectRatio = window.innerWidth / window.innerHeight;
var mapHeight = 150;
var mapWidth = mapHeight * aspectRatio;
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var fullCamera, mapCamera;
var freezeMode = false;
var controls;

var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
var sunHeight = 500;
var earthRadius = 1, sunRadius = 5;
var collidableObjects = [];

// ============================================================================
//
// MAIN
//
// ============================================================================

renderer.setClearColor(0x000000); // white background colour
canvas.appendChild(renderer.domElement);

registerKeyboardListeners();
initCamera();
var controls = new THREE.OrbitControls(fullCamera);
initGeometry();
update();



// ============================================================================
//
// HELPER FUNCTIONS
//
// ============================================================================

function initCamera() {
    views = [
        {
            left: 0,
            bottom: 0,
            width: 1.0,
            height: 1.0,
            background: new THREE.Color().setRGB(0.1, 0.1, 0.1),
            eye: [0, 5, 15],
            up: [0, 1, 0],
            fov: 45,
            updateCamera: function(camera, scene, mouseX, mouseY) { }
        },
        {
            aspectRatio: aspectRatio,
            left: (-aspectRatio * mapHeight) / 2,
            right: (aspectRatio * mapHeight) / 2,
            background: new THREE.Color().setRGB(1, 1, 1),
            eye: [0, 1000, 0],
            up: [0, 1, 0],
            top: mapHeight / 2,
            bottom: -mapHeight / 2,
            near: -10000,
            far: 10000,
            updateCamera: function(camera, scene, mouseX, mouseY) { }
        }
    ]
    // SETUP CAMERAS
    var view = views[0];
    fullCamera = new THREE.PerspectiveCamera(view.fov, aspectRatio, 1, 10000); // view angle, aspect ratio, near, far
    fullCamera.position.set(20, 20, 20);
    fullCamera.position.x = view.eye[0];
    fullCamera.position.y = view.eye[1];
    fullCamera.position.z = view.eye[2];
    fullCamera.up.x = view.up[0];
    fullCamera.up.y = view.up[1];
    fullCamera.up.z = view.up[2];

    // initialize earth
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('assets/earthmap1k.jpg');
    var earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    generateVertexColors(earthGeometry);
    earth = new THREE.Mesh(earthGeometry, material);
    scene.add(earth);

    // setup camera to follow earth
    fullCamera.lookAt(earth);
    view.camera = fullCamera;
    earth.add(fullCamera);

    var view = views[1];
    mapCamera = new THREE.OrthographicCamera(view.left, view.right, view.top, view.bottom, view.near, view.far);
    mapCamera.position.set(45, 20, 40);
    mapCamera.position.x = view.eye[0];
    mapCamera.position.y = view.eye[1];
    mapCamera.position.z = view.eye[2];
    mapCamera.up.x = view.up[0];
    mapCamera.up.y = view.up[1];
    mapCamera.up.z = view.up[2];
    mapCamera.lookAt(scene.position);
    view.camera = mapCamera;
    scene.add(mapCamera);

    // EVENT LISTENER RESIZE
    window.addEventListener('resize', resize);
    resize();

    //SCROLLBAR FUNCTION DISABLE
    window.onscroll = function() {
        window.scrollTo(0, 0);
    }

}

// ADAPT TO WINDOW RESIZE
function resize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
    aspectRatio = window.innerWidth / window.innerHeight;
    fullCamera.aspect = window.innerWidth / window.innerHeight;
    fullCamera.updateProjectionMatrix();
}

function initGeometry() {
    // SETUP HELPER GRID
    var gridGeometry = new THREE.Geometry();
    var i;
    for (i = -50; i < 51; i += 2) {
        gridGeometry.vertices.push(new THREE.Vector3(i, 0, -50));
        gridGeometry.vertices.push(new THREE.Vector3(i, 0, 50));
        gridGeometry.vertices.push(new THREE.Vector3(-50, 0, i));
        gridGeometry.vertices.push(new THREE.Vector3(50, 0, i));
    }

    var gridMaterial = new THREE.LineBasicMaterial({ color: 0xBBBBBB });
    var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);
    scene.add(grid);

    var ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    var lights = [];
    // sun light
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].castShadow = true;
    lights[0].position.set(0, 10, 0);
    scene.add(lights[0]);

    // Create Solar System
    var sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    generateVertexColors(sunGeometry);
    var material = new THREE.MeshBasicMaterial();
    material.map = THREE.ImageUtils.loadTexture('assets/sunmap.jpg');
    sun = new THREE.Mesh(sunGeometry, material);
    var sunPosition = new THREE.Matrix4().makeTranslation(0, 0, 50);
    sun.applyMatrix(sunPosition);
    collidableObjects.push(sun);
    scene.add(sun);

    // initialize mercury
    // var material = new THREE.MeshPhongMaterial();
    // var mercuryGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    // generateVertexColors(mercuryGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/mercurymap.jpg');
    // mercury = new THREE.Mesh(mercuryGeometry, material);
    // var mercuryPosition = new THREE.Matrix4().makeTranslation(10, 0, 0);
    // mercury.applyMatrix(mercuryPosition);
    // sun.add(mercury);
    // //createOrbitCircle(10);
    //
    // // initialize venus
    // var material = new THREE.MeshPhongMaterial();
    // var venusGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    // generateVertexColors(venusGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/venusmap.jpg');
    // venus = new THREE.Mesh(venusGeometry, material);
    // var venusPosition = new THREE.Matrix4().makeTranslation(13, 0, 0);
    // venus.applyMatrix(venusPosition);
    // sun.add(venus);
    //createOrbitCircle(13);

    // initialize mars
    // var material = new THREE.MeshPhongMaterial();
    // var marsGeometry = new THREE.SphereGeometry(1, 32, 32);
    // generateVertexColors(venusGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/mars_1k_color.jpg');
    // mars = new THREE.Mesh(marsGeometry, material);
    // var marsPosition = new THREE.Matrix4().makeTranslation(19, 0, 0);
    // mars.applyMatrix(marsPosition);
    // sun.add(mars);
    // //createOrbitCircle(19);
    //
    // // initialize jupiter
    // var material = new THREE.MeshPhongMaterial();
    // var jupiterGeometry = new THREE.SphereGeometry(3, 32, 32);
    // generateVertexColors(jupiterGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/jupitermap.jpg');
    // jupiter = new THREE.Mesh(jupiterGeometry, material);
    // var jupiterPosition = new THREE.Matrix4().makeTranslation(25, 0, 0);
    // jupiter.applyMatrix(jupiterPosition);
    // sun.add(jupiter);
    // //createOrbitCircle(25);
    //
    // // initialize saturn
    // var material = new THREE.MeshPhongMaterial();
    // var saturnGeometry = new THREE.SphereGeometry(2, 32, 32);
    // generateVertexColors(saturnGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/saturnmap.jpg');
    // saturn = new THREE.Mesh(saturnGeometry, material);
    // var saturnPosition = new THREE.Matrix4().makeTranslation(35, 0, 0);
    // saturn.applyMatrix(saturnPosition);
    // //createOrbitCircle(35);
    //
    // // initialize saturn rings
    // var geometry = new THREE.RingGeometry(3, 5, 32, 32);
    // var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    // material.map = THREE.ImageUtils.loadTexture('assets/saturnringcolor.jpg');
    // var saturn_rings = new THREE.Mesh(geometry, material);
    // saturn_rings.lookAt(new THREE.Vector3(0, 1, 0));
    // saturn.add(saturn_rings);
    // sun.add(saturn);
    //
    // // initialize uranus
    // var material = new THREE.MeshPhongMaterial();
    // var uranusGeometry = new THREE.SphereGeometry(2, 32, 32);
    // generateVertexColors(uranusGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/uranusmap.jpg');
    // uranus = new THREE.Mesh(uranusGeometry, material);
    // var uranusPosition = new THREE.Matrix4().makeTranslation(45, 0, 0);
    // uranus.applyMatrix(uranusPosition);
    // sun.add(uranus);
    // //createOrbitCircle(45);
    //
    // // initialize neptune
    // var material = new THREE.MeshPhongMaterial();
    // var neptuneGeometry = new THREE.SphereGeometry(2, 32, 32);
    // generateVertexColors(uranusGeometry);
    // material.map = THREE.ImageUtils.loadTexture('assets/neptunemap.jpg');
    // neptune = new THREE.Mesh(neptuneGeometry, material);
    // var neptunePosition = new THREE.Matrix4().makeTranslation(55, 0, 0);
    // neptune.applyMatrix(neptunePosition);
    // sun.add(neptune);
    // //createOrbitCircle(55);

    var FloorGeo = new THREE.BoxGeometry(300, 5, 150);
    var floormaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var floor = new THREE.Mesh(FloorGeo, floormaterial);
    var floorTransform = new THREE.Matrix4().makeTranslation(0, -5, 0);

    var positionX = 0;
    var positionY = 0;
    floor.applyMatrix(floorTransform);
    scene.add(floor);

    throughDungeon();

    function throughDungeon() {
        //console.log("in through dungeon");
        var map = makeMap();
        //console.log("boob");
        //console.log(map);
        //console.log("hi");
        //console.log(map[0][0]);

        //var offsetX = 1;
        var offsetY = 1;
        var offsetX = 1;


        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 2; y++) {
                if (y > 0) { offsetY = -1; }
                if (x > 1) { offsetX = -1 }
                createMap(map[x][y], floor, offsetX, offsetY, x, y);
            }
        }

    }

}

// adds a circle to scene of given radius
function createOrbitCircle(radius) {
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    var segments = 32;

    var orbitGeometry = new THREE.CircleGeometry(radius, segments);
    orbitGeometry.vertices.shift();
    var orbit = new THREE.Line(orbitGeometry, material);
    orbit.lookAt(new THREE.Vector3(0, 1, 0));
    scene.add(orbit);
}

function updateSystem() {
  if (!freezeMode) {
    // orbit around sun
    // mercury.applyMatrix(new THREE.Matrix4().makeRotationY(0.04));
    // venus.applyMatrix(new THREE.Matrix4().makeRotationY(0.02));
    // // earth.applyMatrix(new THREE.Matrix4().makeRotationY(0.01));
    // mars.applyMatrix(new THREE.Matrix4().makeRotationY(0.008));
    // jupiter.applyMatrix(new THREE.Matrix4().makeRotationY(0.005));
    // saturn.applyMatrix(new THREE.Matrix4().makeRotationY(0.003));
    // uranus.applyMatrix(new THREE.Matrix4().makeRotationY(0.002));
    // neptune.applyMatrix(new THREE.Matrix4().makeRotationY(0.001));
    //
    // // planet individual rotations
    // mercury.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.000853);
    // venus.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.0002057);
    // // earth.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.05);
    // mars.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0487);
    // jupiter.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1219);
    // saturn.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.11737);
    // uranus.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.0696);
    // neptune.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.07448);
  }
}

// SETUP UPDATE CALL-BACK
function update() {
    updateSystem();

    // full camera
    view = views[0];

    view.updateCamera(fullCamera, scene, mouseX, mouseY);

    var left = Math.floor(windowWidth * view.left);
    var bottom = Math.floor(windowHeight * view.bottom);
    var width = Math.floor(windowWidth * view.width);
    var height = Math.floor(windowHeight * view.height);
    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.enableScissorTest(true);
    renderer.setClearColor(view.background);

    fullCamera.aspect = width / height;
    fullCamera.updateProjectionMatrix();

    renderer.render(scene, fullCamera);

    // map camera
    view = views[1];

    view.updateCamera(mapCamera, scene, mouseX, mouseY);

    var left = Math.floor(windowWidth * view.left);
    var bottom = Math.floor(windowHeight * view.bottom);
    var width = Math.floor(windowWidth * view.width);
    var height = Math.floor(windowHeight * view.height);
    renderer.setViewport(windowWidth - mapWidth, windowHeight - mapHeight, mapWidth, mapHeight);
    renderer.setScissor(windowWidth - mapWidth, windowHeight - mapHeight, mapWidth, mapHeight);
    renderer.enableScissorTest(true);
    renderer.setClearColor(view.background);

    mapCamera.aspect = width / height;
    mapCamera.updateProjectionMatrix();

    renderer.render(scene, mapCamera);

    requestAnimationFrame(update);
}

function registerKeyboardListeners() {
    keyboard.domElement.addEventListener('keydown', onKeyDown);
    keyboard.domElement.addEventListener('mousedown', mousedown);
    keyboard.domElement.addEventListener('mouseup', mouseup);
}


// ============================================================================
//
// LISTENERS
//
// ============================================================================

function onKeyDown(event) {
    if (keyboard.eventMatches(event, "w")) {
        // move camera forwards
        earth.translateOnAxis(new THREE.Vector3(0,0,-1), 1);

        // basic collision detection. currently hard-coded for the sun
        var raycaster = new THREE.Raycaster();
        var earthPosition = new THREE.Vector3(earth.position.x, earth.position.y, earth.position.z);
        var sunPosition = new THREE.Vector3(sun.position.x, sun.position.y, sun.position.z);

        var rayDirection = sunPosition.clone().sub(earthPosition);
        raycaster.set(earthPosition, rayDirection.normalize());
        var intersectedObjects = raycaster.intersectObjects(collidableObjects, true);
        if (intersectedObjects.length > 0 && intersectedObjects[0].distance < earthRadius + 1) {
          alert('help');
          earth.translateOnAxis(new THREE.Vector3(0,0,-1), -1);
        }

    }
    else if (keyboard.eventMatches(event, "s")) {
      // move camera forwards
      earth.translateOnAxis(new THREE.Vector3(0,0,-1), -1);

      // basic collision detection. currently hard-coded for the sun
      var raycaster = new THREE.Raycaster();
      var earthPosition = new THREE.Vector3(earth.position.x, earth.position.y, earth.position.z);
      var sunPosition = new THREE.Vector3(sun.position.x, sun.position.y, sun.position.z);

      var rayDirection = sunPosition.clone().sub(earthPosition);
      raycaster.set(earthPosition, rayDirection.normalize());
      var intersectedObjects = raycaster.intersectObjects(collidableObjects, true);
      if (intersectedObjects.length > 0 && intersectedObjects[0].distance < earthRadius + 1) {
        alert('help');
        earth.translateOnAxis(new THREE.Vector3(0,0,-1), 1);
      }

    }
    else if (keyboard.eventMatches(event, "a")) {
        // rotate camera left
        earth.rotateY(0.1);
    }
    else if (keyboard.eventMatches(event, "d")) {
        // rotate camera right
        earth.rotateY(-0.1);
    }
}

function mousedown(event) {
    event.preventDefault();
    event.stopPropagation();

    // more advanced picking logic goes here

    // convert mouse coordinates to NDCS since setFromCamera assumes mouse vector is in NDC
    var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), fullCamera);
    var intersectedObjects = raycaster.intersectObjects(scene.children, true);
    var object = intersectedObjects[0].object;

    // currently drops a sphere in the scene if the raycast hits something
    var mat = new THREE.MeshPhongMaterial();
    var testGeometry = new THREE.SphereGeometry(2, 32, 32);
    generateVertexColors(testGeometry);
    testSphere = new THREE.Mesh(testGeometry, mat);
    testSphere.applyMatrix(new THREE.Matrix4().makeTranslation(object.position.x, object.position.y, object.position.z));
    scene.add(testSphere);
}

function mouseup(event) {
    event.preventDefault();
    event.stopPropagation();
}

//map creation
function generateMap(entrance, exit) {
    //arbitrary 15x15 maps each node
    //console.log("made it here");
    var width = 15;
    var height = 15;

    var exitSide = exit;
    var entranceSide = entrance;

    var map = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
    //console.log("made it here");
    randomFillMap(width, height, map, entranceSide, exitSide);
    //console.log("made it here");
    /*
    for (i = 0; i < 5; i++) {
        console.log("made it here");
        smoothMap(map);
    }
    */
    //console.log(map);
    return map;
}

function randomFillMap(width, height, map, exitSide, entrance) {
    //console.log(map);
    var seed;
    var randomFillPercent = 50;
    //console.log("made it here");

    //needs to be changed for time
    //seed = new Date().toUTCString;

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            //console.log("reach if?")
            //console.log(x == 0 || x == width - 1 || y == 0 || y == height - 1);
            if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
                //console.log("yes");
                map[x][y] = 1;
/*
                if (exitSide == "n" || entrance == "n") {
                    map[8][0] = 0;
                    map[7][0] = 0;
                    map[9][0] = 0;
                } else if (exitSide == "w" || entrance == "w") {
                    map[0][8] = 0;
                    map[0][7] = 0;
                    map[0][9] = 0;
                } else if (exitSide == "s" || entrance == "s") {
                    map[8][14] = 0;
                    map[7][14] = 0;
                    map[9][14] = 0;
                } else if (exitSide == "e" || entrance == "e") {
                    map[14][8] = 0;
                    map[14][7] = 0;
                    map[14][9] = 0;
                }
                */
                //console.log("yes");
            } else {
                // needs to be changed for using random number generator
                map[x][y] = (Math.floor(Math.random() * 100) < randomFillPercent) ? 1 : 0;
                //console.log("yes");
            }

        }
    }
    //console.log(map);
}

function smoothMap(map) {
    for (var x = 0; x < 15; x++) {
        for (var y = 0; y < 15; y++) {
            //console.log("hi");
            var neighbourWallTiles = getSurroundingWalls(x, y);

            if (neighbourWallTiles < 4) {
                map[x][y] = 0;
            } else if (neighbourWallTiles > 4) {
                map[x][y] = 1;
            }
        }
    }
}

function getSurroundingWalls(x, y) {
    var wallcount = 0;
    for (var i = x - 1; i <= x + 1; x++) {
        for (var j = y - 1; j <= y + 1; y++) {
            if (i >= 0 && j >= 0 && i < width && j < height) {
                if (i != x || j != y) {
                    wallcount += map[i][j];
                }
            } else {
                wallcount++;
            }
        }
    }
    return wallcount;
}

function binaryMapping() {
    var num = Math.floor(Math.random() * 31);
    var mapLayout = num.toString(2);
    while (mapLayout.length < 5) {
        mapLayout = "0" + mapLayout;
    }
    console.log(mapLayout);
    var map = [[], [], [], []];
    for (var i = 0; i < 4; i++) {
        var bit = mapLayout.charAt(i) + mapLayout.charAt(i + 1);
        //console.log(bit == 00 || bit == 11 || bit == 01 || bit == 10);
        if (bit == 00) {
            map[i].push(1);
            map[i].push(0);
            console.log("case1");
        } else if (bit == 11) {
            map[i].push(0);
            map[i].push(1);
            console.log("case2");
        } else if (bit == 10) {
            map[i].push(2);
            map[i].push(1);
            console.log("case3");
        } else if (bit == 01) {
            map[i].push(1);
            map[i].push(2);
            console.log("case4");
        }
        //console.log(map[0]);
    }
    //console.log(map);
    return map;
}

function makeMap() {
    //console.log("made it here");
    var mapArray = binaryMapping();
    //console.log("back from mapping");
    for (var i = 0; i < 4; i++) {
        console.log(i);
        console.log(mapArray[i]);
        //console.log(true);
        if (mapArray[i][0] == 0 && mapArray[i][0] == 1) {
            if (i == 0) {
                mapArray[i][1] = generateMap("0", "e");
            } else if (i == 3) {
                mapArray[i][1] = generateMap("w", "0");
            } else {
                mapArray[i][1] = generateMap("w", "e");
            }
            console.log(mapArray[i]);
        } else if (mapArray[i][0] == 1 && mapArray[i][1] == 0) {
            if (i == 0) {
                mapArray[i][0] = generateMap("0", "e");
            } else if (i == 3) {
                mapArray[i][0] = generateMap("w", "0");
            } else {
                mapArray[i][0] = (generateMap("w", "e"));
            }
            console.log(mapArray[i]);
        } else if (mapArray[i][0] == 2 && mapArray[i][1] == 1) {
            if (i == 0) {
                mapArray[i][0] = generateMap("s", "e");
                mapArray[i][1] = generateMap("0", "n");
            } else if (i == 3) {
                mapArray[i][0] = generateMap("s", "0");
                mapArray[i][1] = generateMap("w", "n");
            } else {
                mapArray[i][0] = generateMap("s", "e");
                mapArray[i][1] = generateMap("w", "n");
            }
            console.log(mapArray[i]);
        } else if (mapArray[i][0] == 1 && mapArray[i][1] == 2) {
            if (i == 0) {
                mapArray[i][0] = generateMap("0", "s");
                mapArray[i][1] = generateMap("n", "e");
            } else if (i == 3) {
                mapArray[i][1] = generateMap("w", "s");
                mapArray[i][0] = generateMap("n", "0");
            } else {
                mapArray[i][0] = generateMap("w", "s");
                mapArray[i][1] = generateMap("n", "e");
            }
            console.log(mapArray[i]);
        }

    }
    //console.log(mapArray[0][0]);
    return mapArray;

}

//takes in index of the map 
function createMap(mapSector, floor, offsetX, offsetY, xInput, yInput) {
    var unitWallGeo = new THREE.BoxGeometry(5, 12.5, 5);
    var fill = new THREE.BoxGeometry(75, 15, 75);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var wallmaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    var posX;
    var posY;
    if (mapSector == 0) {
        posX = 112.5 - (75 * xInput);
        posY = (37.5 * offsetY) - 0.5;
        console.log("creating fill");
        var fillMesh = new THREE.Mesh(fill, material);
        fillMesh.applyMatrix(new THREE.Matrix4().makeTranslation(posX, 0, posY));
        floor.add(fillMesh);
    } else {
        posX = 150 - (75 * xInput) + 2.5;
        posY = 75 - (75 * yInput) - .5
        for (var x = 0; x < mapSector.length; x++) {
            posX -= 2.5;
            for (var y = 0; y <= mapSector[x].length; y++) {
                var unitWall;
                posY -= 2.5;
                //console.log("hi");
                if (mapSector[x][y] == 1) {
                    unitWall = new THREE.Mesh(unitWallGeo, wallmaterial);
                    unitWall.applyMatrix(new THREE.Matrix4().makeTranslation(posX, 5, posY));
                    floor.add(unitWall);
                }

            }
        }
    }

    //console.log(mapSector);


}
