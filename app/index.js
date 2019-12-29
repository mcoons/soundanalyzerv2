////////////////////////////////////
// TODO
//
//  REFACTOR AND OPTIMIZE  --  ALWAYS
//      Look into using clones for 3D optimization
//      Look into fallbacks
//     
//
// 1) Create a custom player
//      a) Use custom buttons and graphics
//      b) Allow for a play list
//      c) Allow saving options and playlist to local storage for ease of use
//
// 2) Add microphone support
//
// 3) Add external player support (grab the audio from anywhere)
//
// 4) Add error checking for everything
//
// 5) Add Options popup
//      a) Which objects to display
//      b) Palette selection and creation


//  --  multiple gradients within the Index Range (0..255)
// let paletteObject = {
//     name: "Custom Palette",
//     gradients: [gradientObject, gradientObject, ...],
//     paletteColors: []
// }

// let gradientObject = {
//     startIndex: 0, 
//     endIndex: 255, 
//     startColor: {r:0, g:0, g:0, a:1}, 
//     endColor: {r:250, g:75, g:130, a:1}
// }


//      c) 2D title, 3D title or no title
//
// 6) Add the ability to save the current screen (2D and 3D)
//
// 7) 
//
// 8) 
//
// Can I determine what key a song is played in and what is out of key
//
// Color scheme that is created from the current image of slideshow
//
// “skybox_nx.png”, left
// “skybox_ny.png”, down
// “skybox_nz.png”, back
// “skybox_px.png”, right
// “skybox_py.png”, up
// “skybox_pz.png” front
//
//

import {
    // addToGlowPalette,
    // addToPalette,
    buildPalettes,
    map,
    logToScreen
} from './utilities.js';

var scene;

