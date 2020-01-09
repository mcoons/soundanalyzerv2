
export class BlockPlaneManager {

    constructor(scene, eventBus, audioManager) {

        this.scene = scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.objects = [];
        this.instances = [];

        this.baseColors = [];

        this.master =  new BABYLON.TransformNode("planeMaster");

        this.master.scaling.x = .7;
        this.master.scaling.y = .7;
        this.master.scaling.z = .7;
    }

    create() {
        let width = 30;
        let depth = 30;

        let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
            width: width,
            depth: depth
        }, this.scene);

        let r = .5;
        let g = .5;
        let b = .5;

        let color = new BABYLON.Color4(r, g, b, 1, false);

        let mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = color;
        mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        mat.backFaceCulling = true;

        thing.registerInstancedBuffer("color", 4);
        thing.instancedBuffers.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1);

        thing.material = mat;
        thing.isVisible = false;

        this.objects.push(thing);

        for (let z = 18; z > 0; z--) {
            for (let x = 0; x < 50; x++) {

                let newInstance = thing.createInstance("instance(" + x + "," + z + ")");

                newInstance.position.x = (x - 24.5) * 30;
                newInstance.position.z = (z - 10) * 30;
                newInstance.position.y = 0;

                newInstance.isVisible = true;
                newInstance.parent = this.master;

                this.baseColors.push(new BABYLON.Color4(.75,.75,.75, 1));
                newInstance.instancedBuffers.color = this.baseColors[this.baseColors.length - 1].clone();

                this.instances.push(newInstance);
            }
        }
    }

    update() {

        this.instances.forEach((o, i) => {
            let y = (this.audioManager.frDataArray[i]);
            o.scaling.y = .01 + y/2;
            o.position.y = o.scaling.y / 2;

            let r = y*.8;
            let b = 200-y*1.5;
            let g = 128-y/2;

            this.baseColors[i].r = r/255;
            this.baseColors[i].g = g/255;
            this.baseColors[i].b = b/255;
            
            o.instancedBuffers.color = this.baseColors[i];
        });

    }

    dispose() {

        this.objects.forEach(o => o.dispose());
        this.objects = [];

        this.instances.forEach(i => i.dispose());
        this.instances = [];

    }
}