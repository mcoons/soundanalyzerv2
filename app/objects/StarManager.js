import {
    Star
} from './Star.js';

import {
    getBiasedGlowMaterial
} from '../utilities.js';

export class StarManager  {
    
    constructor(scene, eventBus, audioManager){

        this.scene = scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.pieResolution = 256;
        this.starObjects = [];
        this.starMasters = [];
    }


    create() {
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

        this.createStarGroupRandom2({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom3({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom4({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom5({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(-200, 0, 200);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .2;
        starMaster.scaling.y = .2;
        starMaster.scaling.z = .2;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom6({
            r: .45,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster);

        starMaster.position = new BABYLON.Vector3(0, 0, 0);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .1;
        starMaster.scaling.y = .1;
        starMaster.scaling.z = .1;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom2({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom3({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom4({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom5({
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

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode("starMaster");

        this.createStarGroupRandom6({
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

        this.starMasters.push(starMaster);

        this.eventBus.post("eventTest", 'argument');
    }

    update(){
        this.starObjects.forEach((sObject, index) => {
            sObject.update(this.audioManager.frDataArrayNormalized, index);
        });
    }


    dispose() {
        this.starObjects.forEach( obj => obj.dispose());
        this.starObjects = [];
        this.starMasters = [];

        console.log("DISPOSED !!!!!!!!");
    }

    createStarGroupRandom2(colorBias, rotationBias, parent) {

        for (let index = 0; index < 5; index++) {

            let star = new Star("Random Star 2-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 20 * index + 10;
            star.setOptions(
                Math.round(Math.random() * 20),
                Math.round(Math.random() * 20),

                Math.pow(2, Math.round(Math.random() * 6)),
                Math.pow(2, Math.round(Math.random() * 6)),

                rad,
                rad + Math.round(Math.random() * 6) - 3,

                256,

                null,

                rotationBias.x == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            this.starObjects.push(star);
        }
    }

    createStarGroupRandom3(colorBias, rotationBias, parent) {

        for (let index = 0; index < 5; index++) {

            let star = new Star("Random Star 3-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 20 * index + 10;
            let i = Math.round(Math.random() * 10)
            star.setOptions(
                i,
                i + Math.round(Math.random() * 2 + 1),

                Math.pow(2, Math.round(Math.random() * 6) + 1),
                Math.pow(2, Math.round(Math.random() * 6) + 1),

                rad,
                rad,

                256,

                null,

                rotationBias.x == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            this.starObjects.push(star);
        }
    }

    createStarGroupRandom4(colorBias, rotationBias, parent) {

        for (let index = 0; index < 5; index++) {

            let star = new Star("Random Star 4-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 8 * (9 - index) + 40;
            let i = Math.round(Math.random() * 10)
            star.setOptions(
                i,
                i,

                Math.pow(2, Math.round(Math.random() * 1) + 2),
                Math.pow(2, Math.round(Math.random() * 1) + 4),

                rad,
                rad + 2,

                256,

                null,

                rotationBias.x == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            this.starObjects.push(star);
        }
    }

    createStarGroupRandom5(colorBias, rotationBias, parent) {

        for (let index = 0; index < 5; index++) {

            let star = new Star("Random Star 5-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 10 * index + 80;
            let i = Math.round(Math.random() * 10 + 2);
            let s = Math.pow(2, Math.round(Math.random() * 1));
            star.setOptions(
                i,
                i - 1,

                Math.pow(2, index),
                Math.pow(2, index),

                rad,
                rad + 1,

                256,

                null,

                rotationBias.x == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            this.starObjects.push(star);
        }
    }

    createStarGroupRandom6(colorBias, rotationBias, parent) {

        for (let index = 0; index < 15; index++) {

            let star = new Star("Random Star 6-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 30 * index+20;
            let i = Math.round(Math.random() * 10 + 2);
            let s = Math.pow(2, Math.round(Math.random() * 1));
            star.setOptions(
                i + 2,
                i + 1,

                Math.pow(2, Math.round(Math.random()*4)+1),
                Math.pow(2, Math.round(Math.random()*4)+1),

                rad,
                rad + 1,

                256,

                null,

                rotationBias.x == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z == 1 ? (Math.round(Math.random()*3)%2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            this.starObjects.push(star);
        }
    }

}