
export class WispManager {

    constructor(sceneManager, eventBus, audioManager) {

        this.sceneManager = sceneManager;
        this.scene = this.sceneManager.scene;
        this.eventBus = eventBus;
        this.audioManager = audioManager;

        this.objects = [];

        this.master =  new BABYLON.TransformNode("planeMaster");

        this.master.scaling.x = .7;
        this.master.scaling.y = .7;
        this.master.scaling.z = .7;

        // console.log(this.scene);

        this.sceneManager.glowLayer.intensity = 100.75;

    }

    create() {

        for (let z = 16; z > 0; z--) {
            for (let x = 0; x < 32; x++) {

                let thing = BABYLON.MeshBuilder.CreateSphere(("Wisp"+x+z), {diameter: 5 }, this.scene);

                thing.position.x = (x - 16) * 100;
                thing.position.z = (z - 8) * 100;
                thing.position.y = 0;

                thing.isVisible = true;
                thing.parent = this.master;


                let r = .5;
                let g = .5;
                let b = .5;
        
                let color = new BABYLON.Color4(r, g, b, 1, false);
        
                let mat = new BABYLON.StandardMaterial("mat", this.scene);
                // mat.diffuseColor = color;
                // mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                // mat.backFaceCulling = true;
        
        
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                mat.emissiveColor = new BABYLON.Color3(r, g, b);
                mat.backFaceCulling = true;
                mat.alpha = 1;
        
                thing.material = mat;

                this.objects.push(thing);
            }
        }
    }

    update() {

        this.objects.forEach((o, i) => {
            let y = (this.audioManager.frDataArrayNormalized[i+5])/5;
            o.scaling.x = y/200/(i+1)+5;
            o.scaling.y = y/200/(i+1)+5;
            o.scaling.z = y/200/(i+1)+5;
            // o.position.y = o.scaling.y / 2;

            let r = y/4;
            let b = y;
            let g = y/4;

            // let color = new BABYLON.Color4(r*2, g*2, b*2, 1, false);

            o.material.diffuseColor.r = r/255;
            o.material.diffuseColor.g = g/255;
            o.material.diffuseColor.b = b/255;



            // o.material.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
            // o.material.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
            o.material.emissiveColor.r = r/255;
            o.material.emissiveColor.g = g/255;
            o.material.emissiveColor.b = b/255;

        });

    }

    remove() {

        this.sceneManager.glowLayer.intensity = 2.75;

        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.master.dispose();
        this.master = null;

    }
}