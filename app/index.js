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

import {
    Star
} from './Star.js';


var scene;

window.onload = function () {

    var options = {
        showBars: true,
        showTitle: true,
        showRipple: true,
        showWater: false
    }

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

    var starMaster;

    var ripple;
    var star2;
    var star4;

    var defaultGridMaterial;

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;

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
    var starObjects = [];

    scene = createScene();




    

    // let test = new Star("test Star name", "test Star parent", paletteBlue, paletteRed[100].mat, scene);
    // starObjects.push(test);
    // console.log( test.create() );






    engine.runRenderLoop(function () {

        // Scrolling index modifier for palette scrolling
        paletteScroller += .125;
        if (paletteScroller > 1529) {
            paletteScroller = 0;
        }

        analyzeData();





        // call update on all objects
        starObjects.forEach( (sObject, index) => {
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

    function render2DFrame() {

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

        camera = new BABYLON.ArcRotateCamera("camera1", 1.57, .01, 50, new BABYLON.Vector3(0, 0, 0), scene);
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





        let testOptions = {
            innerStartIndex : 0,
            outerStartIndex : 2,
    
            innerSlices : 6,
            outerSlices : 66,
            
            innerR : 3,
            outerR : 3
        }

        let test = new Star("test Star name", "test Star parent", paletteBlue, paletteGray[100].mat, scene, testOptions);
        starObjects.push(test);

        
        let test2Options = {
            innerStartIndex : 3,
            outerStartIndex : 9,
    
            innerSlices : 3,
            outerSlices : 6,
            
            innerR : 8,
            outerR : 9
        }

        let test2 = new Star("test Star name", "test Star parent", paletteBlue, paletteGray[100].mat, scene, test2Options);
        starObjects.push(test2);


        let test3Options = {
            innerStartIndex : 8,
            outerStartIndex : 6,
    
            innerSlices : 9,
            outerSlices : 18,
            
            innerR : 14,
            outerR : 14
        }

        let test3 = new Star("test Star name", "test Star parent", paletteBlue, paletteGray[100].mat, scene, test3Options);
        starObjects.push(test3);






        let test4Options = {
            innerStartIndex : 0,
            outerStartIndex : 1,
    
            innerSlices : 8,
            outerSlices : 8,
            
            innerR : 14,
            outerR : 14
        }

        let test4 = new Star("test Star name", "test Star parent", paletteBlue, paletteGray[100].mat, scene, test3Options);
        starObjects.push(test4);







        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        if (options.showRipple) createRipple();

        starMaster = new BABYLON.TransformNode("root");
        starMaster.position = new BABYLON.Vector3(95, -40, -95);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = 2;
        starMaster.scaling.z = 2;

        createStar2();
        createStar4();
    }

    function updateObjects() {

        if (options.showRipple) updateRipple();

        star2.rotation.y -= .005;
        star4.rotation.y -= .005;

        updateStar2();
        updateStar4();

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

};