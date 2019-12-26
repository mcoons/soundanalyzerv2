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
//      c) Allow saving optins and playlist to local storage for ease of use
//
// 2) Add microphone support
//
// 3) Add external player support (grab the audio from anywhere)
//
// 4) Add error checking for everything
//
// 5) Add Options popup
//      a) Which objects to display
//      b) Palette selection or creation
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
// 
//
//
//
//

import {
    addToGlowPalette,
    addToPalette,
    buildPalettes,
    map,
    logToScreen
} from './utilities.js';

var scene;

window.onload = function () {

    var showDancers = true;
    var showInnerSnowflake = true;
    var showOuterSnowflake = true;
    var showFrame = true;
    var showBars = true;
    var showTitle = true;
    var showFloor = false;
    var showRibbon = true;

    var camera;

    var title = document.getElementById("title");
    var console = document.getElementById("console");

    //////////////////////////////
    // 2D canvas variables
    var canvas2D = document.getElementById("canvas2D");
    canvas2D.style.width = canvas2D.width;
    canvas2D.style.height = canvas2D.height;
    var ctx2D = canvas2D.getContext("2d");
    ctx2D.globalAlpha = .5;
    var WIDTH = canvas2D.width;
    var HEIGHT = canvas2D.height;

    //////////////////////////////
    // audio variables
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);

    var frAnalyser = audioCtx.createAnalyser();
    frAnalyser.fftSize = 512;
    frAnalyser.smoothingTimeConstant = 0.9;
    var frBufferLength = frAnalyser.frequencyBinCount;
    var frDataLength = frBufferLength - 64;
    var frDataArray = new Uint8Array(frBufferLength);
    var barWidth = (WIDTH / frDataLength) - 3;
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

    $('.new_Btn').bind("click", function () {
        $('#thefile').click();
    });

    //////////////////////////////
    // create the audio connection to the music file
    // start the 2D render loop
    // start the data analysis in this loop
    file.onchange = function () {
        var files = this.files;
        // console.log(files);

        if (showTitle) {
            title.innerHTML = files[0].name;
        }

        audio.src = URL.createObjectURL(files[0]);
        audio.load();

        var barHeight;
        var x = 0;

        var dpi = window.devicePixelRatio;

        function fix_dpi() {
            //create a style object that returns width and height
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

        function render2DFrame() {
            requestAnimationFrame(render2DFrame);

            x = 0;

            frAnalyser.getByteFrequencyData(frDataArray);
            frCurrentHigh = 0;
            frCurrentLow = 255;
            frDataArray.forEach(f=>{
                if (f > frCurrentHigh) frCurrentHigh = f;
                if (f < frCurrentLow) frCurrentLow = f;
            });

            tdAnalyser.getByteTimeDomainData(tdDataArray);
            let highest = 0;
            tdDataArray.forEach(d => {
                if (d > highest) highest = d;
            });
            tdHistory.push(highest);
            if (tdHistory.length > arraySize) tdHistory.shift();
            // console.log(tdHistory.length);



            // scene.

            fix_dpi();

            if (showBars) {
                WIDTH = canvas2D.width;
                HEIGHT = canvas2D.height;

                barWidth = (WIDTH / frDataLength) - 3;

                ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

                let textColor;

                for (var i = 0; i < frBufferLength - 20; i++) {
                    barHeight = frDataArray[i] * 1 + 3;

                    var r = barHeight + (.22 * (i / frDataLength));
                    var g = 250 * (i / frDataLength);
                    var b = 250;

                    if (i == 20) textColor = "rgb(" + r + "," + g + "," + b + ")";

                    ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
                    ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    x += barWidth + 3;
                }
                if (showTitle) {
                    title.style.color = textColor;
                }
            }
        }

        render2DFrame();
    };

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

    var helixPath = [];
    var helixMaster;

    var palette = [];
    var paletteGlow = [];
    var paletteGray = [];
    var paletteRed = [];
    var paletteGreen = [];
    var paletteBlue = [];
    var paletteMetallic = [];
    var paletteScroller = 0;

    var frameMaterial;
    var ribbon;

    var canvas3D = document.getElementById('canvas3D');
    var engine = new BABYLON.Engine(canvas3D, true);
    var glowLayer;
    var highlightLayer;

    // call the 3D createScene function
    scene = createScene();

    //////////////////////////////
    // starts the 3D render loop
    engine.runRenderLoop(function () {
        paletteScroller += .125;
        if (paletteScroller > 1529) {
            paletteScroller = 0;
        }

        if (showDancers) updateDancers();
        if (showInnerSnowflake) updateInnerSnowflake();
        if (showOuterSnowflake) updateOuterSnowflake();
        if (showFrame) updateFrame();
        if (showFloor) updateFloor();
        if (showRibbon) updateRibbon();

        // ribbonMaster.rotation.y -= .01;

        let outputString = ""; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
        outputString += "alpha: <br>" + scene.activeCamera.alpha + "<br>";
        outputString += "beta:  <br>" + scene.activeCamera.beta + "<br>";
        outputString += "radius:<br>" + scene.activeCamera.radius + "<br>";

        // logToScreen(outputString);

        // masterTransform.rotation.x += .0051;
        // masterTransform.rotation.y -= .0051;
        // masterTransform.rotation.z -= .0051;

        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });

    // function to create the 3D scene
    function createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);

        glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.intensity = .55;

        // highlightLayer = new BABYLON.HighlightLayer("hl1", scene);

        buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, paletteBlue, paletteGray, scene);

        frameMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        // frameMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        // frameMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        // frameMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // frameMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

        // frameMaterial.diffuseTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
        // frameMaterial.specularTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
        // frameMaterial.emissiveTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
        // frameMaterial.ambientTexture = new BABYLON.Texture("PATH TO IMAGE", scene);


        var stoneDiffURL = "http://i.imgur.com/VSbN3Fc.png";
        var stoneNHURL = "http://i.imgur.com/zVGaZNi.png";

        var stoneDiffuseTexture = new BABYLON.Texture(stoneDiffURL, scene);
        var stoneNormalsHeightTexture = new BABYLON.Texture(stoneNHURL, scene);
        var normalsHeightTexture = stoneNormalsHeightTexture;

        frameMaterial.diffuseTexture = stoneDiffuseTexture;
        frameMaterial.bumpTexture = stoneNormalsHeightTexture;
        frameMaterial.useParallax = true;
        frameMaterial.useParallaxOcclusion = true;
        frameMaterial.parallaxScaleBias = 0.1;
        frameMaterial.specularPower = 1000.0;
        frameMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);


        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        // let camera = new BABYLON.ArcRotateCamera("camera1", 3 * Math.PI / 2, Math.PI / 3, 220, new BABYLON.Vector3(0, 0, 64), scene);
        camera = new BABYLON.ArcRotateCamera("camera1", 0, Math.PI / 2, 220, new BABYLON.Vector3(0, 0, 0), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas3D
        camera.attachControl(canvas3D, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);
        light.intensity = 1.6;
        // light.groundColor = paletteBlue[255].color;

        var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(20, 20, -10), scene);
        pointLight1.intensity = 1.2;

        var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, -80, 0), scene);
        pointLight2.intensity = 1.2;

        var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 80, 0), scene);
        pointLight3.intensity = .8;

        var pointLight4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(40, 580, -180), scene);
        pointLight4.intensity = 1.0;

        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        if (showDancers) createDancers();
        if (showInnerSnowflake) createInnerSnowflake();
        if (showFrame) createFrame();
        if (showOuterSnowflake) createOuterSnowflake()
        if (showFloor) createFloor();
        if (showRibbon) createRibbon();

        createBillboard();

        // createSinglePathRibbon();


        return scene;
    }

    // functions to create/remove all the 3D items

    function createDancers() {
        //create a Center of Transformation
        dancersMaster = new BABYLON.TransformNode("root");
        dancersMaster.position = new BABYLON.Vector3(0, 0, 0);
        dancersMaster.parent = masterTransform;

        let width = 4.5;
        let depth = 4.5;
        let radius = 60;
        for (let theta = 0; theta < 2 * Math.PI - Math.PI / 36; theta += Math.PI / 15) {

            // let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
            //     width: width,
            //     depth: depth
            // }, scene);

            let thing = BABYLON.MeshBuilder.CreateCylinder("cylinder1", {
                height: 1,
                diameterTop: 8.45,
                diameterBottom: 8.45,
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
            // object.scaling.y = (soundData.frBuffer[index] + 140) * .2;
            let y = frDataArray[index] * .15 + .25;
            object.scaling.y = y;
            object.position.y = y / 2;
            object.material = palette[Math.round(map(frDataArray[index] || 0, 0, 255, 0, 1529))].mat;
        });

    }

    function createInnerSnowflake() {
        innerSnowflakeMaster = new BABYLON.TransformNode("root");
        innerSnowflakeMaster.position = new BABYLON.Vector3(0, -15, 0);
        innerSnowflakeMaster.parent = masterTransform;

        let width = 2.0;
        let depth = 2.0;
        let height = 4;
        let radius = 40.1;
        // let count = 0;

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

            // thing.material = palette[128].mat;
            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            // thing.position.y = -50;
            thing.rotation.y = -theta;
            innerSnowflakeObjects.push(thing);

            // count++;

            // console.log(dataIndex);
            dataIndex += direction;
        }
        // innerSnowflakeMaster.rotation.x = Math.PI / 2;
        // console.log("count:", count)
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

            let y = frDataArray[dataIndex + 25] * frDataArray[dataIndex + 25] * .0012;
            object.scaling.x = y;
            // object.scaling.y = .5 + dataIndex / 8;

            let theta = Math.PI / (itemsDesired / 4) * index;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);
            object.material = palette[Math.round(map(((1529 - paletteScroller) + (y * 1)) % 255 || 0, 0, 255, 128, 1529))].mat;
            // object.material = paletteRed[Math.round(map((y * 1.5) % 255 || 0, 0, 255, 255, 128))].mat;

            dataIndex += direction;
        });
    }

    function createOuterSnowflake() {
        outerSnowflakeMaster = new BABYLON.TransformNode("root");
        outerSnowflakeMaster.position = new BABYLON.Vector3(0, -15, 0);
        outerSnowflakeMaster.parent = masterTransform;

        let width = 1;
        let depth = 1.5;
        let height = 1;
        let diameterTop = 2;
        var diameterBottom = 6;
        let radius = 60;
        // let count = 0;

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
        // innerSnowflakeMaster.rotation.x = Math.PI / 2;
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

            // let y = frDataArray[dataIndex + 25] * .25 + .01;
            let y = frDataArray[dataIndex + 25] * frDataArray[dataIndex + 25] * .0013;
            object.scaling.y = y;
            // object.scaling.x = .5 + dataIndex / 8;

            let theta = Math.PI / (itemsDesired / 4) * index;
            object.position.x = (radius + y / 2) * Math.cos(theta);
            object.position.z = (radius + y / 2) * Math.sin(theta);
            object.material = palette[Math.round(map((paletteScroller + (y * 1)) % 255 || 0, 0, 255, 128, 1529))].mat;
            // object.material = paletteRed[Math.round(map((y * 1.5) % 255 || 0, 0, 255, 255, 128))].mat;

            dataIndex += direction;
        });
    }

    function createFrame() {
        frameMaster = new BABYLON.TransformNode("root");
        frameMaster.position = new BABYLON.Vector3(0, -40, 0);
        frameMaster.parent = masterTransform;

        let width = 30;
        let depth = 30;
        let spacing = 12;
        let frameWidth = spacing / 2;
        let frameLength = width + spacing;
        let frameHeight = 12;
        let frameColorIndex = 50;

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
            back.material = paletteGray[materialIndex].mat;



            let front = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength,
                height: frameHeight
            }, scene);

            front.position = new BABYLON.Vector3(x - (width / 2 + frameWidth / 2), y, z);
            front.material = paletteGray[materialIndex].mat;





            let left = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength - 2 * frameWidth,
                height: frameHeight
            }, scene);

            left.position = new BABYLON.Vector3(x, y, z + (width / 2 + frameWidth / 2));
            left.rotation.y = Math.PI / 2;
            left.material = paletteGray[materialIndex].mat;


            let right = BABYLON.MeshBuilder.CreateBox(("box"), {
                width: frameWidth,
                depth: frameLength - 2 * frameWidth,
                height: frameHeight
            }, scene);

            right.position = new BABYLON.Vector3(x, y, z - (width / 2 + frameWidth / 2));
            right.rotation.y = Math.PI / 2;
            right.material = paletteGray[materialIndex].mat;
        }


    }

    function updateFrame() {
        frameObjects.forEach((o, i) => {
            let y = frDataArray[i] / 35 + .1;
            o.scaling.y = y;
            o.position.y = -40 + y / 2;
            o.material = paletteGlow[Math.round(map((frDataArray[(i + 5) % 9] * 1.3) % 128 || 0, 0, 128, 0, 900))].mat;
        });
    }

    function createFloor() {
        floorMaster = new BABYLON.TransformNode("root");
        floorMaster.position = new BABYLON.Vector3(0, -40, 0);
        floorMaster.parent = masterTransform;

        let width = 10;
        let depth = 10;
        let spacing = 8;
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

                let px = x * (width + spacing) - 3.5 * (width + spacing);
                let py = -40;
                let pz = z * (depth + spacing) - 3.5 * (depth + spacing);

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
            let y = frDataArray[i] / 35 + .1;
            o.scaling.y = y;
            o.position.y = -40 + y / 2;
            o.material = paletteGlow[Math.round(map((frDataArray[(i * 2)] * 2) % 255, 0, 255, 0, 1529))].mat;
        });
    }

    function createSinglePathRibbon() {
        ribbonMaster = new BABYLON.TransformNode("root");
        ribbonMaster.position = new BABYLON.Vector3(0, 5, 0);
        ribbonMaster.parent = masterTransform;

        // mat.wireframe = true;

        var heightScale = .3;
        var vertexColors = [];


        for (var i = 0; i < frBufferLength; i++) {
            // var deltaTheta = flatness * Math.PI * i / frBufferLength;  // per
            var deltaTheta = 3 * Math.PI * i / 60; // per
            helixPath.push(new BABYLON.Vector3(30 * Math.cos(deltaTheta), i * heightScale, 30 * Math.sin(deltaTheta)));

            console.log(Math.round(map(i, 0, 512, 0, 1529)));
            console.log(palette[Math.round(map(i, 0, 512, 0, 1529))].color)
            vertexColors.push(palette[i * 5].color);
            vertexColors.push(palette[1529 - i * 5].color);

        }



        // Show single path
        var lines = BABYLON.MeshBuilder.CreateLines("helixLines", {
            points: helixPath,
            colors: vertexColors

        }, scene);

        lines.parent = ribbonMaster;


        //Create the Ribbon around the single path
        var helix = BABYLON.MeshBuilder.CreateRibbon("helix", {
            pathArray: [helixPath],
            updatable: true,
            offset: 30,
            colors: vertexColors,
            sideOrientation: 1
        }, scene);

        helix.parent = ribbonMaster;

        // helix.material = paletteBlue[255].mat;
    }


    function createRibbon() {
        var paths = [];
        var sideO = BABYLON.Mesh.BACKSIDE;

        for (let r = 0; r < 128; r++) {
            let path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 8) {

                let x = .4 * r * Math.cos(theta);
                let z = .4 * r * Math.sin(theta);
                let y = Math.sin(r / 5);

                path.push(new BABYLON.Vector3(x, y, z));
            }
            //   var lines = BABYLON.Mesh.CreateLines("par", path, scene);
            paths.push(path);

        }

        // var ribbon = BABYLON.Mesh.CreateRibbon("rib", paths, false, true, 0, scene);
        ribbon = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, true, 0, scene, true, sideO);

        ribbon.material = paletteGray[50].mat;
    }

    function updateRibbon() {
        var paths = [];
        var vertexColors = [];
        var sideO = BABYLON.Mesh.BACKSIDE;
        var myColors = [];

        for (let r = 0; r < 128; r++) {
            var path = [];
            for (let theta = 0; theta <= 2 * Math.PI; theta += Math.PI / 8) {

                let x = .4 * r * Math.cos(theta);
                let z = .4 * r * Math.sin(theta);
                let y = frDataArray[r] / 18; // + 20.1;

                path.push(new BABYLON.Vector3(x, y, z));
                myColors.push(new BABYLON.Color4(.5,.5,.5,.5));
                myColors.push(new BABYLON.Color4(.5,.5,.5,.5));
            }

            // var lines = BABYLON.Mesh.CreateLines("par", path, scene);
            paths.push(path);
        };


        logToScreen(paths.length + "<br>" +paths[0][0] + "<br>" + myColors[0] + "<br>");

        ribbon = BABYLON.MeshBuilder.CreateRibbon(null, {pathArray: paths, instance: ribbon, myColors: myColors, sideOrientation:1});
        // ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {
        //     pathArray: paths,
        //     instance: ribbon,
        //     colors: myColors,
        //     sideOrientation: 1
        // });
    }

    function createBillboard() {
        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture("app/assets/images/img.jpg", scene);

        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false; //Allways show the front and the back of an element

        //Creation of a plane
        var plane = BABYLON.Mesh.CreatePlane("plane", 120, scene);
        // plane.rotation.x = Math.PI / 2;
        plane.position.z = 220;
        plane.material = materialPlane;
    }

};