window.onload = function () {

    var options = {
        showDancers: false,
        showInnerSnowflake: false,
        showOuterSnowflake: false,
        showFrame: false,
        showBars: true,
        showTitle: false,
        showFloor: false,
        showRipple: false,
        showWater: false
    }

    var title = document.getElementById("title");

    //////////////////////////////
    // AUDIO variables

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);

    var frAnalyser = audioCtx.createAnalyser();
    frAnalyser.fftSize = 1024;
    frAnalyser.smoothingTimeConstant = 0.9;
    var frBufferLength = frAnalyser.frequencyBinCount;
    var frDataLength = frBufferLength - 64;
    var frDataArray = new Uint8Array(frBufferLength);
    var frDataArrayNormalized = new Uint8Array(frBufferLength);
    var frCurrentHigh = 0;
    var frCurrentLow = 255

    var tdAnalyser = audioCtx.createAnalyser();
    tdAnalyser.fftSize = 512;
    tdAnalyser.smoothingTimeConstant = 0.9;
    var tdBufferLength = tdAnalyser.frequencyBinCount;
    var tdDataLength = tdBufferLength - 64;
    var tdDataArray = new Uint8Array(tdBufferLength);
    var tdHistory = [];
    let arraySize = 256;
    tdHistory = Array(arraySize).fill(0);

    audioSrc.connect(frAnalyser);
    frAnalyser.connect(tdAnalyser);
    tdAnalyser.connect(audioCtx.destination);


    /////////////////////////////////
    //  PALETTES
    // 
    // palette element object
    // {
    //     r,
    //     g,
    //     b,
    //     color,
    //     mat
    // }

    // full scectrum ROYGBIV palettes [0..1529]
    var palette = []; // global ROYGBIV palette [0..1529]
    var paletteGlow = []; // global ROYGBIV glow palette [0..1529]
    var paletteMetallic = []; // global ROYGBIV metallic palette [0..1529]

    // single color palettes [0..255]
    var paletteGray = []; // global gray palette [0..255]
    var paletteRed = []; // global red palette [0..255]
    var paletteGreen = []; // global green palette [0..255]
    var paletteBlue = []; // global blue palette [0..255]

    var paletteScroller = 0; // scrolling index modifier for palette scrolling

    //////////////////////////////
    // 3D canvas variables

    // var scene;
    var masterTransform;
    var dancersObjects = [];
    var dancersMaster;
    var innerSnowflakeObjects = [];
    var innerSnowflakeMaster;
    var outerSnowflakeObjects = [];
    var outerSnowflakeMaster;
    var frameObjects = [];
    var frameMaster;
    var floorObjects = [];
    var floorMaster;
    var starMaster;

    var ripple;
    var star2;
    var star3;
    var star4;

    var instanceMaster;

    var defaultGridMaterial;

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;

    // var highlightLayer;

    var camera;

    var cameraPosition = [{
            lookat: new BABYLON.Vector3(95, -40, -95),
            alpha: 2.355,
            beta: 0.01,
            radius: 180
        },
        {
            lookat: new BABYLON.Vector3(-95, -6, -95),
            alpha: 0.809,
            beta: .222,
            radius: 121
        },
        {
            lookat: new BABYLON.Vector3(0, -20, 0),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 980
        },
        {
            lookat: new BABYLON.Vector3(95, -40, 95),
            alpha: 3.927,
            beta: 0.84,
            radius: 70
        },
        {
            lookat: new BABYLON.Vector3(-95, -40, 95),
            alpha: 5.524,
            beta: 0.01,
            radius: 179
        },
    ];

    $('td').bind("click", function () {
        scene.cameras[0].target = cameraPosition[this.id - 1].lookat
        scene.cameras[0].alpha = cameraPosition[this.id - 1].alpha
        scene.cameras[0].beta = cameraPosition[this.id - 1].beta
        scene.cameras[0].radius = cameraPosition[this.id - 1].radius
    });

    //////////////////////////////
    // 2D canvas variables

    var canvas2D = document.getElementById("canvas2D");
    canvas2D.style.width = canvas2D.width;
    canvas2D.style.height = canvas2D.height;
    var ctx2D = canvas2D.getContext("2d");
    ctx2D.globalAlpha = .5;
    // var WIDTH = canvas2D.width;
    // var HEIGHT = canvas2D.height;

    //////////////////////////////
    // event listeners

    window.addEventListener('resize', function () {
        engine.resize();
    });

    file.onchange = function () {
        var files = this.files;
        // console.log(files);

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    };

    $('.new_Btn').bind("click", function () {
        $('#thefile').click();
    });

    //////////////////////////////
    // start the 3D render loop

    scene = createScene();
    engine.runRenderLoop(function () {

        // Scrolling index modifier for palette scrolling
        paletteScroller += .125;
        if (paletteScroller > 1529) {
            paletteScroller = 0;
        }

        analyzeData();
        updateObjects();

        scene.render();

    });

    ///////////////////////////////
    // start the 2D render loop

    render2DFrame();

    //////////////////////////////////////////////////////////////////////

    function analyzeData() {

        ////////////////////////////////////
        // get FREQUENCY data for this frame

        frAnalyser.getByteFrequencyData(frDataArray);

        // get highest and lowest FREQUENCY for this frame
        frCurrentHigh = 0;
        frCurrentLow = 255;
        frDataArray.forEach(f => {
            if (f > frCurrentHigh) frCurrentHigh = f;
            if (f < frCurrentLow) frCurrentLow = f;
        });

        // normalize the data   0..1
        frDataArrayNormalized = normalizeData(frDataArray);

        //////////////////////////////////////
        // get TIME DOMAIN data for this frame

        tdAnalyser.getByteTimeDomainData(tdDataArray);

        // get the highest for this frame
        let highest = 0;
        tdDataArray.forEach(d => {
            if (d > highest) highest = d;
        });

        // TODO: historical data for wave form       TODO:    TODO:
        tdHistory.push(highest);
        if (tdHistory.length > arraySize) {
            tdHistory.shift();
        }
    }

    function normalizeData(sourceData) {
        const multiplier = Math.pow(Math.max(...sourceData), -1);
        return sourceData.map(n => n * multiplier * 255);
    }

    function sampleData(source, start, end, samplesDesired) {
        let sampledData = [];

        let interval = Math.round((end - start) / samplesDesired);
        for (let i = start; i < end && i < source.length; i += interval) {
            sampledData.push(source[i]);
        }
        return sampledData;
    }

    function render2DFrame() {

        fix_dpi();

        if (options.showBars) {
            draw2DBars();
        }

        if (options.showTitle) {
            title.style.color = textColor;
        }

        let outputString = ""; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
        outputString += "alpha: <br>" + scene.activeCamera.alpha + "<br>";
        outputString += "beta:  <br>" + scene.activeCamera.beta + "<br>";
        outputString += "radius:<br>" + scene.activeCamera.radius + "<br>";
        logToScreen(outputString);

        requestAnimationFrame(render2DFrame);
    }

    function draw2DBars() {
        if (options.showBars) {
            let WIDTH = canvas2D.width;
            let HEIGHT = canvas2D.height;
            let barWidth = (WIDTH / (frDataLength));

            ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

            let x = 0;

            for (var i = 0; i < frBufferLength; i++) {
                let barHeight = frDataArray[i] * 1 + 1;

                var r = barHeight + (55.52 * (i / frDataLength));
                var g = 255 * (55 * i / frDataLength);
                var b = 255;

                ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
                ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }
    }

    function fix_dpi() {
        //create a style object that returns width and height
        var dpi = window.devicePixelRatio;

        let style = {
            height() {
                return +getComputedStyle(canvas2D).getPropertyValue('height').slice(0, -2);
            },
            width() {
                return +getComputedStyle(canvas2D).getPropertyValue('width').slice(0, -2);
            }
        }
        //set the correct attributes for a crystal clear image!
        canvas2D.setAttribute('width', style.width() * dpi);
        canvas2D.setAttribute('height', style.height() * dpi);
    }

    function createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);
        // scene.createDefaultEnvironment();

        glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.intensity = .55;

        // default object grid material
        defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
        defaultGridMaterial.majorUnitFrequency = 10;
        defaultGridMaterial.minorUnitVisibility = .33;
        defaultGridMaterial.gridRatio = 0.75;
        defaultGridMaterial.mainColor = new BABYLON.Color3(0.8, 0.75, 0.6);
        defaultGridMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        defaultGridMaterial.backFaceCulling = false;

        // sky grid material
        var skyMaterial = new BABYLON.GridMaterial("skyMaterial", scene);
        skyMaterial.majorUnitFrequency = 5;
        skyMaterial.minorUnitVisibility = .43;
        skyMaterial.gridRatio = 20.0;
        skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
        skyMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        skyMaterial.backFaceCulling = false;

        var skySphere = BABYLON.Mesh.CreateSphere("skySphere", 32, 2600, scene);
        skySphere.material = skyMaterial;

        // Water material
        if (options.showWater){
            let waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
            waterMaterial.bumpTexture = new BABYLON.Texture("//www.babylonjs.com/assets/waterbump.png", scene);
            waterMaterial.windForce = -10;
            waterMaterial.waveHeight = 0.5;
            waterMaterial.bumpHeight = 0.09;
            waterMaterial.waveLength = 0.09;
            waterMaterial.waveSpeed = 50.0;
            waterMaterial.colorBlendFactor = .5;
            waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
            waterMaterial.colorBlendFactor = 0;

            // Configure water material
            waterMaterial.addToRenderList(skySphere);
            // Water mesh
            var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
            waterMesh.material = waterMaterial;
            waterMesh.position.y = -47;
        }

        buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, paletteMetallic, scene);

        camera = new BABYLON.ArcRotateCamera("camera1", 1.57, .01, 980, new BABYLON.Vector3(0, 0, 0), scene);
        camera.upperRadiusLimit = 1000;
        camera.lowerRadiusLimit = -1000;

        // attach the camera to the canvas3D
        camera.attachControl(canvas3D, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);
        light.intensity = 1.6;
        // light.groundColor = paletteBlue[255].color;

        // var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(20, 20, -10), scene);
        // pointLight1.intensity = 1.2;

        // var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -80, 0), scene);
        // pointLight2.intensity = 1.2;

        var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 80, 0), scene);
        pointLight3.intensity = .8;

        var pointLight4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(40, 580, -180), scene);
        pointLight4.intensity = 1.0;


        createObjects();

        return scene;
    }

    function createObjects() {
        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        if (options.showDancers) createDancers();
        if (options.showInnerSnowflake) createInnerSnowflake();
        if (options.showFrame) createFrame();
        if (options.showOuterSnowflake) createOuterSnowflake()
        if (options.showFloor) createFloor();
        if (options.showRipple) createRipple();

        starMaster = new BABYLON.TransformNode("root");
        starMaster.position = new BABYLON.Vector3(95, -40, -95);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = 2;
        starMaster.scaling.z = 2;

        createStar2();
        createStar3();
        createStar4();
        // createBillboard();

    }

    function updateObjects() {

        if (options.showDancers) updateDancers();
        if (options.showInnerSnowflake) updateInnerSnowflake();
        if (options.showOuterSnowflake) updateOuterSnowflake();
        if (options.showFrame) updateFrame();
        if (options.showFloor) updateFloor();
        if (options.showRipple) updateRipple();

        star2.rotation.y -= .005;
        star3.rotation.y -= .0045;
        star4.rotation.y -= .005;

        updateStar2();
        updateStar3();
        updateStar4();

    }

    function createDancers() {
        //create a Center of Transformation
        dancersMaster = new BABYLON.TransformNode("root");
        dancersMaster.position = new BABYLON.Vector3(0, 0, 0);
        dancersMaster.parent = masterTransform;

        let radius = 40;
        for (let theta = 0; theta < 2 * Math.PI - Math.PI / 36; theta += Math.PI / 15) {

            let thing = BABYLON.MeshBuilder.CreateCylinder("cylinder1", {
                height: 1,
                diameterTop: 6,
                diameterBottom: 8,
                tessellation: 8,
                subdivisons: 1
            }, scene, true);
            thing.convertToFlatShadedMesh();

            thing.parent = dancersMaster; //apply to Box
            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            thing.rotation.y = -theta;

            dancersObjects.push(thing);
        }
    }

    function updateDancers() {

        dancersMaster.rotation.y += .005;

        dancersObjects.forEach((object, index) => {
            let y;
            object.material = paletteGlow[Math.round(map(frDataArrayNormalized[index], 0, 255, 1529, 0))].mat;
            y = frDataArrayNormalized[index] * .15 + .25;

            object.scaling.y = y;
            object.position.y = y / 2;
        });

    }

    function createInnerSnowflake() {
        innerSnowflakeMaster = new BABYLON.TransformNode("root");
        innerSnowflakeMaster.position = new BABYLON.Vector3(-95, -40, 95);
        innerSnowflakeMaster.parent = masterTransform;
        innerSnowflakeMaster.scaling.x = .5;
        innerSnowflakeMaster.scaling.z = .5;

        let width = 2.0;
        let depth = 2.0;
        let height = 4;
        let radius = 40.1;

        let itemsDesired = 320;

        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 32);
        // 0 - 20 Index

        let dataIndex = 0;
        let direction = -1;

        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / (itemsDesired / 4)) {

            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: height
            }, scene);
            thing.parent = innerSnowflakeMaster; //apply to Box

            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            thing.rotation.y = -theta;
            innerSnowflakeObjects.push(thing);

            dataIndex += direction;
        }

    }

    function updateInnerSnowflake() {
        let radius = 40.1;
        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 320;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 32);

        innerSnowflakeMaster.rotation.y -= .005;

        innerSnowflakeObjects.forEach((object, index) => {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let y = frDataArrayNormalized[dataIndex + 25] * frDataArrayNormalized[dataIndex + 25] * .0012;
            object.material = paletteRed[frDataArrayNormalized[dataIndex + 25]].mat;
            object.scaling.x = y;

            let theta = Math.PI / (itemsDesired / 4) * index;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);

            dataIndex += direction;
        });
    }

    function createOuterSnowflake() {
        outerSnowflakeMaster = new BABYLON.TransformNode("root");
        outerSnowflakeMaster.position = new BABYLON.Vector3(-95, -40, 95);
        outerSnowflakeMaster.parent = masterTransform;
        outerSnowflakeMaster.scaling.x = .5;
        outerSnowflakeMaster.scaling.z = .5;

        let diameterTop = 2;
        var diameterBottom = 6;
        let radius = 60;

        let itemsDesired = 320;

        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 16);
        // 0 - 20 Index

        let dataIndex = 0;
        let direction = -1;

        for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / (itemsDesired / 4)) {

            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let thing = BABYLON.MeshBuilder.CreateCylinder("cone", {
                diameterTop: diameterTop,
                diameterBottom: diameterBottom,
                tessellation: 20
            }, scene);

            thing.parent = outerSnowflakeMaster; //apply to Box

            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            thing.rotation.z = -Math.PI / 2;
            thing.rotation.y = -theta;
            outerSnowflakeObjects.push(thing);

            dataIndex += direction;
        }
    }

    function updateOuterSnowflake() {
        let radius = 45;
        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 320;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        outerSnowflakeMaster.rotation.y -= .005;

        outerSnowflakeObjects.forEach((object, index) => {
            if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

            let y = frDataArrayNormalized[dataIndex + 25] * frDataArrayNormalized[dataIndex + 25] * .0013;
            object.material = paletteBlue[frDataArrayNormalized[dataIndex + 25]].mat;
            object.scaling.y = y;

            let theta = Math.PI / (itemsDesired / 4) * index;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);

            dataIndex += direction;
        });
    }

    function createFrame() {
        frameMaster = new BABYLON.TransformNode("root");
        frameMaster.position = new BABYLON.Vector3(0, -40, 0);
        frameMaster.parent = masterTransform;

        let width = 40;
        let depth = 40;
        let spacing = 25;
        let frameWidth = spacing / 2;
        let frameLength = width + spacing;
        let frameHeight = 12;

        for (let x = -5; x < 5; x++) {
            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: 1
            }, scene);

            let px = x * (width + spacing) + (width + spacing) / 2;
            let py = -40;
            let pz = -5 * (depth + spacing) + (depth + spacing) / 2;

            thing.position = new BABYLON.Vector3(px, py, pz);

            frameObjects.push(thing);

            createBorder(px, py, pz);
        }

        for (let z = -4; z < 4; z++) {
            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: 1
            }, scene);

            let px = 4 * (depth + spacing) + (width + spacing) / 2;
            let py = -40;
            let pz = z * (depth + spacing) + (depth + spacing) / 2;

            thing.position = new BABYLON.Vector3(px, py, pz);

            frameObjects.push(thing);

            createBorder(px, py, pz);
        }

        for (let x = 4; x >= -5; x--) {
            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: 1
            }, scene);

            let px = x * (width + spacing) + (width + spacing) / 2;
            let py = -40;
            let pz = 4 * (depth + spacing) + (depth + spacing) / 2;

            thing.position = new BABYLON.Vector3(px, py, pz);

            frameObjects.push(thing);

            createBorder(px, py, pz);
        }

        for (let z = 4; z > -4; z--) {
            let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: width,
                depth: depth,
                height: 1
            }, scene);

            let px = -5 * (depth + spacing) + (width + spacing) / 2;
            let py = -40;
            let pz = z * (depth + spacing) - (depth + spacing) / 2;

            thing.position = new BABYLON.Vector3(px, py, pz);

            frameObjects.push(thing);

            createBorder(px, py, pz);
        }

        function createBorder(x, y, z) {

            let materialIndex = 20;

            let back = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            back.position = new BABYLON.Vector3(x + (width / 2 + frameWidth / 2), y, z);
            back.material = paletteMetallic[materialIndex].mat;

            let front = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            front.position = new BABYLON.Vector3(x - (width / 2 + frameWidth / 2), y, z);
            front.material = paletteMetallic[materialIndex].mat;

            let left = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength - 2 * frameWidth,
                height: frameHeight
            }, scene);

            left.position = new BABYLON.Vector3(x, y, z + (width / 2 + frameWidth / 2));
            left.rotation.y = Math.PI / 2;
            left.material = paletteMetallic[materialIndex].mat;

            let right = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength - 2 * frameWidth,
                height: frameHeight
            }, scene);

            right.position = new BABYLON.Vector3(x, y, z - (width / 2 + frameWidth / 2));
            right.rotation.y = Math.PI / 2;
            right.material = paletteMetallic[materialIndex].mat;
        }
    }

    function updateFrame() {
        frameObjects.forEach((o, i) => {
            let y = frDataArrayNormalized[i] / 35 + .1;
            o.scaling.y = y;
            o.position.y = -40 + y / 2;
            o.material = paletteGlow[Math.round(map((frDataArrayNormalized[(i + 5) % 9] * 1.3) % 128 || 0, 0, 128, 0, 900))].mat;
        });
    }

    function createFloor() {

        let xOffset = -95;
        let zOffset = -95;

        floorMaster = new BABYLON.TransformNode("root");
        floorMaster.position = new BABYLON.Vector3(0, -40, 0);
        floorMaster.parent = masterTransform;

        let width = 8;
        let depth = 8;
        let spacing = 2;
        let frameWidth = spacing / 2;
        let frameLength = width + spacing;
        let frameHeight = 7.5;
        let frameColorIndex = 50;

        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {

                let thing = BABYLON.MeshBuilder.CreateBox(("floor(" + x + "," + z + ")"), {
                    width: width,
                    depth: depth,
                    height: 1
                }, scene);

                let px = x * (width + spacing) - 3.5 * (width + spacing) + xOffset;
                let py = -40;
                let pz = z * (depth + spacing) - 3.5 * (depth + spacing) + zOffset;

                thing.position = new BABYLON.Vector3(px, py, pz);

                floorObjects.push(thing);
                createBorder(px, py, pz);
            }

        }

        function createBorder(x, y, z) {
            let back = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            back.position = new BABYLON.Vector3(x + (width / 2 + frameWidth / 2), y, z);
            back.material = paletteGray[frameColorIndex].mat;

            let front = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            front.position = new BABYLON.Vector3(x - (width / 2 + frameWidth / 2), y, z);
            front.material = paletteGray[frameColorIndex].mat;

            let left = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            left.position = new BABYLON.Vector3(x, y, z + (width / 2 + frameWidth / 2));
            left.rotation.y = Math.PI / 2;
            left.material = paletteGray[frameColorIndex].mat;

            let right = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            right.position = new BABYLON.Vector3(x, y, z - (width / 2 + frameWidth / 2));
            right.rotation.y = Math.PI / 2;
            right.material = paletteGray[frameColorIndex].mat;
        }

    }

    function updateFloor() {
        floorObjects.forEach((o, i) => {
            let y = frDataArrayNormalized[i] / 35 + .1;
            o.scaling.y = y;
            o.position.y = -40 + y / 2;
            o.material = paletteGlow[Math.round(map((frDataArrayNormalized[(i * 2)] * 2) % 255, 0, 255, 0, 1529))].mat;
        });
    }

    // Ribbon 256*256

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

        instanceMaster = new BABYLON.TransformNode("root");
        instanceMaster.scaling.x = 7;
        instanceMaster.scaling.y = 7;
        instanceMaster.scaling.z = 7;
        instanceMaster.position = new BABYLON.Vector3(-95, -40, -95);

        instanceMaster.parent = masterTransform;

        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star2.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.z = theta
        }

        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star2.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.x = theta
        }

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

    function createStar3() {
        var paths = [];
        var sideO = BABYLON.Mesh.BACKSIDE;

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 64;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 64) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = 3 * r * Math.cos(theta) * dataIndex;
                let z = 3 * r * Math.sin(theta) * dataIndex;
                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));
                dataIndex += direction;

            }
            paths.push(path);
        }
        star3 = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);
        star3.parent = starMaster;

        star3.material = paletteGray[140].mat;

        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star3.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.z = theta
            newTestInstance.position.y = 6;
            newTestInstance.scaling.x = .2
            newTestInstance.scaling.y = .2
            newTestInstance.scaling.z = .2
        }


        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star3.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.x = theta
            newTestInstance.position.y = 6;
            newTestInstance.scaling.x = .2
            newTestInstance.scaling.y = .2
            newTestInstance.scaling.z = .2
        }
    }

    function updateStar3() {
        var paths = [];
        var myColors = [];

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 64;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 64) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.cos(theta) / 100;
                let z = frDataArrayNormalized[dataIndex * r] * r * 4 * Math.sin(theta) / 100;
                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));
                dataIndex += direction;
            }
            paths.push(path);
        }
        star3 = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: paths,
            instance: star3,
            myColors: myColors,
            sideOrientation: 1
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

        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star4.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.z = theta
            newTestInstance.position.y = 11;
            newTestInstance.scaling.x = .1
            newTestInstance.scaling.y = .1
            newTestInstance.scaling.z = .1
        }

        for (let theta = 0; theta <= 4 * Math.PI / 2; theta += Math.PI / 64) {
            let newTestInstance = star4.createInstance("clone");
            newTestInstance.parent = instanceMaster;
            newTestInstance.rotation.x = theta
            newTestInstance.position.y = 11;
            newTestInstance.scaling.x = .1
            newTestInstance.scaling.y = .1
            newTestInstance.scaling.z = .1
        }

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

    function createBillboard() {
        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture("app/assets/images/img.jpg", scene);

        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false; //Allways show the front and the back of an element

        //Creation of a plane
        var plane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
        plane.position.z = 220;
        plane.material = materialPlane;
    }

};