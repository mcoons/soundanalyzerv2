
export class BlockSpiralManager  {
    
    constructor(scene, eventBus, audioManager){

        this.scene = scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.myObjects = [];

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
        for (let theta = 0; theta < 16*Math.PI ; theta += Math.PI/32){  // 512 items ---  256*2    128*4    64*8
    
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
          this.myObjects.push(thing);
          radius+=.12;
        }
    }

    update(){

        this.myObjects.forEach( (o,i) => {
            let y = (this.audioManager.frDataArray[i] );
            o.scaling.y = .01 + y/20;
            o.position.y = o.scaling.y / 2  - i/10 + 25;

            let r = y*.8;
            let g = 255-y*2.5;
            let b = 200-y/3;
    
            o.material.diffuseColor = new BABYLON.Color4(r/255, g/255, b/255, 1, false);
          });
      
        }

    remove() {

        this.myObjects.forEach( o => o.dispose());
        this.myObjects = null;

        this.wheel1Master.dispose();

    }
}
