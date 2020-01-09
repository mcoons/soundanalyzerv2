import {
    EventBus
} from './EventBus.js';

import {
    AudioManager
} from './AudioManager.js';

import {
    SceneManager
} from './SceneManager.js';

import {
    OverlayManager
} from './OverlayManager.js';

window.onload = function () {

    var options = {
        showBars: false,
        showTitle: true,
        showWater: false,
        showSky: false,
        showConsole: false,
        showWaveform: false
    }

    //////////////////////////////////////////////////////////////////////
    // start the Event Bus (event handler)

    var eventBus = new EventBus();

    // event bus test
    eventBus.subscribe("eventTest", eventTestCallback);
    function eventTestCallback() {
        console.log("Initial Event Received");
    }
    eventBus.post("eventTest");
    eventBus.unsubscribe("eventTest", eventTestCallback);

    //////////////////////////////////////////////////////////////////////
    // start the Audio Manager (audio loop)

    var audioManager = new AudioManager();

    //////////////////////////////////////////////////////////////////////
    // start the Sene Manager (3D render loop)

    var sceneManager = new SceneManager('#canvas3D', options, eventBus, audioManager);

    //////////////////////////////////////////////////////////////////////
    // start the Overlay Manager (2D render loop)

    var overlayManager = new OverlayManager('#canvas2D', options, eventBus, audioManager, sceneManager);
    
    //////////////////////////////////////////////////////////////////////
    // event listeners

    $('#options_Btn').click(function () {
        sceneManager.currentManager.dispose();
        sceneManager.managerClassIndex = (sceneManager.managerClassIndex >= sceneManager.managerClasses.length - 1 ? 0 : sceneManager.managerClassIndex + 1);
        sceneManager.currentManager = new sceneManager.managerClasses[sceneManager.managerClassIndex](sceneManager.scene, eventBus, audioManager);
        sceneManager.currentManager.create(sceneManager.scene, eventBus, audioManager);
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
        let title = $('#title')[0];
        audioManager.isSiteTrack = true;
        audioManager.siteIndex = Number($(this).attr('index'));
        audioManager.initAudio($(this));
        if (options.showTitle) {
            title.innerHTML = this.innerHTML;
        }
        $('.playlist').fadeOut(500);
    });

    // custom button that calls click on hidden fileInput element
    $('.local_Btn').bind("click", function () {
        $('#fileInput').click();
    });

    // local file selection that is hidden
    fileInput.onchange = function () {
        var files = this.files;

        audioManager.isSiteTrack = false;
        let title = $('#title')[0];

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audioManager.fileList = [...files];

        audioManager.audio.src = URL.createObjectURL(audioManager.fileList[0]);
        audioManager.audio.load();
    };

    audio.onended = function () {
        let title = $('#title')[0];

        if (audioManager.isSiteTrack) {
            audioManager.siteIndex++;
            if (audioManager.siteIndex > 13) {
                audioManager.siteIndex = 1;
            }
            let current = $('.playlist li:nth-child(' + audioManager.siteIndex + ')');
            if (options.showTitle) {
                title.innerHTML = current[0].innerHTML;
            }
            audioManager.initAudio(current);
        } else {
            audioManager.localIndex++;
            if (audioManager.localIndex >= audioManager.fileList.length) {
                audioManager.localIndex = 0;
            }
            if (options.showTitle) {
                title.innerHTML = audioManager.fileList[audioManager.localIndex].name;
            }
            audioManager.audio.src = URL.createObjectURL(audioManager.fileList[audioManager.localIndex]);
            audioManager.audio.load();
        }
    };

    window.addEventListener('resize', function () {
        sceneManager.engine.resize();
    });

};