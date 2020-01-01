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
        showTitle: false,
        showRipple: true,
        showWater: false,
        showSky: false
    }

    // var meshDimensions = 256;

    //////////////////////////////
    // AUDIO variables


    // var file;
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
    tdAnalyser.fftSize = 4096;
    tdAnalyser.smoothingTimeConstant = 0.9;
    var tdBufferLength = tdAnalyser.frequencyBinCount;
    var tdDataLength = tdBufferLength - 64;
    var tdDataArray = new Uint8Array(tdBufferLength);
    var tdDataArrayNormalized = new Uint8Array(frBufferLength);

    var tdHistory = [];
    let arraySize = 4096;
    tdHistory = Array(arraySize).fill(0);

    audioSrc.connect(frAnalyser);
    frAnalyser.connect(tdAnalyser);
    tdAnalyser.connect(audioCtx.destination);

    var tdPoints = [];
    var tdSoundWave;

    function initAudio(elem) {
        // console.log(elem)
        var url = elem.attr('audiourl');

        audio.src = "app/assets/tracks/"+url;
        audio.load();

        $('.playlist li').removeClass('active');
        elem.addClass('active');
    }

    // show playlist
    $('.pl').click(function (e) {
        // e.preventDefault();
        $('.playlist').fadeIn(500);
    });
    
    // playlist elements - click
    $('.playlist li').click(function () {
        isSiteTrack = true;
        siteIndex = Number( $(this).attr('index'));
        initAudio($(this));
        // console.log(this);
        $('.playlist').fadeOut(500);
    });
    
    
    // var list = document.querySelectorAll(".playlist li");
    // this.console.log(list);
    
    var siteIndex = Math.round( Math.random()*47)+1;
    var isSiteTrack = true;
    
    // initAudio($('.playlist li:first-child'));
    // let current = $('.playlist li:nth-child('+siteIndex+')');

    initAudio($('.playlist li:nth-child('+siteIndex+')'));
    


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


    var defaultGridMaterial;

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;
    var waterMaterial

    var camera;

    var cameraPosition = [{
            lookat: new BABYLON.Vector3(200, 0, -200),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 300
        },
        {
            lookat: new BABYLON.Vector3(-200, 0, -200),
            alpha: Math.PI / 2,
            beta: .01,
            radius: 300
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
            radius: 300
        },
        {
            lookat: new BABYLON.Vector3(-200, 0, 200),
            alpha: Math.PI / 2,
            beta: 0.01,
            radius: 300
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


    // local file selection that is hidden
    fileInput.onchange = function () {
        var files = this.files;
        

       console.log(files[0])
        isSiteTrack = false;

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    };

    // custom button that calls click on hidden fileInput element
    $('.local_Btn').bind("click", function () {
        $('#fileInput').click();
    });

    audio.onended = function() {
        siteIndex++;
        if (siteIndex > 48) {
            siteIndex = 1;
        }

        if (isSiteTrack){
            let current = $('.playlist li:nth-child('+siteIndex+')');

            initAudio(current);
        }


    };

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

        // normalize the data   0..1
        tdDataArrayNormalized = normalizeData(tdDataArray);

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

        drawWaveform(canvas2D, tdDataArrayNormalized, canvas2D.width, 60)

        renderConsoleOutput();

        requestAnimationFrame(render2DFrame);
    }

    function drawWaveform(canvas, drawData, width, height) {
        let ctx = canvas.getContext('2d');
        let drawHeight = height / 2;

        ctx.lineWidth = 5;
        ctx.moveTo(0, drawHeight);
        ctx.beginPath();
        for(let i = 0; i < width; i++) {
           let minPixel = drawData[i]*.5 ;
           ctx.lineTo(i, minPixel);
        }

        ctx.strokeStyle = 'white';

        ctx.stroke(); 
     } 

    function renderConsoleOutput(){
        let outputString = "<br><br><br><br><br><br>"; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
        outputString += "&nbsp alpha: <br> &nbsp " + Math.round( scene.activeCamera.alpha *1000)/1000+ "<br><br>";
        outputString += "&nbsp beta:  <br> &nbsp " + Math.round( scene.activeCamera.beta *1000)/1000+ "<br><br>";
        outputString += "&nbsp radius:<br> &nbsp " + Math.round( scene.activeCamera.radius *1000)/1000+ "<br><br>";
        outputString += "&nbsp site index:<br> &nbsp " + siteIndex + "<br><br>";
        logToScreen(outputString);
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
            waterMesh.position.y = -80;
        }

        buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, paletteMetallic, scene);

        camera = new BABYLON.ArcRotateCamera("camera1", 1.57, .01, 930, new BABYLON.Vector3(0, 0, 0), scene);
        camera.upperRadiusLimit = 9400;
        camera.lowerRadiusLimit = 10;
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

    var masterTransform;

    var starMaster1;
    var starMaster2;
    var starMaster3;
    var starMaster4;
    var starMaster5;
    var starMaster6;
    var starMaster7;

    function createObjects() {

        masterTransform = new BABYLON.TransformNode("root");
        // masterTransform.position = new BABYLON.Vector3(0, 0, 0);
        
        starMaster1 = new BABYLON.TransformNode("starMaster1");
        
        createStarGroup1();
        
        starMaster1.position = new BABYLON.Vector3(0, 0, 0);
        starMaster1.parent = masterTransform;
        starMaster1.scaling.x = .1;
        starMaster1.scaling.y = .1;
        starMaster1.scaling.z = .1;

        starMaster2 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom2();

        starMaster2.position = new BABYLON.Vector3(200, 0, -200);
        starMaster2.parent = masterTransform;
        starMaster2.scaling.x = .2;
        starMaster2.scaling.y = .2;
        starMaster2.scaling.z = .2;
        starMaster2.rotation.y = Math.PI/2;
        
        starMaster3 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom3();

        starMaster3.position = new BABYLON.Vector3(-200, 0, -200);
        starMaster3.parent = masterTransform;
        starMaster3.scaling.x = .2;
        starMaster3.scaling.y = .2;
        starMaster3.scaling.z = .2;
        starMaster3.rotation.y = Math.PI/2;

        starMaster4 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom4();

        starMaster4.position = new BABYLON.Vector3(200, 0, 200);
        starMaster4.parent = masterTransform;
        starMaster4.scaling.x = .3;
        starMaster4.scaling.y = .3;
        starMaster4.scaling.z = .3;
        starMaster4.rotation.y = Math.PI/2;

        starMaster5 = new BABYLON.TransformNode("starMaster2");

        createStarGroupRandom5();

        starMaster5.position = new BABYLON.Vector3(-200, 0, 200);
        starMaster5.parent = masterTransform;
        starMaster5.scaling.x = .3;
        starMaster5.scaling.y = .3;
        starMaster5.scaling.z = .3;
        starMaster5.rotation.y = Math.PI/2;
    }

    function updateObjects() {



        // starMaster1.rotation.x += .01;
        // starMaster1.rotation.z += .004;
        // starMaster1.rotation.y -= .008;

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
        test.mesh.parent = starMaster1;
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
        test2.mesh.parent = starMaster1;
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
        test3.mesh.parent = starMaster1;
        starObjects.push(test3);


        let test4 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[600].mat, pieResolution, waterMaterial, scene);
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
        test4.mesh.parent = starMaster1;
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
        test5.mesh.parent = starMaster1;
        starObjects.push(test5);


        let test6 = new Star("test Star name", "test Star parent", paletteBlue, paletteGlow[1000].mat, pieResolution, waterMaterial, scene);
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
            -0.005,  // counter clockwise rotation
            0
        );
        test6.mesh.parent = starMaster1;
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
        test7.mesh.parent = starMaster1;
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
        test8.mesh.parent = starMaster1;
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
        test9.mesh.parent = starMaster1;
        starObjects.push(test9);
    
    
    }

    function createStarGroupRandom2() {

        // console.log("creating star objects");

        for (let index = 0; index < 9; index++) {
            
            let test = new Star("Random Star +index", "test Star parent", paletteBlue, palette[Math.round( Math.random()*1529)].mat, pieResolution, waterMaterial, scene);
            let rad = 20*index+10;
            test.setOptions(
                Math.round(Math.random()*20),
                Math.round(Math.random()*20),
    
                Math.pow(2,Math.round( Math.random()*6)),
                Math.pow(2,Math.round( Math.random()*6)),
    
                rad,
                rad + Math.round(Math.random()*6)-3,
    
                256,
    
                waterMaterial,
    
                0,
                0,
                0
            );
            test.mesh.parent = starMaster2;
            starObjects.push(test);
        }
    }

    function createStarGroupRandom3() {

        // console.log("creating star objects");

        for (let index = 0; index < 9; index++) {
            
            let test = new Star("Random Star +index", "test Star parent", paletteBlue, palette[Math.round( Math.random()*1529)].mat, pieResolution, waterMaterial, scene);
            let rad = 20*index+10;
            let i = Math.round(Math.random()*10)
            test.setOptions(
                i,
                i+Math.round(Math.random()*2+1),
    
                Math.pow(2,Math.round( Math.random()*6)+1),
                Math.pow(2,Math.round( Math.random()*6)+1),
    
                rad,
                rad,
    
                256,
    
                waterMaterial,
    
                0,
                0,
                0
            );
            test.mesh.parent = starMaster3;
            starObjects.push(test);
        }
    }

    // setOptions(
    //     p_innerStartIndex, 
    //     p_outerStartIndex, 
        
    //     p_innerSlices, 
    //     p_outerSlices, 
        
    //     p_innerRadius, 
    //     p_outerRadius, 
        
    //     p_resolution, 
        
    //     p_reflect, 
        
    //     p_xRotation, 
    //     p_yRotation, 
    //     p_zRotation
    // ) 


    function createStarGroupRandom4() {

        for (let index = 0; index < 9; index++) {
            
            let test = new Star("Random Star +index", "test Star parent", paletteBlue, palette[Math.round( Math.random()*1529)].mat, pieResolution, waterMaterial, scene);
            let rad = 5*index+50;
            let i = Math.round(Math.random()*10)
            test.setOptions(
                i,
                i*i,
    
                Math.pow(2,Math.round( Math.random()*1)+2),
                Math.pow(2,Math.round( Math.random()*1)+4),
    
                rad,
                rad,
    
                256,
    
                waterMaterial,
    
                0,
                0,
                0
            );
            test.mesh.parent = starMaster4;
            starObjects.push(test);
        }
    }


    function createStarGroupRandom5() {

        for (let index = 0; index < 9; index++) {
            
            let test = new Star("Random Star +index", "test Star parent", paletteBlue, palette[Math.round( Math.random()*1529)].mat, pieResolution, waterMaterial, scene);
            let rad = 5*index+50;
            let i = Math.round(Math.random()*10);
            let s = Math.pow(2,Math.round( Math.random()*1));
            test.setOptions(
                i,
                i+1,
    
                s,
                s,
    
                rad,
                rad+5*i,
    
                256,
    
                waterMaterial,
    
                0,
                0,
                0
            );
            test.mesh.parent = starMaster5;
            starObjects.push(test);
        }
    }


};