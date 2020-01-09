import {
    StarManager
} from './objects/StarManager.js';

import {
    BlockSpiralManager
} from './objects/BlockSpiralManager.js';

import {
    BlockPlaneManager
} from './objects/BlockPlaneManager.js';

import {
    RippleManager
} from './objects/RippleManager.js';

import {
    Clock
} from './objects/Clock.js';


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

        this.defaultGridMaterial;
        this.skySphere;
        this.skyMaterial;
        this.waterMaterial
        this.waterMesh;

        this.glowLayer;
        this.masterTransform;

        // preset camera positions
        this.cameraPositions = [{
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
        // this.clock = new Clock(this.scene);

        this.managerClassIndex = 1;
        this.managerClasses = [BlockPlaneManager, BlockSpiralManager, RippleManager, StarManager];
        this.currentManager = new this.managerClasses[this.managerClassIndex](this.scene, this.eventBus, this.audioManager);

        // add current objects to the scene
        this.currentManager.create();

        // start  3D render loop
        var  self =  this;

        this.scene.registerBeforeRender(()=> {
            this.currentManager.update();
        });

        this.engine.runRenderLoop(() => {
            // self.currentManager.update();
            this.scene.render();
        });
    }  // end constructor

    createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);

        this.glowLayer = new BABYLON.GlowLayer("glow", scene);
        this.glowLayer.intensity = 2.75;

        // default object grid material
        this.defaultGridMaterial = new BABYLON.GridMaterial("defaultGridMaterial", scene);
        this.defaultGridMaterial.majorUnitFrequency = 10;
        this.defaultGridMaterial.minorUnitVisibility = .33;
        this.defaultGridMaterial.gridRatio = 0.75;
        this.defaultGridMaterial.mainColor = new BABYLON.Color3(0.8, 0.75, 0.6);
        this.defaultGridMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        this.defaultGridMaterial.backFaceCulling = false;

        // sky grid material
        if (this.options.showSky) {
            this.skyMaterial = new BABYLON.GridMaterial("skyMaterial", scene);
            this.skyMaterial.majorUnitFrequency = 5;
            this.skyMaterial.minorUnitVisibility = .43;
            this.skyMaterial.gridRatio = 20.0;
            this.skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
            this.skyMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
            this.skyMaterial.backFaceCulling = false;

            this.skySphere = BABYLON.Mesh.CreateSphere("skySphere", 32, 19200, scene);
            skySphere.material = this.skyMaterial;
        }

        // Water material
        if (this.options.showWater) {
            this.waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
            this.waterMaterial.bumpTexture = new BABYLON.Texture("//www.babylonjs.com/assets/waterbump.png", scene);
            this.waterMaterial.windForce = -5;
            this.waterMaterial.waveHeight = 0.4;
            this.waterMaterial.bumpHeight = 0.06;
            this.waterMaterial.waveLength = 0.12;
            this.waterMaterial.waveSpeed = 30.0;
            this.waterMaterial.colorBlendFactor = .5;
            this.waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
            this.waterMaterial.colorBlendFactor = 0;

            // Configure water material
            this.waterMaterial.addToRenderList(skySphere);
            // Water mesh
            this.waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 50000, 50000, 32, scene, false);
            waterMesh.material = waterMaterial;
            waterMesh.position.y = -80;
        }

        this.camera = new BABYLON.ArcRotateCamera("camera1", 4.7, 1.1, 815, new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.upperRadiusLimit = 9400;
        this.camera.lowerRadiusLimit = 10;
        this.camera.attachControl(canvas3D, true);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), scene);
        light.intensity = 1.6;

        var pointLight1 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(200, 300, -600), scene);
        pointLight1.intensity = 2.2;

        var pointLight2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(-200, -300, 600), scene);
        pointLight2.intensity = 2.2;

        // var pointLight3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 200, 0), scene);
        // pointLight3.intensity = 1.8;

        // var pointLight4 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(300, 480, -280), scene);
        // pointLight4.intensity = 1.0;

        return scene;
    }

}