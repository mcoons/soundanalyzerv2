import {
    logToScreen
} from './utilities.js';

import {
    EventBus
} from './EventBus.js';

import {
    AudioManager
} from './AudioManager.js';

import {
    StarManager
} from './StarManager.js';

import {
    Clock
} from './objects/Clock.js';


window.onload = function () {

    var eventBus = new EventBus();
    eventBus.subscribe("eventTest", eventTestCallback);

    function eventTestCallback() {
        console.log("Event Received");
    }
    eventBus.post("eventTest");

    var options = {
        showBars: true,
        showTitle: false,
        showRipple: true,
        showWater: false,
        showSky: false,
        showConsole: true,
        showWaveform: true
    }

    //////////////////////////////////////////////////////////////////////
    // start the audio
    //////////////////////////////////////////////////////////////////////

    var siteIndex = Math.round(Math.random() * 12) + 1;
    var isSiteTrack = true;
    var isMic = false;
    var audioManager = new AudioManager();
    audioManager.initAudio($('.playlist li:nth-child(' + siteIndex + ')'));

    //////////////////////////////////////////////////////////////////////
    // start the 3D render loop
    //////////////////////////////////////////////////////////////////////

    var canvas3D = $('#canvas3D')[0];
    var engine = new BABYLON.Engine(canvas3D, true, {
        preserveDrawingBuffer: true,
        stencil: true
    });
    var glowLayer;
    var waterMaterial
    var defaultGridMaterial;
    var camera;
    var scene = createScene();
    var starManager = new StarManager(scene, eventBus, audioManager);
    var clock = new Clock(scene);
    var cameraPosition = [{
            lookat: new BABYLON.Vector3(-200, 0, 200),
            alpha: -Math.PI / 2,
            beta: 0.01,
            radius: 115
        },
        {
            lookat: new BABYLON.Vector3(200, 0, 200),
            alpha: -Math.PI / 2,
            beta: 0.01,
            radius: 115
        },
        {
            lookat: new BABYLON.Vector3(0, 0, 0),
            alpha: 4.711,
            beta: 1.096,
            radius: 831
        },
        {
            lookat: new BABYLON.Vector3(-200, 0, -200),
            alpha: -Math.PI / 2,
            beta: .01,
            radius: 115
        },
        {
            lookat: new BABYLON.Vector3(200, 0, -200),
            alpha: -Math.PI / 2,
            beta: 0.01,
            radius: 115
        },
    ];
    var masterTransform;

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

        camera = new BABYLON.ArcRotateCamera("camera1", 4.7, 1.1, 815, new BABYLON.Vector3(0, 0, 0), scene);
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


        let starMaster;
        masterTransform = new BABYLON.TransformNode("root");
        masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        // starMaster1 = new BABYLON.TransformNode("starMaster1");

        // createStarGroup1(starMaster1);

        // starMaster1.position = new BABYLON.Vector3(400, 0, 0);
        // starMaster1.parent = masterTransform;
        // starMaster1.scaling.x = .1;
        // starMaster1.scaling.y = .1;
        // starMaster1.scaling.z = .1;

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom2({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(200, 0, -200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom3({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-200, 0, -200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom4({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(200, 0, 200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom5({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-200, 0, 200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom6({
            r: .45,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(0, 0, 0);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom2({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(400, 0, -200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom3({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-400, 0, -200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom4({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(400, 0, 200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom5({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 1,
            y: 0,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-400, 0, 200);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        starManager.createStarGroupRandom6({
            r: .45,
            g: .45,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(0, 200, 0);
        starMaster.parent = masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        starMaster.rotation.y = Math.PI / 2;

        starManager.starMasters.push(starMaster);

        // drawRandomStars();
        eventBus.post("eventTest", 'argument');
    }

    function updateObjects() {
        starManager.update();
    }

    //////////////////////////////////////////////////////////////////////
    // start the 2D render loop
    //////////////////////////////////////////////////////////////////////

    var canvas2D = $('#canvas2D')[0];
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

        if (options.showWaveform){
            drawWaveform(canvas2D, audioManager.tdDataArrayNormalized, canvas2D.width, 60);
        }

        if (options.showConsole){
            renderConsoleOutput();
        }

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
    //////////////////////////////////////////////////////////////////////

    $('#dl_Btn').click(function () {
        let multiplier = 10;
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, scene.cameras[0], {
            width: canvas3D.width * multiplier,
            height: canvas3D.height * multiplier
        });
    });

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
        if (siteIndex > 13) {
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

};


/*


$( "a" ).attr( "href", "allMyHrefsAreTheSameNow.html" );


$( "a" ).attr({

    title: "all titles are the same too!",

    href: "somethingNew.html"

});

 

// Testing whether a selection contains elements.
if ( $( "div.foo" ).length ) {
    let a = 1;
}
 

// Refining selections.
$( "div.foo" ).has( "p" );         // div.foo elements that contain <p> tags
$( "h1" ).not( ".bar" );           // h1 elements that don't have a class of bar
$( "ul li" ).filter( ".current" ); // unordered list items with class of current
$( "ul li" ).first();              // just the first unordered list item
$( "ul li" ).eq( 5 );              // the sixth
 

 

$( "input:file" ) 

 

// Setting CSS properties.
 
$( "h1" ).css( "fontSize", "100px" ); // Setting an individual property.
 
// Setting multiple properties.
$( "h1" ).css({
    fontSize: "100px",
    color: "red"
});
 

// Working with classes.
 
var h1 = $( "h1" );
 
h1.addClass( "big" );
h1.removeClass( "big" );
h1.toggleClass( "big" );
 
if ( h1.hasClass( "big" ) ) {
    let a = 1;
}
 

// Basic dimensions methods.
 
// Sets the width of all <h1> elements.
$( "h1" ).width( "50px" );
 
// Gets the width of the first <h1> element.
$( "h1" ).width();
 
// Sets the height of all <h1> elements.
$( "h1" ).height( "50px" );
 
// Gets the height of the first <h1> element.
$( "h1" ).height();
 
 
// Returns an object containing position information for
// the first <h1> relative to its "offset (positioned) parent".
$( "h1" ).position();
 

// Storing and retrieving data related to an element.
 
$( "#myDiv" ).data( "keyName", { foo: "bar" } );
 
$( "#myDiv" ).data( "keyName" ); // Returns { foo: "bar" }
 */