function binaryMapping() {
    var num = Math.floor(Math.random() * 127);
    var mapLayout = num.toString(2);
    while (mapLayout.length < 4) {
        mapLayout = "0" + mapLayout;
    }
    var map = [];
    for (i = 0; i < 4; i++) {
        var bit = mapLayout.charAt(i) + mapLayout.charAt(i + 1);
        if (bit == "00") {
            map[i] = [0, 1];
        } else if (bit == "11") {
            map[i] = [1, 0];
        } else if (bit == "10") {
            map[i] = [1, 2];
        } else {
            map[i] = [2, 1];
        }
    }
}