
export class BlockPlaneManager2 {

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

    }

    create() {

        let width = 30;
        let depth = 30;

        for (let z = 8; z >= 0; z--) {
            for (let x = 0; x < 32; x++) {

            // for (let z = 17; z >= 0; z--) {
            //     for (let x = 0; x < 16; x++) {


                let thing = BABYLON.MeshBuilder.CreateBox(("box"), {
                    width: width,
                    depth: depth
                }, this.scene);

                thing.position.x = (x - 16) * 30;
                thing.position.z = (z - 4) * 30;
            
                thing.position.y = 0;

                thing.isVisible = true;
                thing.parent = this.master;

                let r = .5;
                let g = 0;
                let b = 0;
        
                let color = new BABYLON.Color4(r, g, b, 1, false);
        
                let mat = new BABYLON.StandardMaterial("mat", this.scene);
        
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                // mat.emissiveColor = new BABYLON.Color3(r, g, b);
                mat.backFaceCulling = true;
                mat.alpha = 1;
        
                thing.material = mat;

                this.objects.push(thing);
            }
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

    update() {

        for (let index = 0; index < 32; index++) {
            this.objects[index].scaling.y     = .01 + (this.audioManager.soundArrays[7])[index]/4;
            this.objects[index+32].scaling.y  = .01 + (this.audioManager.soundArrays[7])[index+32]/4;
            this.objects[index+64].scaling.y  = .01 + (this.audioManager.soundArrays[6])[index+32]/4;
            this.objects[index+96].scaling.y  = .01 + (this.audioManager.soundArrays[5])[index+32]/4;
            this.objects[index+128].scaling.y = .01 + (this.audioManager.soundArrays[4])[index+32]/4;
            this.objects[index+160].scaling.y = .01 + (this.audioManager.soundArrays[3])[index+32]/4;
            this.objects[index+192].scaling.y = .01 + (this.audioManager.soundArrays[2])[index+32]/4;
            this.objects[index+224].scaling.y = .01 + (this.audioManager.soundArrays[1])[index+32]/4;
            this.objects[index+256].scaling.y = .01 + (this.audioManager.soundArrays[0])[index+32]/4;

            this.objects[index].position.y     = this.objects[index].scaling.y/2;
            this.objects[index+32].position.y  = this.objects[index+32].scaling.y/2;
            this.objects[index+64].position.y  = this.objects[index+64].scaling.y/2;
            this.objects[index+96].position.y  = this.objects[index+96].scaling.y/2;
            this.objects[index+128].position.y = this.objects[index+128].scaling.y/2;
            this.objects[index+160].position.y = this.objects[index+160].scaling.y/2;
            this.objects[index+192].position.y = this.objects[index+192].scaling.y/2;
            this.objects[index+224].position.y = this.objects[index+224].scaling.y/2;
            this.objects[index+256].position.y = this.objects[index+256].scaling.y/2;




            this.objects[index].material.diffuseColor.r     = (this.audioManager.soundArrays[7])[index]/255;
            this.objects[index+32].material.diffuseColor.r  = (this.audioManager.soundArrays[7])[index+32]/255;
            this.objects[index+64].material.diffuseColor.r  = (this.audioManager.soundArrays[6])[index+32]/255;
            this.objects[index+96].material.diffuseColor.r  = (this.audioManager.soundArrays[5])[index+32]/255;
            this.objects[index+128].material.diffuseColor.r = (this.audioManager.soundArrays[4])[index+32]/255;
            this.objects[index+160].material.diffuseColor.r = (this.audioManager.soundArrays[3])[index+32]/255;
            this.objects[index+192].material.diffuseColor.r = (this.audioManager.soundArrays[2])[index+32]/255;
            this.objects[index+224].material.diffuseColor.r = (this.audioManager.soundArrays[1])[index+32]/255;
            this.objects[index+256].material.diffuseColor.r = (this.audioManager.soundArrays[0])[index+32]/255;


            this.objects[index].material.diffuseColor.b     = 1 - this.objects[index].material.diffuseColor.r /10 - (this.audioManager.soundArrays[7])[index]/255;
            this.objects[index+32].material.diffuseColor.b  = 1 - this.objects[index+32].material.diffuseColor.r /10 - (this.audioManager.soundArrays[7])[index+32]/255;
            this.objects[index+64].material.diffuseColor.b  = 1 - this.objects[index+64].material.diffuseColor.r /10 - (this.audioManager.soundArrays[6])[index+32]/255;
            this.objects[index+96].material.diffuseColor.b  = 1 - this.objects[index+96].material.diffuseColor.r /10 - (this.audioManager.soundArrays[5])[index+32]/255;
            this.objects[index+128].material.diffuseColor.b = 1 - this.objects[index+128].material.diffuseColor.r /10 - (this.audioManager.soundArrays[4])[index+32]/255;
            this.objects[index+160].material.diffuseColor.b = 1 - this.objects[index+160].material.diffuseColor.r /10 - (this.audioManager.soundArrays[3])[index+32]/255;
            this.objects[index+192].material.diffuseColor.b = 1 - this.objects[index+192].material.diffuseColor.r /10 - (this.audioManager.soundArrays[2])[index+32]/255;
            this.objects[index+224].material.diffuseColor.b = 1 - this.objects[index+224].material.diffuseColor.r /10 - (this.audioManager.soundArrays[1])[index+32]/255;
            this.objects[index+256].material.diffuseColor.b = 1 - this.objects[index+256].material.diffuseColor.r /10 - (this.audioManager.soundArrays[0])[index+32]/255;


            this.objects[index].material.diffuseColor.g     = 1- (this.objects[index].material.diffuseColor.b /10 + (this.audioManager.soundArrays[7])[index]/255);
            this.objects[index+32].material.diffuseColor.g  = 1- (this.objects[index+32].material.diffuseColor.b /10 + (this.audioManager.soundArrays[7])[index+32]/255);
            this.objects[index+64].material.diffuseColor.g  = 1- (this.objects[index+64].material.diffuseColor.b /10 + (this.audioManager.soundArrays[6])[index+32]/255);
            this.objects[index+96].material.diffuseColor.g  = 1- (this.objects[index+96].material.diffuseColor.b /10 + (this.audioManager.soundArrays[5])[index+32]/255);
            this.objects[index+128].material.diffuseColor.g = 1- (this.objects[index+128].material.diffuseColor.b /10 + (this.audioManager.soundArrays[4])[index+32]/255);
            this.objects[index+160].material.diffuseColor.g = 1- (this.objects[index+160].material.diffuseColor.b /10 + (this.audioManager.soundArrays[3])[index+32]/255);
            this.objects[index+192].material.diffuseColor.g = 1- (this.objects[index+192].material.diffuseColor.b /10 + (this.audioManager.soundArrays[2])[index+32]/255);
            this.objects[index+224].material.diffuseColor.g = 1- (this.objects[index+224].material.diffuseColor.b /10 + (this.audioManager.soundArrays[1])[index+32]/255);
            this.objects[index+256].material.diffuseColor.g = 1- (this.objects[index+256].material.diffuseColor.b /10 + (this.audioManager.soundArrays[0])[index+32]/255);



            // this.objects[index].material.diffuseColor.r     = 8* this.objects[index].scaling.y/255;
            // this.objects[index+32].material.diffuseColor.r  = 8* this.objects[index+32].scaling.y/255;
            // this.objects[index+64].material.diffuseColor.r  = 8* this.objects[index+64].scaling.y/255;
            // this.objects[index+96].material.diffuseColor.r  = 8* this.objects[index+96].scaling.y/255;
            // this.objects[index+128].material.diffuseColor.r = 8* this.objects[index+128].scaling.y/255;
            // this.objects[index+160].material.diffuseColor.r = 8* this.objects[index+160].scaling.y/255;
            // this.objects[index+192].material.diffuseColor.r = 8* this.objects[index+192].scaling.y/255;
            // this.objects[index+224].material.diffuseColor.r = 8* this.objects[index+224].scaling.y/255;
            // this.objects[index+256].material.diffuseColor.r = 8* this.objects[index+256].scaling.y/255;

            // this.objects[index].material.diffuseColor.g     = 1- 4* this.objects[index].scaling.y/255;
            // this.objects[index+32].material.diffuseColor.g  = 1- 4* this.objects[index+32].scaling.y/255;
            // this.objects[index+64].material.diffuseColor.g  = 1- 4* this.objects[index+64].scaling.y/255;
            // this.objects[index+96].material.diffuseColor.g  = 1- 4* this.objects[index+96].scaling.y/255;
            // this.objects[index+128].material.diffuseColor.g = 1- 4* this.objects[index+128].scaling.y/255;
            // this.objects[index+160].material.diffuseColor.g = 1- 4* this.objects[index+160].scaling.y/255;
            // this.objects[index+192].material.diffuseColor.g = 1- 4* this.objects[index+192].scaling.y/255;
            // this.objects[index+224].material.diffuseColor.g = 1- 4* this.objects[index+224].scaling.y/255;
            // this.objects[index+256].material.diffuseColor.g = 1- 4* this.objects[index+256].scaling.y/255;



        }




            // let r = y/4;
            // let b = y;
            // let g = y/4;

            // // let color = new BABYLON.Color4(r*2, g*2, b*2, 1, false);

            // o.material.diffuseColor.r = r/255;
            // o.material.diffuseColor.g = g/255;
            // o.material.diffuseColor.b = b/255;



            // // o.material.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
            // // o.material.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
            // o.material.emissiveColor.r = r/255;
            // o.material.emissiveColor.g = g/255;
            // o.material.emissiveColor.b = b/255;


    }

    remove() {

        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.master.dispose();
        this.master = null;

    }
}