function generateMap(exit) {
    //arbitrary 15x15 maps each node
    var width = 15;
    var height = 15;

    var exitSide = exit;

    var map = new int[width, height];
    randomFillMap(width, height, map, exitSide);

    for (i = 0; i < 5; i++) {
        smoothMap(map);
    }

    return map;
}

function randomFillMap(width, height, map, exitSide) {
    var seed;
    var randomFillPercent = 30;

    //needs to be changed for time
    seed = new Date().toUTCString;

    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
                map[x, y] = 1;
            } else {
                // needs to be changed for using random number generator
                map[x, y] = (Math.floor(Math.random() * 100) < randomFillPercent) ? 1 : 0;
            }
        }
    }
}

function smoothMap(map) {
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            var neighbourWallTiles = getSurroundingWalls(x, y);

            if (neighbourWallTiles < 4) {
                map[x, y] = 0;
            } else if (neighbourWallTiles > 4) {
                map[x, y] = 1;
            }
        }
    }
}

function getSurroundingWalls(x, y) {
    var wallcount = 0;
    for (neighbourX = x - 1; neightbourX <= x + 1; x++) {
        for (neighbourY = y - 1; neighbourY <= y + 1; y++) {
            if (neighbourX >= 0 && neighbourY >= 0 && neighbourX < width && neighbourY < height) {
                if (neighbourX != x || neighbourY != y) {
                    wallcount += map[neighbourX, neighbourY];
                }
            } else {
                wallcount++;
            }
        }
    }
    return wallcount;
}

function createExits(side, map) {
    switch (side) {
        case "n":
            map[8, 0] = 0;
            map[7, 0] = 0;
            map[9, 0] = 0;
            break;
        case "w":
            map[0, 8] = 0;
            map[0, 7] = 0;
            map[0, 9] = 0;
            break;
        case "e":
            map[15, 8] = 0;
            map[15, 7] = 0;
            map[15, 9] = 0;
            break;
        case "s":
            map[8, 15] = 0;
            map[7, 15] = 0;
            map[9, 15] = 0;
            break;
    }
} 