// import {
//     logToScreen
// } from './utilities.js';

import {
    EventBus
} from './EventBus.js';

import {
    AudioManager
} from './AudioManager.js';

import {
    SceneManager
} from  './SceneManager.js';

import {
    OverlayManager
} from  './OverlayManager.js';

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
        // showRipple: true,
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

    var sceneManager = new SceneManager('#canvas3D', options, eventBus, audioManager);

    var masterTransform;

    //////////////////////////////////////////////////////////////////////
    // start the 2D render loop
    //////////////////////////////////////////////////////////////////////



    var overlayManager = new OverlayManager('#canvas2D', options, eventBus, audioManager, sceneManager);

    // var canvas2D = $('#canvas2D')[0];
    // canvas2D.style.width = canvas2D.width;
    // canvas2D.style.height = canvas2D.height;
    // var ctx2D = canvas2D.getContext("2d");
    // ctx2D.globalAlpha = .5;

    // overlayManager.render2DFrame();

    // function render2DFrame() {

    //     audioManager.analyzeData();

    //     fix_dpi();

    //     if (options.showBars) {
    //         draw2DBars();
    //     }

    //     if (options.showWaveform) {
    //         drawWaveform(canvas2D, audioManager.tdDataArrayNormalized, canvas2D.width, 60);
    //     }

    //     if (options.showConsole) {
    //         renderConsoleOutput();
    //     }

    //     requestAnimationFrame(render2DFrame);
    // }

    // function drawWaveform(canvas, drawData, width, height) {
    //     let ctx = canvas.getContext('2d');
    //     let drawHeight = height / 2;

    //     ctx.lineWidth = 5;
    //     ctx.moveTo(0, drawHeight);
    //     ctx.beginPath();
    //     for (let i = 0; i < width; i++) {
    //         let minPixel = drawData[i] * .5;
    //         ctx.lineTo(i, minPixel);
    //     }

    //     ctx.strokeStyle = 'white';
    //     ctx.stroke();
    // }

    // function renderConsoleOutput() {
    //     let outputString = "<br><br><br><br><br><br>"; // = "camera pos:<br>"+scene.activeCamera.position + "<br>";
    //     outputString += "&nbsp alpha: <br> &nbsp " + Math.round(sceneManager.scene.activeCamera.alpha * 1000) / 1000 + "<br><br>";
    //     outputString += "&nbsp beta:  <br> &nbsp " + Math.round(sceneManager.scene.activeCamera.beta * 1000) / 1000 + "<br><br>";
    //     outputString += "&nbsp radius:<br> &nbsp " + Math.round(sceneManager.scene.activeCamera.radius * 1000) / 1000 + "<br><br>";
    //     outputString += "&nbsp site index:<br> &nbsp " + siteIndex + "<br><br>";
    //     logToScreen(outputString);
    // }

    // function draw2DBars() {
    //     let WIDTH = canvas2D.width;
    //     let HEIGHT = canvas2D.height;
    //     let barWidth = (WIDTH / (audioManager.frDataLength));

    //     ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

    //     let x = 0;

    //     for (var i = 0; i < audioManager.frBufferLength; i++) {
    //         let barHeight = audioManager.frDataArray[i] * 1 + 1;

    //         var r = barHeight + (55.52 * (i / audioManager.frDataLength));
    //         var g = 255 * (55 * i / audioManager.frDataLength);
    //         var b = 255;

    //         ctx2D.fillStyle = "rgba(" + r + "," + g + "," + b + ",.7)";
    //         ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    //         x += barWidth + 1;
    //     }
    // }

    // function fix_dpi() {
    //     //create a style object that returns width and height
    //     var dpi = window.devicePixelRatio;

    //     let style = {
    //         height() {
    //             return +getComputedStyle(canvas2D).getPropertyValue('height').slice(0, -2);
    //         },
    //         width() {
    //             return +getComputedStyle(canvas2D).getPropertyValue('width').slice(0, -2);
    //         }
    //     }
    //     //set the correct attributes for a crystal clear image!
    //     canvas2D.setAttribute('width', style.width() * dpi);
    //     canvas2D.setAttribute('height', style.height() * dpi);
    // }

    //////////////////////////////////////////////////////////////////////
    // event listeners
    //////////////////////////////////////////////////////////////////////

    $('#dl_Btn').click(function () {
        let multiplier = 10;
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(sceneManager.engine, sceneManager.scene.cameras[0], {
            width: canvas3D.width * multiplier,
            height: canvas3D.height * multiplier
        });
    });

    $('td').bind("click", function () {
        sceneManager.scene.cameras[0].target = sceneManager.cameraPositions[this.id - 1].lookat
        sceneManager.scene.cameras[0].alpha = sceneManager.cameraPositions[this.id - 1].alpha
        sceneManager.scene.cameras[0].beta = sceneManager.cameraPositions[this.id - 1].beta
        sceneManager.scene.cameras[0].radius = sceneManager.cameraPositions[this.id - 1].radius
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
        sceneManager.engine.resize();
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