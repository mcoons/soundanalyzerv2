import {
    StarManager
} from './StarManager.js';

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

        this.scene = this.createScene();
        this.camera;

        this.starManager = new StarManager(this.scene, this.eventBus, this.audioManager);
        this.clock = new Clock(this.scene);

        this.defaultGridMaterial;
        this.skySphere;
        this.skyMaterial;
        this.waterMaterial
        this.waterMesh;

        this.glowLayer;
        this.masterTransform;

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

        this.createObjects();

        var  self =  this;
        this.engine.runRenderLoop(function () {
            // self.audioManager.analyzeData();

            self.updateObjects();
            self.scene.render();
        });
    }

    createScene() {
        // create a basic BJS Scene object
        let scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color3.Black();
        scene.ambientColor = new BABYLON.Color3(0.4, 0.3, 0.5);

        this.glowLayer = new BABYLON.GlowLayer("glow", scene);
        this.glowLayer.intensity = 2.75;

        // default object grid material
        this.defaultGridMaterial = new BABYLON.GridMaterial("default", scene);
        this.defaultGridMaterial.majorUnitFrequency = 10;
        this.defaultGridMaterial.minorUnitVisibility = .33;
        this.defaultGridMaterial.gridRatio = 0.75;
        this.defaultGridMaterial.mainColor = new BABYLON.Color3(0.8, 0.75, 0.6);
        this.defaultGridMaterial.lineColor = new BABYLON.Color3(0, .30, .30);
        this.defaultGridMaterial.backFaceCulling = false;

        // sky grid material
        if (this.options.showSky) {
            this.skyMaterial = new BABYLON.GridMaterial("this.skyMaterial", scene);
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

        // buildPalettes(palette, paletteGlow, paletteRed, paletteGreen, null, paletteGray, paletteMetallic, scene);

        this.camera = new BABYLON.ArcRotateCamera("camera1", 4.7, 1.1, 815, new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.upperRadiusLimit = 9400;
        this.camera.lowerRadiusLimit = 10;

        // attach the this.camera to the canvas3D
        this.camera.attachControl(canvas3D, true);

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

    createObjects() {


        let starMaster;
        this.masterTransform = new BABYLON.TransformNode("root");
        this.masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        // starMaster1 = new BABYLON.TransformNode("starMaster1");

        // createStarGroup1(starMaster1);

        // starMaster1.position = new BABYLON.Vector3(400, 0, 0);
        // starMaster1.parent = this.masterTransform;
        // starMaster1.scaling.x = .1;
        // starMaster1.scaling.y = .1;
        // starMaster1.scaling.z = .1;

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom2({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(200, 0, -200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom3({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-200, 0, -200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom4({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(200, 0, 200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom5({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-200, 0, 200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom6({
            r: .45,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 1,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(0, 0, 0);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom2({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(400, 0, -200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom3({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-400, 0, -200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom4({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(400, 0, 200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom5({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 1,
            y: 0,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-400, 0, 200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.starManager.createStarGroupRandom6({
            r: .45,
            g: .45,
            b: .45
        }, {
            x: 1,
            y: 1,
            z: 1
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(0, 200, 0);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        starMaster.rotation.y = Math.PI / 2;

        this.starManager.starMasters.push(starMaster);

        // drawRandomStars();
        this.eventBus.post("eventTest", 'argument');
    }

    updateObjects() {
        this.starManager.update();
    }

}