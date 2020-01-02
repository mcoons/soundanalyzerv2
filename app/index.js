import {
    logToScreen
} from './utilities.js';

import {
    AudioManager
} from './AudioManager.js';


import {
    Star
} from './Star.js';

<<<<<<< HEAD
    var showDancers = true;
    var showInnerSnowflake = true;
    var showOuterSnowflake = true;
    var showFloor = true;
    var showBars = true;
    var showTitle = false;
=======
var scene;
>>>>>>> 2a88d21f0e22156e8ab4f96446d37ce4f6bb8f56

window.onload = function () {

    var options = {
        showBars: true,
        showTitle: false,
        showRipple: true,
        showWater: false,
        showSky: false
    }

    var siteIndex = Math.round(Math.random() * 47) + 1;
    var isSiteTrack = true;
    var audioManager = new AudioManager();
    audioManager.initAudio($('.playlist li:nth-child(' + siteIndex + ')'));

    
    //////////////////////////////////////////////////////////////////////
    // start the 3D render loop

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;
    var waterMaterial
    var defaultGridMaterial;
    var camera;
    var cameraPosition = [{
            lookat: new BABYLON.Vector3(200, 0, -200),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 400
        },
        {
            lookat: new BABYLON.Vector3(-200, 0, -200),
            alpha: Math.PI / 2,
            beta: .01,
            radius: 400
        },
        {
            lookat: new BABYLON.Vector3(0, 0, 0),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 930
        },
        {
            lookat: new BABYLON.Vector3(200, 0, 200),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 400
        },
        {
            lookat: new BABYLON.Vector3(-200, 0, 200),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 400
        },
    ];
    var starObjects = [];
    var pieResolution = 256;

    var masterTransform;

    var starMaster1;
    var starMaster2;
    var starMaster3;
    var starMaster4;
    var starMaster5;
    var starMaster6;    
    var starMaster7;
    var starMaster8;
    var starMaster9;
    var starMaster10;
    var starMaster11;
    var starMaster12;

    scene = createScene();
    createObjects();

    engine.runRenderLoop(function () {
        updateObjects();
        scene.render();
    });

    function createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);

        glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.intensity = 2.75;

        // default object grid material
        defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
        defaultGridMaterial.majorUnitFrequency = 10;
        defaultGridMaterial.minorUnitVisibility = .33;
        defaultGridMaterial.gridRatio = 0.75;
        defaultGridMaterial.mainColor = new BABYLON.Color3(0.8, 0.75, 0.6);
        defaultGridMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        defaultGridMaterial.backFaceCulling = false;

        // sky grid material
        if (options.showSky) {
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
            waterMesh.position.y = -80;
        }

        // buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, null, paletteGray, paletteMetallic, scene);

        camera = new BABYLON.ArcRotateCamera("camera1", 1.59, .678, 930, new BABYLON.Vector3(0, 0, 0), scene);
        camera.upperRadiusLimit = 9400;
        camera.lowerRadiusLimit = 10;
        camera.lower

        // attach the camera to the canvas3D
        camera.attachControl(canvas3D, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);
        light.intensity = 1.6;
        // light.groundColor = null[255].color;

        // var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(20, 20, -10), scene);
        // pointLight1.intensity = 1.2;

        // var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -80, 0), scene);
        // pointLight2.intensity = 1.2;

        var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 80, 0), scene);
        pointLight3.intensity = .8;

        var pointLight4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(40, 580, -180), scene);
        pointLight4.intensity = 1.0;

        return scene;
    }

    function createObjects() {

        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        // starMaster1 = new BABYLON.TransformNode("starMaster1");

        // createStarGroup1(starMaster1);

        // starMaster1.position = new BABYLON.Vector3(400, 0, 0);
        // starMaster1.parent = masterTransform;
        // starMaster1.scaling.x = .1;
        // starMaster1.scaling.y = .1;
        // starMaster1.scaling.z = .1;

        starMaster2 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom2({
            r: .75,
            g: .25,
            b: .25
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster2);

        starMaster2.position = new BABYLON.Vector3(200, 0, -200);
        starMaster2.parent = masterTransform;
        starMaster2.scaling.x = .2;
        starMaster2.scaling.y = .2;
        starMaster2.scaling.z = .2;
        starMaster2.rotation.y = Math.PI / 2;

        starMaster3 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom3({
            r: .25,
            g: .65,
            b: .25
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster3);

        starMaster3.position = new BABYLON.Vector3(-200, 0, -200);
        starMaster3.parent = masterTransform;
        starMaster3.scaling.x = .2;
        starMaster3.scaling.y = .2;
        starMaster3.scaling.z = .2;
        starMaster3.rotation.y = Math.PI / 2;

        starMaster4 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom4({
            r: .25,
            g: .25,
            b: .75
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster4);

        starMaster4.position = new BABYLON.Vector3(200, 0, 200);
        starMaster4.parent = masterTransform;
        starMaster4.scaling.x = .3;
        starMaster4.scaling.y = .3;
        starMaster4.scaling.z = .3;
        starMaster4.rotation.y = Math.PI / 2;

        starMaster5 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom5({
            r: .95,
            g: .25,
            b: .95
        }, {
            x: 1,
            y: 0,
            z: 1
        }, starMaster5);

        starMaster5.position = new BABYLON.Vector3(-200, 0, 200);
        starMaster5.parent = masterTransform;
        starMaster5.scaling.x = .2;
        starMaster5.scaling.y = .2;
        starMaster5.scaling.z = .2;
        starMaster5.rotation.y = Math.PI / 2;

        starMaster6 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom6({
            r: .5,
            g: .5,
            b: .5
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster6);

        starMaster6.position = new BABYLON.Vector3(0, 0, 0);
        starMaster6.parent = masterTransform;
        starMaster6.scaling.x = .2;
        starMaster6.scaling.y = .2;
        starMaster6.scaling.z = .2;
        starMaster6.rotation.y = Math.PI / 2;

        ////////////////////////////////////////////////////////

        starMaster7 = new BABYLON.TransformNode("starMaster7");

        createStarGroupRandom2({
            r: .75,
            g: .25,
            b: .25
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster7);

        starMaster7.position = new BABYLON.Vector3(400, 0, -200);
        starMaster7.parent = masterTransform;
        starMaster7.scaling.x = .2;
        starMaster7.scaling.y = .2;
        starMaster7.scaling.z = .2;
        starMaster7.rotation.y = Math.PI / 2;

        starMaster8 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom3({
            r: .25,
            g: .65,
            b: .25
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster8);

        starMaster8.position = new BABYLON.Vector3(-400, 0, -200);
        starMaster8.parent = masterTransform;
        starMaster8.scaling.x = .2;
        starMaster8.scaling.y = .2;
        starMaster8.scaling.z = .2;
        starMaster8.rotation.y = Math.PI / 2;

        starMaster9 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom4({
            r: .25,
            g: .25,
            b: .75
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster9);

        starMaster9.position = new BABYLON.Vector3(400, 0, 200);
        starMaster9.parent = masterTransform;
        starMaster9.scaling.x = .3;
        starMaster9.scaling.y = .3;
        starMaster9.scaling.z = .3;
        starMaster9.rotation.y = Math.PI / 2;

        starMaster10 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom5({
            r: .95,
            g: .25,
            b: .95
        }, {
            x: 1,
            y: 0,
            z: 1
        }, starMaster10);

        starMaster10.position = new BABYLON.Vector3(-400, 0, 200);
        starMaster10.parent = masterTransform;
        starMaster10.scaling.x = .2;
        starMaster10.scaling.y = .2;
        starMaster10.scaling.z = .2;
        starMaster10.rotation.y = Math.PI / 2;

        starMaster11 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom6({
            r: .5,
            g: .5,
            b: .5
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster11);

        starMaster11.position = new BABYLON.Vector3(0, 200, 0);
        starMaster11.parent = masterTransform;
        starMaster11.scaling.x = .2;
        starMaster11.scaling.y = .2;
        starMaster11.scaling.z = .2;
        starMaster11.rotation.y = Math.PI / 2;
        // drawRandomStars();
    }

    function updateObjects() {
        // call update on all objects
        starObjects.forEach((sObject, index) => {
            sObject.update(audioManager.frDataArrayNormalized, index);
        });
    }

    function drawRandomStars() {
        masterTransform = new BABYLON.TransformNode("root");
        for (let i = 0; i < 6; i += 6) {

            let masters = [];

            masters[i] = new BABYLON.TransformNode("masters[i+1]");
            // // masters.push(starMaster);                
            // createStarGroup1(masters[i]);

            // masters[i].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            // masters[i].parent = masterTransform;
            // masters[i].scaling.x = .1;
            // masters[i].scaling.y = .1;
            // masters[i].scaling.z = .1;


            masters[i + 1] = new BABYLON.TransformNode("masters[i+1]");
            // masters.push(masters[i+1]);            
            createStarGroupRandom2({
                r: .75,
                g: .25,
                b: .25
            }, {
                x: 1,
                y: 1,
                z: 1
            }, masters[i + 1]);

            masters[i + 1].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            masters[i + 1].parent = masterTransform;
            masters[i + 1].scaling.x = .2;
            masters[i + 1].scaling.y = .2;
            masters[i + 1].scaling.z = .2;
            masters[i + 1].rotation.y = Math.PI / 2;

            masters[i + 2] = new BABYLON.TransformNode("masters[i+2]");
            // masters.push(masters[i+2]);            
            createStarGroupRandom3({
                r: .25,
                g: .65,
                b: .25
            }, {
                x: 0,
                y: 1,
                z: 0
            }, masters[i + 2]);

            masters[i + 2].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            masters[i + 2].parent = masterTransform;
            masters[i + 2].scaling.x = .2;
            masters[i + 2].scaling.y = .2;
            masters[i + 2].scaling.z = .2;
            masters[i + 2].rotation.y = Math.PI / 2;

            masters[i + 3] = new BABYLON.TransformNode("masters[i+3]");
            // masters.push(masters[i+3]);            
            createStarGroupRandom4({
                r: .25,
                g: .25,
                b: .75
            }, {
                x: 1,
                y: 1,
                z: 1
            }, masters[i + 3]);

            masters[i + 3].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            masters[i + 3].parent = masterTransform;
            masters[i + 3].scaling.x = .3;
            masters[i + 3].scaling.y = .3;
            masters[i + 3].scaling.z = .3;
            masters[i + 3].rotation.y = Math.PI / 2;

            masters[i + 4] = new BABYLON.TransformNode("masters[i+4]");
            // masters.push(starMaster);            
            createStarGroupRandom5({
                r: .95,
                g: .25,
                b: .95
            }, {
                x: 1,
                y: 0,
                z: 1
            }, masters[i + 4]);

            masters[i + 4].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            masters[i + 4].parent = masterTransform;
            masters[i + 4].scaling.x = .2;
            masters[i + 4].scaling.y = .2;
            masters[i + 4].scaling.z = .2;
            masters[i + 4].rotation.y = Math.PI / 2;

            masters[i + 5] = new BABYLON.TransformNode("masters[i+5]");
            // masters.push(masters[i+5]);            
            createStarGroupRandom6({
                r: 1,
                g: 1,
                b: 1
            }, {
                x: 0,
                y: 1,
                z: 0
            }, masters[i + 5]);

            masters[i + 5].position = new BABYLON.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 + 1500, Math.random() * 1000 - 500);
            masters[i + 5].parent = masterTransform;
            masters[i + 5].scaling.x = .2;
            masters[i + 5].scaling.y = .2;
            masters[i + 5].scaling.z = .2;
            masters[i + 5].rotation.y = Math.PI / 2;
        }
    }

    function createStarGroupRandom2(colorBias, rotationBias, parent, location) {

        for (let index = 0; index < 9; index++) {

            let test = new Star("Random Star +index", "test Star parent", null, getBiasedGlowMaterial(colorBias), pieResolution, waterMaterial, scene);
            let rad = 20 * index + 10;
            test.setOptions(
                Math.round(Math.random() * 20),
                Math.round(Math.random() * 20),

                Math.pow(2, Math.round(Math.random() * 6)),
                Math.pow(2, Math.round(Math.random() * 6)),

                rad,
                rad + Math.round(Math.random() * 6) - 3,

                256,

                waterMaterial,

                rotationBias.x ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            test.mesh.parent = parent;
            starObjects.push(test);
        }
    }

    function createStarGroupRandom3(colorBias, rotationBias, parent, location) {

        for (let index = 0; index < 9; index++) {

            let test = new Star("Random Star +index", "test Star parent", null, getBiasedGlowMaterial(colorBias), pieResolution, waterMaterial, scene);
            let rad = 20 * index + 10;
            let i = Math.round(Math.random() * 10)
            test.setOptions(
                i,
                i + Math.round(Math.random() * 2 + 1),

                Math.pow(2, Math.round(Math.random() * 6) + 1),
                Math.pow(2, Math.round(Math.random() * 6) + 1),

                rad,
                rad,

                256,

                waterMaterial,

                rotationBias.x ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            test.mesh.parent = parent;
            starObjects.push(test);
        }
    }

    function createStarGroupRandom4(colorBias, rotationBias, parent, location) {

        for (let index = 0; index < 9; index++) {

            let test = new Star("Random Star +index", "test Star parent", null, getBiasedGlowMaterial(colorBias), pieResolution, waterMaterial, scene);
            let rad = 8 * (9 - index) + 40;
            let i = Math.round(Math.random() * 10)
            test.setOptions(
                i,
                i,

                Math.pow(2, Math.round(Math.random() * 1) + 2),
                Math.pow(2, Math.round(Math.random() * 1) + 4),

                rad,
                rad + 2,

                256,

                waterMaterial,

                rotationBias.x ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            test.mesh.parent = parent;
            starObjects.push(test);
        }
    }

    function createStarGroupRandom5(colorBias, rotationBias, parent, location) {

        for (let index = 0; index < 9; index++) {

            let test = new Star("Random Star +index", "test Star parent", null, getBiasedGlowMaterial(colorBias), pieResolution, waterMaterial, scene);
            let rad = 10 * index + 80;
            let i = Math.round(Math.random() * 10 + 2);
            let s = Math.pow(2, Math.round(Math.random() * 1));
            test.setOptions(
                i,
                i - 1,

                Math.pow(2, index),
                Math.pow(2, index),

                rad,
                rad + 1,

                256,

                waterMaterial,

                rotationBias.x ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            test.mesh.parent = parent;
            starObjects.push(test);
        }
    }

    function createStarGroupRandom6(colorBias, rotationBias, parent, location) {

        for (let index = 0; index < 9; index++) {

            let test = new Star("Random Star +index", "test Star parent", null, getBiasedGlowMaterial(colorBias), pieResolution, waterMaterial, scene);
            let rad = 10 * index + 80;
            let i = Math.round(Math.random() * 10 + 2);
            let s = Math.pow(2, Math.round(Math.random() * 1));
            test.setOptions(
                18 - i * 2,
                i + 1,

                Math.pow(2, (index + 2)),
                Math.pow(2, (index + 2)),

                rad,
                rad + 1,

                256,

                waterMaterial,

                rotationBias.x ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z ? (Math.round(Math.random()) ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            test.mesh.parent = parent;
            starObjects.push(test);
        }
    }

    function getBiasedGlowMaterial(colorBias) {
        
        let dimmer = 1.0;
        let r = Math.random() * colorBias.r;
        let g = Math.random() * colorBias.g;
        let b = Math.random() * colorBias.b;
        let color = new BABYLON.Color4(r * dimmer, g * dimmer, b * dimmer, 1, false);

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseColor = color;
        mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
        mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
        mat.emissiveColor = new BABYLON.Color3(r, g, b);
        mat.backFaceCulling = true;
        mat.alpha = .5;

        return mat;
    }

    //////////////////////////////////////////////////////////////////////
    // start the 2D render loop

    var canvas2D = document.getElementById("canvas2D");
    canvas2D.style.width = canvas2D.width;
    canvas2D.style.height = canvas2D.height;
    var ctx2D = canvas2D.getContext("2d");
    ctx2D.globalAlpha = .5;
    
    render2DFrame();

    function render2DFrame() {

        audioManager.analyzeData();

        fix_dpi();

        if (options.showBars) {
            draw2DBars();
        }

        drawWaveform(canvas2D, audioManager.tdDataArrayNormalized, canvas2D.width, 60);

        renderConsoleOutput();

        requestAnimationFrame(render2DFrame);
    }

    function drawWaveform(canvas, drawData, width, height) {
        let ctx = canvas.getContext('2d');
        let drawHeight = height / 2;

        ctx.lineWidth = 5;
        ctx.moveTo(0, drawHeight);
        ctx.beginPath();
        for (let i = 0; i < width; i++) {
            let minPixel = drawData[i] * .5;
            ctx.lineTo(i, minPixel);
        }

        ctx.strokeStyle = 'white';

        ctx.stroke();
    }

    function renderConsoleOutput() {
        let outputString = "<br><br><br><br><br><br>"; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
        outputString += "&nbsp alpha: <br> &nbsp " + Math.round(scene.activeCamera.alpha * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp beta:  <br> &nbsp " + Math.round(scene.activeCamera.beta * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp radius:<br> &nbsp " + Math.round(scene.activeCamera.radius * 1000) / 1000 + "<br><br>";
        outputString += "&nbsp site index:<br> &nbsp " + siteIndex + "<br><br>";
        logToScreen(outputString);
    }

    function draw2DBars() {
        if (options.showBars) {
            let WIDTH = canvas2D.width;
            let HEIGHT = canvas2D.height;
            let barWidth = (WIDTH / (audioManager.frDataLength));

            ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

            let x = 0;

            for (var i = 0; i < audioManager.frBufferLength; i++) {
                let barHeight = audioManager.frDataArray[i] * 1 + 1;

                var r = barHeight + (55.52 * (i / audioManager.frDataLength));
                var g = 255 * (55 * i / audioManager.frDataLength);
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
    // event listeners
    
    $('td').bind("click", function () {
        scene.cameras[0].target = cameraPosition[this.id - 1].lookat
        scene.cameras[0].alpha = cameraPosition[this.id - 1].alpha
        scene.cameras[0].beta = cameraPosition[this.id - 1].beta
        scene.cameras[0].radius = cameraPosition[this.id - 1].radius
    });
        
    // show playlist
    $('.pl').click(function (e) {
        // e.preventDefault();
        $('.playlist').fadeIn(500);
    });

    // playlist elements - click
    $('.playlist li').click(function () {
        isSiteTrack = true;
        siteIndex = Number($(this).attr('index'));
        audioManager.initAudio($(this));
        $('.playlist').fadeOut(500);
    });
    
    // custom button that calls click on hidden fileInput element
    $('.local_Btn').bind("click", function () {
        $('#fileInput').click();
    });

    // local file selection that is hidden
    fileInput.onchange = function () {
        var files = this.files;

        // console.log(files[0]);
        isSiteTrack = false;

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    };

    audio.onended = function () {
        siteIndex++;
        if (siteIndex > 48) {
            siteIndex = 1;
        }

        if (isSiteTrack) {
            let current = $('.playlist li:nth-child(' + siteIndex + ')');
            audioManager.initAudio(current);
        }


    };

    window.addEventListener('resize', function () {
        engine.resize();
    });

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




    // function createStarGroup1(parent) {

    //     // console.log("creating star objects");

    //     let test = new Star("test Star name", "test Star parent", null, paletteRed[200].mat, pieResolution, waterMaterial, scene);
    //     test.setOptions(
    //         0,
    //         0,

    //         .5,
    //         .5,

    //         1,
    //         4,

    //         256,

    //         waterMaterial,

    //         0,
    //         0,
    //         0
    //     );
    //     test.mesh.parent = parent;
    //     starObjects.push(test);


    //     let test2 = new Star("test Star name", "test Star parent", null, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
    //     test2.setOptions(
    //         0,
    //         1,

    //         1,
    //         1,

    //         20,
    //         21,

    //         256,

    //         waterMaterial,

    //         0.01,
    //         0,
    //         0
    //     );
    //     test2.mesh.parent = parent;
    //     starObjects.push(test2);


    //     let test3 = new Star("test Star name", "test Star parent", null, paletteGlow[400].mat, pieResolution, waterMaterial, scene);
    //     test3.setOptions(
    //         0,
    //         2,

    //         2,
    //         2,

    //         40,
    //         41,

    //         256,

    //         waterMaterial,

    //         0,
    //         0.005, // clockwise rotation
    //         0
    //     );
    //     test3.mesh.parent = parent;
    //     starObjects.push(test3);


    //     let test4 = new Star("test Star name", "test Star parent", null, paletteGlow[600].mat, pieResolution, waterMaterial, scene);
    //     test4.setOptions(
    //         30,
    //         40,

    //         4,
    //         4,

    //         60,
    //         61,

    //         256,

    //         waterMaterial,

    //         0,
    //         0,
    //         0.01
    //     );
    //     test4.mesh.parent = parent;
    //     starObjects.push(test4);


    //     let test5 = new Star("test Star name", "test Star parent", null, paletteGlow[800].mat, pieResolution, waterMaterial, scene);
    //     test5.setOptions(
    //         10,
    //         11,

    //         8,
    //         8,

    //         100,
    //         100,

    //         256,

    //         waterMaterial,

    //         0.01,
    //         0,
    //         0
    //     );
    //     test5.mesh.parent = parent;
    //     starObjects.push(test5);


    //     let test6 = new Star("test Star name", "test Star parent", null, paletteGlow[1000].mat, pieResolution, waterMaterial, scene);
    //     test6.setOptions(
    //         60,
    //         70,

    //         16,
    //         16,

    //         140,
    //         141,

    //         256,

    //         waterMaterial,

    //         0,
    //         -0.005, // counter clockwise rotation
    //         0
    //     );
    //     test6.mesh.parent = parent;
    //     starObjects.push(test6);


    //     let test7 = new Star("test Star name", "test Star parent", null, paletteGlow[1200].mat, pieResolution, waterMaterial, scene);
    //     test7.setOptions(
    //         8,
    //         9,

    //         32,
    //         32,

    //         180,
    //         180,

    //         256,

    //         waterMaterial,

    //         0,
    //         0,
    //         -.01
    //     );
    //     test7.mesh.parent = parent;
    //     starObjects.push(test7);

    //     let test8 = new Star("test Star name", "test Star parent", null, paletteGlow[50].mat, pieResolution, waterMaterial, scene);
    //     test8.setOptions(
    //         10,
    //         11,

    //         64,
    //         64,

    //         240,
    //         240,

    //         256,

    //         waterMaterial,

    //         -0.01,
    //         0,
    //         0
    //     );
    //     test8.mesh.parent = parent;
    //     starObjects.push(test8);



    //     let test9 = new Star("test Star name", "test Star parent", null, paletteGlow[100].mat, pieResolution, waterMaterial, scene);
    //     test9.setOptions(
    //         0,
    //         0,

    //         128,
    //         16,

    //         280,
    //         285,

    //         256,

    //         waterMaterial,

    //         0,
    //         0.005, // clockwise rotation
    //         0
    //     );
    //     test9.mesh.parent = parent;
    //     starObjects.push(test9);


    // }

};