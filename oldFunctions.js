function createRipple() {
    let xOffset = 95 * 4;
    let zOffset = 95 * 4;
    var paths = [];
    var sideO = BABYLON.Mesh.BACKSIDE;

    for (let r = 0; r < 256; r++) {
        let path = [];
        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

            let x = .8 * r * Math.cos(theta) + xOffset;
            let z = .8 * r * Math.sin(theta) + zOffset;
            let y = -40 * 2;

            path.push(new BABYLON.Vector3(x, y, z));
        }
        paths.push(path);

    }

    ripple = BABYLON.Mesh.CreateRibbon("ripple", paths, false, false, 0, scene, true, sideO);

    ripple.material = paletteGray[140].mat;
    ripple.scaling.x = .25;
    ripple.scaling.z = .25;
    ripple.scaling.y = .5;
}

function updateRipple() {

    let xOffset = 95 * 4;
    let zOffset = 95 * 4;
    var paths = [];

    for (let r = 0; r < 255; r++) {
        var path = [];
        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

            let x = .8 * r * Math.cos(theta) + xOffset;
            let z = .8 * r * Math.sin(theta) + zOffset;
            let y = frDataArrayNormalized[r] / 18 - 40 * 2; // + 20.1;
            ripple.material = paletteGray[Math.round(map(frDataArrayNormalized[(0)], 0, 255, 100, 200))].mat;
            // ripple.material = defaultGridMaterial;

            path.push(new BABYLON.Vector3(x, y, z));
        }

        paths.push(path);
    };

    ripple = BABYLON.MeshBuilder.CreateRibbon(null, {
        pathArray: paths,
        instance: ripple,
        sideOrientation: 1
    });

}

function createStar2() {
    var paths = [];
    var sideO = BABYLON.Mesh.BACKSIDE;

    let dataIndex = 3; // index into the frDataArray
    let direction = -1; // direction to traverse the frDataArray, flips to positive at start
    let itemsDesired = 32;
    let startIndex = 0;
    let endIndex = startIndex + Math.round(itemsDesired / 8);

    for (let r = 1; r <= 2; r++) {
        let path = [];
        for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 32) {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let x = 3 * r * Math.cos(theta) * dataIndex;
            let z = 3 * r * Math.sin(theta) * dataIndex;
            let y = -.01;

            path.push(new BABYLON.Vector3(x, y, z));
            dataIndex += direction;
        }
        paths.push(path);
    }

    star2 = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);
    star2.parent = starMaster;

    star2.material = paletteGray[140].mat;

}

function updateStar2() {
    var paths = [];
    var myColors = [];

    let dataIndex = 3; // index into the frDataArray
    let direction = -1; // direction to traverse the frDataArray, flips to positive at start
    let itemsDesired = 32;
    let startIndex = 0;
    let endIndex = startIndex + Math.round(itemsDesired / 8);

    for (let r = 1; r <= 2; r++) {
        let path = [];
        for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 32) {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let x = frDataArrayNormalized[dataIndex * r] * r * Math.cos(theta) / 100;
            let z = frDataArrayNormalized[dataIndex * r] * r * Math.sin(theta) / 100;

            myColors.push(paletteGlow[Math.round(map((frDataArrayNormalized[(dataIndex * 2)] * 2) % 255, 0, 255, 0, 1529))].color);
            myColors.push(paletteGlow[Math.round(map((frDataArrayNormalized[(dataIndex * 2)] * 2) % 255, 0, 255, 0, 1529))].color);

            let y = -.01;

            path.push(new BABYLON.Vector3(x, y, z));

            dataIndex += direction;
        }
        paths.push(path);
    }

    star2 = BABYLON.MeshBuilder.CreateRibbon(null, {
        pathArray: paths,
        instance: star2
    });

}

function createStar4() {
    var paths = [];
    var sideO = BABYLON.Mesh.BACKSIDE;

    let dataIndex = 3; // index into the frDataArray
    let direction = -1; // direction to traverse the frDataArray, flips to positive at start
    let itemsDesired = 128;
    let startIndex = 0;
    let endIndex = startIndex + Math.round(itemsDesired / 8);

    for (let r = 1; r <= 2; r++) {
        let path = [];
        for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let x = 3 * r * Math.cos(theta) * dataIndex;
            let z = 3 * r * Math.sin(theta) * dataIndex;
            let y = -.01;

            path.push(new BABYLON.Vector3(x, y, z));
            dataIndex += direction;

        }
        paths.push(path);
    }
    star4 = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);
    star4.parent = starMaster;

    star4.material = paletteGray[140].mat;

}

