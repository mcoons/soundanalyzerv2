import {
    StarManager
} from './objects/StarManager.js';

import {
    BlockSpiralManager
} from './objects/BlockSpiralManager.js';

import {
    BlockPlaneManager3
} from './objects/BlockPlaneManager3.js';

import {
    RippleManager
} from './objects/RippleManager.js';

import {
    Clock
} from './objects/Clock.js';

import {
    buildPalettes
} from './utilities.js';

import {
    EquationManager
} from './objects/EquationManager.js';


export class SceneManager {

    constructor(canvasID, options, eventBus, audioManager) {

        this.options = options;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.canvas3D = $(canvasID)[0];
        this.engine = new BABYLON.Engine(this.canvas3D, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        this.camera;
        this.scene = this.createScene();
        this.glowLayer;

        // this.scene.debugLayer.show();

        this.palette = [];
        this.paletteGlow = [];
        this.paletteRed = [];
        this.paletteGreen = [];
        this.paletteBlue = [];
        this.paletteGray = [];
        this.paletteMetallic = [];

        buildPalettes(this.palette, this.paletteGlow, this.paletteRed, this.paletteGreen, this.paletteBlue, this.paletteGray, this.paletteMetallic, this.scene);

        this.masterTransform;

        // define preset camera positions
        this.cameraPositions = [{
                lookat: new BABYLON.Vector3(-200, 0, 100),
                alpha: -Math.PI / 2,
                beta: 0.01,
                radius: 250
            },
            {
                lookat: new BABYLON.Vector3(200, 0, 100),
                alpha: -Math.PI / 2,
                beta: 0.01,
                radius: 250
            },
            {
                lookat: new BABYLON.Vector3(0, 0, 0),
                alpha: 4.711,
                beta: 1.096,
                radius: 1300
            },
            {
                lookat: new BABYLON.Vector3(-200, 0, -100),
                alpha: -Math.PI / 2,
                beta: .01,
                radius: 250
            },
            {
                lookat: new BABYLON.Vector3(200, 0, -100),
                alpha: -Math.PI / 2,
                beta: 0.01,
                radius: 250
            },
        ];
        // this.clock = new Clock(this.scene);

        this.managerClassIndex = 1;
        this.managerClasses = [
            BlockPlaneManager3,
            BlockSpiralManager,
            //            RippleManager, 
            StarManager,
            EquationManager
        ];

        this.nextScene();

        this.scene.registerBeforeRender(() => {
            this.fix_dpi();
            this.currentManager.update();
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    } // end constructor

    createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(1.4, 1.3, 1.5);

        this.glowLayer = new BABYLON.GlowLayer("glow", scene);
        this.glowLayer.intensity = 3.5;

        this.camera = new BABYLON.ArcRotateCamera("camera1", 4.7, 1.1, 1100, new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.upperRadiusLimit = 9400;
        this.camera.lowerRadiusLimit = 10;
        this.camera.attachControl(canvas3D, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);
        light.intensity = 1.5;

        var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(200, 300, -600), scene);
        // pointLight1.intensity = 1.8;

        var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-200, -300, 600), scene);
        // pointLight2.intensity = 1.3;

        var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 200, 0), scene);
        // pointLight3.intensity = 1.8;

        var pointLight4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(300, 480, -280), scene);
        // pointLight4.intensity = 1.0;

        return scene;
    }

    nextScene() {
        this.selectScene(this.managerClassIndex >= this.managerClasses.length - 1 ? 0 : this.managerClassIndex + 1);
    }

    selectScene(index) {
        $("#cameraTarget").addClass("hidden");

        if (this.currentManager) {
            this.currentManager.remove();
        }

        this.currentManager = null;
        this.scene.materials.forEach(m => {
            m.dispose(true, true, true);
        });

        this.managerClassIndex = index;
        this.currentManager = new this.managerClasses[this.managerClassIndex](this, this.eventBus, this.audioManager);
        this.currentManager.create(this.scene, this.eventBus, this.audioManager);
    }   
    
    fix_dpi() {
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



}