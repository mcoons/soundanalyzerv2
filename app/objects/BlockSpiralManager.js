
import {
  map
} from "../utilities.js";

export class BlockSpiralManager  {
    
    constructor(sceneManager, eventBus, audioManager){

      this.sceneManager = sceneManager;
      this.scene = this.sceneManager.scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.objects = [];

        this.wheel1Master =  new BABYLON.TransformNode("root"); 
        this.wheel1Master.position = new BABYLON.Vector3(0,0,0);
        this.wheel1Master.scaling.x = 4;
        this.wheel1Master.scaling.y = 4;
        this.wheel1Master.scaling.z = 4;
    }

    create() {

        let width = 8;
        let radius = 20;
        let depth = 2.0;
        for (let theta = 0; theta < 18*Math.PI ; theta += Math.PI/32){  // 512 items ---  256*2    128*4    64*8
    
            width = 6;
            depth = radius/12;

          let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
            width: width,
            depth: depth
          }, this.scene);

          thing.position.x = radius*Math.cos(theta) ;
          thing.position.z = radius*Math.sin(theta) ;
          thing.position.y = 0;
          thing.rotation.y = -theta;

          let r = .5;
          let g = .5;
          let b = .5;

          let color = new BABYLON.Color4(r,g,b, 1, false);

          let mat = new BABYLON.StandardMaterial("matSpiral", this.scene);
          mat.diffuseColor = color;
          mat.specularColor = new BABYLON.Color3(0, 0, 0);

          mat.backFaceCulling = true;
    
          thing.material = mat;

          thing.parent = this.wheel1Master;
          this.objects.push(thing);
          radius+=.12;
        }
    }

    update(){

        this.objects.forEach( (o,i) => {
          // let y = (this.audioManager.fr1024DataArray[i] );
          let y = (this.audioManager.sample1Normalized[i] );
          o.scaling.y = .01 + y/18;
            o.position.y = o.scaling.y / 2  - i/10 + 25;


            try {
              o.material.diffuseColor = this.sceneManager.palette[Math.round(map(y || 0, 0, 255, 10, 1500))].color;
            } catch (error) {
              // console.log(error);
              // console.log(this.sceneManager.palette);
              console.log(this.audioManager.sample1Normalized);
              console.log("y  = " + y);
            }

            // let r = y;
            // let b = 80-y/2;
            // let g = 128-y*b;
    
            // o.material.diffuseColor = new BABYLON.Color4(r/255, g/255, b/255, 1, false);
          });
      
    }

    remove() {

        this.objects.forEach( o => o.dispose());
        this.objects = null;

        this.wheel1Master.dispose();

    }

}
