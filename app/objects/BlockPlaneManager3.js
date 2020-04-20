export class BlockPlaneManager3 {

    
    constructor(sceneManager, eventBus, audioManager) {
        this.sceneManager = sceneManager;
        this.scene = this.sceneManager.scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.objects = [];
        this.master = new BABYLON.TransformNode("planeMaster");
        this.master.scaling.x = .7;
        this.master.scaling.y = .7;
        this.master.scaling.z = .7;
    }

    create() {
        let width = 30;
        let depth = 60;

        for (let z = 8; z >= 0; z--) {
            for (let x = 0; x < 64; x++) { // 9 * 64 = 576

                let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                    width: width,
                    depth: depth
                }, this.scene);

                thing.position.x = (x - 31.5) * 30;
                thing.position.z = (z - 5) * 60;
                thing.position.y = 0;

                thing.parent = this.master;

                let r = 0;
                let g = 0.1;
                let b = 0.0;

                let color = new BABYLON.Color4(r, g, b, 1, false);

                let mat = new BABYLON.StandardMaterial("mat", this.scene);
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                mat.backFaceCulling = true;
                mat.alpha = 1;

                thing.material = mat;

                this.objects.push(thing);
            }
        }
    }

    update() {
        this.objects.forEach((o, i) => {
            let yy = this.audioManager.sample1[i];
            yy = (yy / 200 * yy / 200) * 255;
            // yy = (yy / 255 * yy / 255) * 255;
            // yy = (yy / 64 * yy / 64) * 32;
            o.scaling.y = yy*.5  + .01;

            let r = yy;// * .8;
            let b = 200 - yy * 2;
            let g = 128 - yy/2 ;

            o.position.y = o.scaling.y / 2;

            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;

        })
    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.master.dispose();
        this.master = null;
    }

}


//                 32                 +               32                       64 wide         32-63 of 64
//         32      +       32         +        32      +       32              32 wide         32-63 of 128
//     32  +   32  +   32  +   32     +    32  +   32  +   32  +   32          16 wide         32-63 of 256
//   32+32 + 32+32 + 32+32 + 32+32    +  32+32 + 32+32 + 32+32 + 32+32          8 wide         32-63 of 512
//                                                                              4 wide         32-63 of 1024
//                                                                              2 wide         32-63 of 2048
//                                                                              1 wide         32-63 of 4096
//                                                                             .5 wide          0-63 of 8192

//                                                                             32*9  =  288

//                                                                             0-287 objects