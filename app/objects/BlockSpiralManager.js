import {
  map
} from "../utilities.js";

export class BlockSpiralManager {

  constructor(sceneManager, eventBus, audioManager) {

    this.sceneManager = sceneManager;
    this.scene = this.sceneManager.scene;
    this.eventBus = eventBus;
    this.audioManager = audioManager;

    this.objects = [];

    this.wheel1Master = new BABYLON.TransformNode("root");
    this.wheel1Master.position = new BABYLON.Vector3(0, 0, 0);
    this.wheel1Master.scaling.x = 4;
    this.wheel1Master.scaling.y = 4;
    this.wheel1Master.scaling.z = 4;

    this.sceneManager.scene.cameras[0].target = new BABYLON.Vector3(0, -50, 0);
    this.sceneManager.scene.cameras[0].alpha = 4.72;
    this.sceneManager.scene.cameras[0].beta = 1.00;
    this.sceneManager.scene.cameras[0].radius = 1000;

  }

  create() {

    let width = 8;
    let radius = 20;
    let depth = 2.0;
    for (let theta = 0; theta < 18 * Math.PI; theta += Math.PI / 32) { // 512 items ---  256*2    128*4    64*8

      width = 6;
      depth = radius / 12;

      let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
        width: width,
        depth: depth
      }, this.scene);

      thing.position.x = radius * Math.cos(theta);
      thing.position.z = radius * Math.sin(theta);
      thing.position.y = 50;
      thing.rotation.y = -theta;

      let r = .5;
      let g = .5;
      let b = .5;

      let color = new BABYLON.Color4(r, g, b, 1, false);

      let mat = new BABYLON.StandardMaterial("matSpiral", this.scene);
      mat.diffuseColor = color;
      mat.specularColor = new BABYLON.Color3(0, 0, 0);

      mat.backFaceCulling = true;

      thing.material = mat;

      thing.parent = this.wheel1Master;
      this.objects.push(thing);
      radius += .12;
    }

  }


  update() {
    this.sceneManager.scene.cameras[0].alpha  += .001;
    if (this.sceneManager.scene.cameras[0].alpha >= 2 * Math.PI ) {
      this.sceneManager.scene.cameras[0].alpha -= 2 * Math.PI;
    }


    this.objects.forEach((o, i) => {
      let y = (this.audioManager.sample1[i]);
      y = (y / 255 * y / 255) * 255;

      o.scaling.y = .05 + y / 17;
      o.position.y = o.scaling.y / 2 - i / 10 + 50;

      let b = y * .9;
      let g = 128 - y * 1.5;
      let r = 128 - y / 2;

      o.material.diffuseColor.r = r / 255;
      o.material.diffuseColor.g = g / 255;
      o.material.diffuseColor.b = b / 255;

    });

  }

  remove() {
    this.objects.forEach(o => o.dispose());
    this.objects = null;

    this.wheel1Master.dispose();
  }

}