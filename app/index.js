import {
    // addToGlowPalette,
    // addToPalette,
    buildPalettes,
    map,
    logToScreen
} from './utilities.js';

import {
    Star
} from './Star.js';

var scene;
var localStorage;
var playList;

window.onload = function () {

    var options = {
        showBars: true,
        showTitle: false,
        showRipple: true,
        showWater: true,
        showSky: true
    }

    // var meshDimensions = 256;

    //////////////////////////////
    // AUDIO variables

    var file;
    var fileInput = document.getElementById("fileInput");
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

    // var playList;
    localStorage = window.localStorage;
    playList = localStorage.getItem("playlist");

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

    var starMaster;

    var defaultGridMaterial;

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;
    var waterMaterial

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
            lookat: new BABYLON.Vector3(0, 0, 0),
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

    //////////////////////////////
    // event listeners

    window.addEventListener('resize', function () {
        engine.resize();
    });

    fileInput.onchange = function () {
        var files = this.files;
        // console.log(files);
        // console.log(playList);
        // // playList.push(...files);

        // playList = Object.assign(playList, files);

        // console.log(playList);
        // localStorage.setItem("playlist", playList);
        // console.log(playList);

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    };

    $('.new_Btn').bind("click", function () {
        $('#fileInput').click();
    });

    //////////////////////////////
    // start the 3D render loop
    var starObjects = [];
    var pieResolution = 256;

    scene = createScene();
    createObjects();

    engine.runRenderLoop(function () {

        // Scrolling index modifier for palette scrolling
        paletteScroller += .125;
        if (paletteScroller > 1529) {
            paletteScroller = 0;
        }

        // call update on all objects
        starObjects.forEach((sObject, index) => {
            sObject.update(frDataArrayNormalized, index);
        });


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

    //////////////////////////////////////////////////////////////////////

    function render2DFrame() {

        analyzeData();

        fix_dpi();

        if (options.showBars) {
            draw2DBars();
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

    //////////////////////////////////////////////////////////////////////

    function createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);
        // scene.createDefaultEnvironment();

        glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.intensity = 1.75;

        // default object grid material
        defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
        defaultGridMaterial.majorUnitFrequency = 10;
        defaultGridMaterial.minorUnitVisibility = .33;
        defaultGridMaterial.gridRatio = 0.75;
        defaultGridMaterial.mainColor = new BABYLON.Color3(0.8, 0.75, 0.6);
        defaultGridMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        defaultGridMaterial.backFaceCulling = false;

        if (options.showSky){
            // sky grid material
            var skyMaterial = new BABYLON.GridMaterial("skyMaterial", scene);
            skyMaterial.majorUnitFrequency = 5;
            skyMaterial.minorUnitVisibility = .43;
            skyMaterial.gridRatio = 20.0;
            skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
            skyMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
            skyMaterial.backFaceCulling = false;

            var skySphere = BABYLON.Mesh.CreateSphere("skySphere", 32, 19200, scene);
            skySphere.material = skyMaterial;
        }

        // Water material
        if (options.showWater) {
            waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
            waterMaterial.bumpTexture = new BABYLON.Texture("//www.babylonjs.com/assets/waterbump.png", scene);
            waterMaterial.windForce = -5;
            waterMaterial.waveHeight = 0.4;
            waterMaterial.bumpHeight = 0.06;
            waterMaterial.waveLength = 0.12;
            waterMaterial.waveSpeed = 30.0;
            waterMaterial.colorBlendFactor = .5;
            waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
            waterMaterial.colorBlendFactor = 0;

            // Configure water material
            waterMaterial.addToRenderList(skySphere);
            // Water mesh
            var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 50000, 50000, 32, scene, false);
            waterMesh.material = waterMaterial;
            waterMesh.position.y = -47;
        }

        buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, paletteMetallic, scene);

        camera = new BABYLON.ArcRotateCamera("camera1", 1.57, .01, 4000, new BABYLON.Vector3(0, 0, 0), scene);
        camera.upperRadiusLimit = 9400;
        camera.lowerRadiusLimit = 30;
        camera.lower

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


//        createObjects();

        return scene;
    }

    function createObjects() {

        
        masterTransform = new BABYLON.TransformNode("root");
        // masterTransform.position = new BABYLON.Vector3(0, 0, 0);
        
        starMaster = new BABYLON.TransformNode("starMaster");
        
        createStarGroup1();
        
        starMaster.position = new BABYLON.Vector3(0, 0, 0);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        
    }

    function updateObjects() {



        // starMaster.rotation.x += .01;
        // starMaster.rotation.z += .004;
        // starMaster.rotation.y -= .008;

    }

    // let testOptions = {
    //     innerStartIndex : 0,
    //     outerStartIndex : 0,

    //     innerSlices : .5,
    //     outerSlices : .5,

    //     innerRadius : 1,
    //     outerRadius : 4,

    //     resolution: 256,

    //     xRotation: 0,
    //     yRotation: -.01,
    //     yRotation: 0
    // }

    // Ribbon 256*256

    function createStarGroup1() {

        // console.log("creating star objects");

        let test = new Star("test Star name", "test Star parent", paletteBlue, paletteRed[200].mat, pieResolution, waterMaterial, scene);
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
        test.mesh.parent = starMaster;
        starObjects.push(test);


        let test2 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
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
        test2.mesh.parent = starMaster;
        starObjects.push(test2);


        let test3 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[400].mat, pieResolution, waterMaterial, scene);
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
            0.005,  // clockwise rotation
            0
        );
        test3.mesh.parent = starMaster;
        starObjects.push(test3);


        let test4 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[600].mat, pieResolution, waterMaterial, scene);
        test4.setOptions(
            3,
            4,

            4,
            4,

            60,
            60,

            256,

            waterMaterial,

            0,
            0,
            0.01
        );
        test4.mesh.parent = starMaster;
        starObjects.push(test4);


        let test5 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[800].mat, pieResolution, waterMaterial, scene);
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
        test5.mesh.parent = starMaster;
        starObjects.push(test5);


        let test6 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[1000].mat, pieResolution, waterMaterial, scene);
        test6.setOptions(
            6,
            7,

            16,
            16,

            140,
            140,

            256,

            waterMaterial,

            0,
            -0.005,  // counter clockwise rotation
            0
        );
        test6.mesh.parent = starMaster;
        starObjects.push(test6);


        let test7 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[1200].mat, pieResolution, waterMaterial, scene);
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
        test7.mesh.parent = starMaster;
        starObjects.push(test7);

        let test8 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[50].mat, pieResolution, waterMaterial, scene);
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
        test8.mesh.parent = starMaster;
        starObjects.push(test8);
    
    
    
        let test9 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
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
            0.005,  // clockwise rotation
            0
        );
        test9.mesh.parent = starMaster;
        starObjects.push(test9);
    
    
    }

};