function updateStar4() {
    var paths = [];
    var myColors = [];

    let dataIndex = 3; // index into the frDataArray
    let direction = -1; // direction to traverse the frDataArray, flips to positive at start
    let itemsDesired = 128;
    let startIndex = 0;
    let endIndex = startIndex + Math.round(itemsDesired / 8);

    let r = 1;

    let path = [];

    // inner points ofstar
    for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
        if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

        let x = frDataArrayNormalized[dataIndex * r] * r * 8.5 * Math.cos(theta) / 100;
        let z = frDataArrayNormalized[dataIndex * r] * r * 8.5 * Math.sin(theta) / 100;
        let y = -.01;

        path.push(new BABYLON.Vector3(x, y, z));
        dataIndex += direction;
    }
    paths.push(path);

    r = 3;

    path = [];

    // outer points of star
    for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 128) {
        if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

        let x = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.cos(theta) / 100;
        let z = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.sin(theta) / 100;
        let y = -.01;

        path.push(new BABYLON.Vector3(x, y, z));
        dataIndex += direction;
    }
    paths.push(path);

    star4 = BABYLON.MeshBuilder.CreateRibbon(null, {
        pathArray: paths,
        instance: star4,
        myColors: myColors,
        sideOrientation: 1
    });

}

function createStarGroup1(parent) {

    // console.log("creating star objects");

    let test = new Star("test Star name", "test Star parent", null, paletteRed[200].mat, pieResolution, waterMaterial, scene);
    test.setOptions(
        0,
        0,

        .5,
        .5,

        1,
        4,

        256,

        waterMaterial,

        0,
        0,
        0
    );
    test.mesh.parent = parent;
    starObjects.push(test);


    let test2 = new Star("test Star name", "test Star parent", null, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
    test2.setOptions(
        0,
        1,

        1,
        1,

        20,
        21,

        256,

        waterMaterial,

        0.01,
        0,
        0
    );
    test2.mesh.parent = parent;
    starObjects.push(test2);


    let test3 = new Star("test Star name", "test Star parent", null, paletteGlow[400].mat, pieResolution, waterMaterial, scene);
    test3.setOptions(
        0,
        2,

        2,
        2,

        40,
        41,

        256,

        waterMaterial,

        0,
        0.005, // clockwise rotation
        0
    );
    test3.mesh.parent = parent;
    starObjects.push(test3);


    let test4 = new Star("test Star name", "test Star parent", null, paletteGlow[600].mat, pieResolution, waterMaterial, scene);
    test4.setOptions(
        30,
        40,

        4,
        4,

        60,
        61,

        256,

        waterMaterial,

        0,
        0,
        0.01
    );
    test4.mesh.parent = parent;
    starObjects.push(test4);


    let test5 = new Star("test Star name", "test Star parent", null, paletteGlow[800].mat, pieResolution, waterMaterial, scene);
    test5.setOptions(
        10,
        11,

        8,
        8,

        100,
        100,

        256,

        waterMaterial,

        0.01,
        0,
        0
    );
    test5.mesh.parent = parent;
    starObjects.push(test5);


    let test6 = new Star("test Star name", "test Star parent", null, paletteGlow[1000].mat, pieResolution, waterMaterial, scene);
    test6.setOptions(
        60,
        70,

        16,
        16,

        140,
        141,

        256,

        waterMaterial,

        0,
        -0.005, // counter clockwise rotation
        0
    );
    test6.mesh.parent = parent;
    starObjects.push(test6);


    let test7 = new Star("test Star name", "test Star parent", null, paletteGlow[1200].mat, pieResolution, waterMaterial, scene);
    test7.setOptions(
        8,
        9,

        32,
        32,

        180,
        180,

        256,

        waterMaterial,

        0,
        0,
        -.01
    );
    test7.mesh.parent = parent;
    starObjects.push(test7);

    let test8 = new Star("test Star name", "test Star parent", null, paletteGlow[50].mat, pieResolution, waterMaterial, scene);
    test8.setOptions(
        10,
        11,

        64,
        64,

        240,
        240,

        256,

        waterMaterial,

        -0.01,
        0,
        0
    );
    test8.mesh.parent = parent;
    starObjects.push(test8);



    let test9 = new Star("test Star name", "test Star parent", null, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
    test9.setOptions(
        0,
        0,

        128,
        16,

        280,
        285,

        256,

        waterMaterial,

        0,
        0.005, // clockwise rotation
        0
    );
    test9.mesh.parent = parent;
    starObjects.push(test9);


}