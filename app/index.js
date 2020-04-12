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

    // var nothing = new Audio("/nothing.wav");

    // nothing.play().then(function () {
    //     console.log("Audio started unlocked!")
    // }).catch(function () {
    //     console.log("Audio started locked")
    // })

    var options = {
        showBars: true,
        showTitle: true,
        showWater: false,
        showSky: false,
        showConsole: true,
        showWaveform: true
    }

    //////////////////////////////////////////////////////////////////////
    // start the Event Bus (event handler) - testing only

    var eventBus = new EventBus();

    // event bus test
    eventBus.subscribe("eventTest", eventTestCallback);

    function eventTestCallback() {
        console.log("Initial Event Received");
    }
    eventBus.post("eventTest");
    eventBus.unsubscribe("eventTest", eventTestCallback);

    //////////////////////////////////////////////////////////////////////
    // start the Audio Manager (audio loop using  setInterval of 0020 ms)

    var audioManager = new AudioManager();
    window.audioManager = audioManager;

    //////////////////////////////////////////////////////////////////////
    // start the Sene Manager (3D render loop using  engine.runRenderLoop)

    var sceneManager = new SceneManager('#canvas3D', options, eventBus, audioManager);

    //////////////////////////////////////////////////////////////////////
    // start the Overlay Manager (2D render loop using  window.requestAnimationFrame)

    var overlayManager = new OverlayManager('#canvas2D', options, eventBus, audioManager, sceneManager);

    //////////////////////////////////////////////////////////////////////
    // event listeners

    // microphone selection
    $('#options_Btn').click(function () {
        audioManager.initMic();
    });

    // change visual
    $('#visual_Btn').click(function () {
        sceneManager.scene.cameras[0].target = sceneManager.cameraPositions[2].lookat;
        sceneManager.scene.cameras[0].alpha = sceneManager.cameraPositions[2].alpha;
        sceneManager.scene.cameras[0].beta = sceneManager.cameraPositions[2].beta;
        sceneManager.scene.cameras[0].radius = sceneManager.cameraPositions[2].radius;

        sceneManager.nextScene();
    });

    // camera buttons
    $('td').bind("click", function () {
        sceneManager.scene.cameras[0].target = sceneManager.cameraPositions[this.id - 1].lookat;
        sceneManager.scene.cameras[0].alpha = sceneManager.cameraPositions[this.id - 1].alpha;
        sceneManager.scene.cameras[0].beta = sceneManager.cameraPositions[this.id - 1].beta;
        sceneManager.scene.cameras[0].radius = sceneManager.cameraPositions[this.id - 1].radius;
    });

    // show site playlist
    $('.pl').click(function () {
        $('.playlist').fadeIn(500);
    });

    // playlist elements - click
    $('.playlist li').click(function () {

        try {
            audioManager.streams.getTracks().forEach(function (track) {
                track.stop();
                console.log('Track Stopped');
            })
        } catch (error) {
            console.log("Streams error: " + error);
        }

        audioManager.getTopBuckets();
        audioManager.clearSampleArrays();

        let title = $('#title')[0];

        audioManager.isSiteTrack = true;
        audioManager.isMic = false;

        audioManager.siteIndex = Number($(this).attr('index'));
        audioManager.initAudio($(this));

        if (options.showTitle) {
            title.innerHTML = this.innerHTML;
        }
        $('.playlist').fadeOut(500);
    });

    // close site playlist
    $("#closeBtn").click(function () {
        $('.playlist').fadeOut(500);
    })

    // custom button that calls click on hidden fileInput element below
    $('.local_Btn').bind("click", function () {
        $('#fileInput').click();
    });

    // local file selection that is hidden
    fileInput.onchange = function () {

        try {
            audioManager.streams.getTracks().forEach(function (track) {
                track.stop();
                console.log('Track Stopped');
            })
        } catch (error) {
            console.log("Streams error: " + error);
        }

        audioManager.getTopBuckets();
        audioManager.clearSampleArrays();

        var files = this.files;

        audioManager.isSiteTrack = false;
        audioManager.isMic = false;

        let title = $('#title')[0];

        if (options.showTitle) {
            title.innerHTML = files[0].name;
        }

        audioManager.fileList = [...files];

        audioManager.audio.src = URL.createObjectURL(audioManager.fileList[0]);
        audioManager.audio.load();
        audioManager.audio.play()
            .then(function () {
                console.log("Audio Successfully Playing")
            })
            .catch(function () {
                console.log("Audio Failed Playing")
            });
    };

    // advance to next song
    audio.onended = function () {
        let title = $('#title')[0];

        audioManager.getTopBuckets();
        audioManager.clearSampleArrays();

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
        } else
        if (!audioManager.isMic) {
            audioManager.localIndex++;
            if (audioManager.localIndex >= audioManager.fileList.length) {
                audioManager.localIndex = 0;
            }
            if (options.showTitle) {
                title.innerHTML = audioManager.fileList[audioManager.localIndex].name;
            }
            audioManager.audio.src = URL.createObjectURL(audioManager.fileList[audioManager.localIndex]);
            audioManager.audio.load();
        } else {
            console.log("On ended of mic");
        }
    };

    // standard resize for 3D engine
    window.addEventListener('resize', function () {
        sceneManager.engine.resize();
        fix_dpi();
    });

    //get the canvas, canvas context, and dpi

    function fix_dpi() {
        let canvas2D = document.getElementById('canvas2D'),
            canvas3D = document.getElementById('canvas3D'),
            dpi = window.devicePixelRatio || 1;

        //create a style object that returns width and height
        let style2D = {
            height() {
                return +getComputedStyle(canvas2D).getPropertyValue('height').slice(0, -2);
            },
            width() {
                return +getComputedStyle(canvas2D).getPropertyValue('width').slice(0, -2);
            }
        }

        let style3D = {
            height() {
                return +getComputedStyle(canvas3D).getPropertyValue('height').slice(0, -2);
            },
            width() {
                return +getComputedStyle(canvas3D).getPropertyValue('width').slice(0, -2);
            }
        }

        //set the correct attributes for a crystal clear image!
        canvas2D.setAttribute('width', style2D.width() * dpi);
        canvas2D.setAttribute('height', style2D.height() * dpi);

        //set the correct attributes for a crystal clear image!
        canvas3D.setAttribute('width', style3D.width() * dpi);
        canvas3D.setAttribute('height', style3D.height() * dpi);
    }

};