import {
    Star
} from './objects/Star.js';

import {
    getBiasedGlowMaterial
} from './utilities.js';

export class StarManager  {
    
    constructor(scene, eventBus, audioManager){

        this.scene = scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.pieResolution = 256;
        this.starObjects = [];
        this.starMasters = [];
    }

    create(){

    }

    update(){
        this.starObjects.forEach((sObject, index) => {
            sObject.update(this.audioManager.frDataArrayNormalized, index);
        });
    }

    createStarGroupRandom2(colorBias, rotationBias, parent) {

        for (let index = 0; index < 5; index++) {

            let star = new Star("Random Star "+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
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

            let star = new Star("Random Star "+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
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

            let star = new Star("Random Star "+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
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

            let star = new Star("Random Star "+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
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

            let star = new Star("Random Star "+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
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