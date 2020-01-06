
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
        showWater: false,
        showSky: false,
        showConsole: true,
        showWaveform: true
    }

    //////////////////////////////////////////////////////////////////////
    // start the audio

    var isSiteTrack = true;
    var isMic = false;

    var audioManager = new AudioManager();

    //////////////////////////////////////////////////////////////////////
    // start the 3D render loop

    var sceneManager = new SceneManager('#canvas3D', options, eventBus, audioManager);

    setInterval(()=> {
        sceneManager.currentManager.dispose();
        sceneManager.currentManager.create();
    }, 20000);

    //////////////////////////////////////////////////////////////////////
    // start the 2D render loop

    var overlayManager = new OverlayManager('#canvas2D', options, eventBus, audioManager, sceneManager);

    //////////////////////////////////////////////////////////////////////
    // event listeners

    $('#dl_Btn').click(function () {
        let multiplier = 10;
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(sceneManager.engine, sceneManager.scene.cameras[0], {
            width: sceneManager.canvas3D.width * multiplier,
            height: sceneManager.canvas3D.height * multiplier
        });
    });

    $('td').bind("click", function () {
        sceneManager.scene.cameras[0].target = sceneManager.cameraPositions[this.id - 1].lookat
        sceneManager.scene.cameras[0].alpha = sceneManager.cameraPositions[this.id - 1].alpha
        sceneManager.scene.cameras[0].beta = sceneManager.cameraPositions[this.id - 1].beta
        sceneManager.scene.cameras[0].radius = sceneManager.cameraPositions[this.id - 1].radius
    });

    // show playlist
    $('.pl').click(function () {
        $('.playlist').fadeIn(500);
    });

    // playlist elements - click
    $('.playlist li').click(function () {
        isSiteTrack = true;
        audioManager.siteIndex = Number($(this).attr('index'));
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

        audioManager.audio.src = URL.createObjectURL(files[0]);
        audioManager.audio.load();
    };

    audio.onended = function () {
        audioManager.siteIndex++;
        if (audioManager.siteIndex > 13) {
            audioManager.siteIndex = 1;
        }

        sceneManager.currentManager.dispose();
        sceneManager.currentManager.create();

        if (isSiteTrack) {
            let current = $('.playlist li:nth-child(' + audioManager.siteIndex + ')');
            audioManager.initAudio(current);
        }
    };

    window.addEventListener('resize', function () {
        sceneManager.engine.resize();
    });

};
