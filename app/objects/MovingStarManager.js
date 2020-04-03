import {
    Star
} from './Star.js';


import {
    getBiasedGlowMaterial
} from '../utilities.js';


export class MovingStarManager {

    constructor(sceneManager, eventBus, audioManager){

        this.sceneManager = sceneManager;
        this.scene = this.sceneManager.scene;

        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.pieResolution = 256;
        this.objects = [];
        this.clones = [];
        this.starMaster;

        this.interval;

        // this.SPS = new BABYLON.SolidParticleSystem("SPS", this.scene);
        // var mesh = this.SPS.buildMesh();

    }

    create (){

        this.starMaster = new BABYLON.TransformNode("starMaster");

        let colorBias = {
            r: .75,
            g: .45,
            b: .45
        }

        for (let index = 0; index < 1; index++) {

            let star = new Star("MovingStar-"+index, "star parent", null, getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.eventBus, this.scene);
            let rad = 20 * index + 10;
rad = 30;
            //     setOptions(p_innerStartIndex, p_outerStartIndex, p_innerSlices, p_outerSlices, p_innerRadius, p_outerRadius, p_resolution, p_reflect, p_xRotation, p_yRotation, p_zRotation) {

            star.setOptions(
                0,
                20,

                32,
                32,

                rad,
                rad + Math.round(Math.random() * 6) - 3,

                256,

                null
            );
            star.mesh.parent = this.starMaster;
            star.mesh.position.x = -200;
            this.objects.push(star);
        }

        this.interval = setInterval( ()=>{
            this.spawn();
        }, 5000);

    }

    update(){

        this.starMaster.rotation.z += .01;

        this.objects.forEach((sObject, index) => {
            if (sObject.mesh.name === "clone"){
                console.log("skipping clone update");
            }
            else {
                sObject.update(this.audioManager.frDataArrayNormalized, index);
            }
        });


    }

    remove() {
        clearInterval(this.interval);

        this.objects.forEach( obj => obj.remove());
        this.objects = [];
        this.clones.forEach( obj => obj.dispose());
        this.objects = [];
        
        this.starMaster.dispose();
     
    }

    spawn()  {
        console.log("spawning");
        // console.log(this.objects[0]);
        let newInstance = this.objects[0].mesh.createInstance("instance");
        console.log(newInstance);
        // // this.SPS.addShape(this.objects[0].mesh);
        // // this.SPS.buildMesh();
        newInstance.parent = null;
        this.clones.push(newInstance);
        console.log(this.clones);
    }


}