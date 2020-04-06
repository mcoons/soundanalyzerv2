export class RippleManager {

  constructor(sceneManager, eventBus, audioManager) {

    this.sceneManager = sceneManager;
    this.scene = this.sceneManager.scene;
    this.eventBus = eventBus;
    this.audioManager = audioManager;

    this.ripple;
  }

  create() {
    let xOffset = 0;
    let zOffset = 0;
    var paths = [];

    for (let r = 0; r < 256; r++) {
      let path = [];
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

        let x = 2 * r * Math.cos(theta) + xOffset;
        let z = 2 * r * Math.sin(theta) + zOffset;
        let y = -.01;

        path.push(new BABYLON.Vector3(x, y, z));
      }
      paths.push(path);
    }

    this.ripple = BABYLON.Mesh.CreateRibbon("ripple", paths, false, false, 0, this.scene, true);

    let mat = new BABYLON.StandardMaterial("material()", this.scene);
    var color = new BABYLON.Color4(.3, .3, .3, 1, false);

    mat.diffuseColor = color;
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    mat.ambientColor = new BABYLON.Color3(0, 0, 0);
    mat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    mat.backFaceCulling = false;

    this.ripple.material = mat;
  }

  update() {

    let xOffset = 0;
    let zOffset = 0;
    var paths = [];

    for (let r = 0; r < 255; r++) {
      var path = [];
      for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {

        let x = 2 * r * Math.cos(theta) + xOffset;
        let z = 2 * r * Math.sin(theta) + zOffset;
        let y = this.audioManager.fr2048DataArray[r] / 20; // + 20.3;

        path.push(new BABYLON.Vector3(x, y, z));
      }

      paths.push(path);
    };

    this.ripple = BABYLON.MeshBuilder.CreateRibbon(null, {
      pathArray: paths,
      instance: this.ripple,
      sideOrientation: 1
    });

  }

  remove() {

    this.ripple.dispose();

  }
}