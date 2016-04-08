function makeMap(mapArray) {
    for (i = 0; i < 4; i++) {
        if (mapArray[i] == [0, 1]) {
            if (i = 0) {
                mapArray[i][1] = generateMap("0", "e");
            } else if (i = 3) {
                mapArray[i][1] = generateMap("w", "0");
            } else {
                mapArray[i][1] = generateMap("w", "e");
            }
        } else if (mapArray[i] == [1, 0]) {
            if (i = 0) {
                mapArray[i][0] = generateMap("0", "e");
            } else if (i = 3) {
                mapArray[i][0] = generateMap("w", "0");
            } else {
                mapArray[i][0] = generateMap("w", "e");
            }
        } else if (mapArray[i] == [2, 1]) {
            if (i = 0) {
                mapArray[i][1] = generateMap("0", "n");
            } else if (i = 3) {
                mapArray[i][0] = generateMap("s", "0");
                mapArray[i][1] = generateMap("w", "n");
            } else {
                mapArray[i][0] = generateMap("s", "e");
                mapArray[i][1] = generateMap("w", "n");
            }
        } else if (mapArray[i] == [1, 2]) {
            if (i = 0) {
                mapArray[i][1] = generateMap("0", "n");
            } else if (i = 3) {
                mapArray[i][1] = generateMap("n", "0");
                mapArray[i][0] = generateMap("w", "s");
            } else {
                mapArray[i][0] = generateMap("n", "e");
                mapArray[i][1] = generateMap("w", "s");
            }
        }
    }
}

var FloorGeo = new THREE.BoxGeometry(300, 5, 150);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var floor = new THREE.Mesh(FloorGeo, material);
var positionX = 0;
var positionY = 0;
var unitWallGeo = new THREE.BoxGeometry(5, 15, 5);
var fill = new THREE.BoxGeometry(75,15,75);
for (x=0; x < 4 ; x ++) {
    for (y=0; y < 2; y++) {
        createMap()
    }
}

//takes in index of the map 
function createMap(mapSector) {
    if (mapSector == 0) {
        var fillMesh = new THREE.Mesh(fill, material);
        floor.add(fillMesh);
    }
    
    for (x=0; x < mapSector.length; x++) {
        for (y=0; y < mapSector[x].length; y++) {
            if (mapSector[x][y] == 1) {
                var unitWall = new THREE.Mesh(unitWallGeo, material);
                floor.add(unitWall);
            }
        }
    }
}