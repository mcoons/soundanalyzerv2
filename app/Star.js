import {
    BaseObject
} from './BaseObject.js';

export class Star extends BaseObject{
    constructor(name, parent, palette, material, scene, options) {

        super(name, parent, palette, material, scene);

        this.innerStartIndex = options.innerStartIndex ? options.innerStartIndex : 0;
        this.outerStartIndex = options.outerStartIndex ? options.outerStartIndex : 0;

        this.innerSlices = options.innerSlices ? options.innerSlices : 8;
        this.outerSlices = options.outerSlices ? options.outerSlices : 8;
        
        this.innerR = options.innerR ? options.innerR : 0;
        this.outerR = options.outerR ? options.outerR : 16;

        this.innerPath = [];
        this.outerPath = [];
        
        this.innerDirection = -1; 
        this.outerDirection = -1; 

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray
        
        this.innerItemsDesired = 128/this.innerSlices;
        this.outerItemsDesired = 128/this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);

        this.create();

    }

    create(){

        let dataIndex = 3; // index into the frDataArray
        let direction = -1; // direction to traverse the frDataArray, flips to positive at start
        let itemsDesired = 32;
        let startIndex = 0;
        let endIndex = startIndex + Math.round(itemsDesired / 8);

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 128) {
                if (dataIndex >= endIndex || dataIndex <= startIndex) direction = -direction;

                let x = 3 * r * Math.cos(theta) * dataIndex;
                let z = 3 * r * Math.sin(theta) * dataIndex;
                let y = -.01;

                path.push(new BABYLON.Vector3(x, y, z));
                dataIndex += direction;
            }
            this.paths.push(path);
        }

        this.mesh = BABYLON.Mesh.CreateRibbon("ribbon", this.paths, false, true, 0, this.scene, true, this.sideO);
        // this.mesh.parent = starMaster;

        this.mesh.material = this.material;

        return this.mesh;
    }

    update(data, zindex){

        this.paths = [];

        this.innerDirection = -1; // this.innerDirection to traverse the frDataArray, flips to positive at start
        this.outerDirection = -1; // this.outerDirection to traverse the frDataArray, flips to positive at start

        this.innerPath = [];
        this.outerPath = [];

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray
        
        for (let theta = 0; theta <= 2 * Math.PI; theta += 2 * Math.PI / 256) {

            if (this.innerDataIndex >= this.innerEndIndex || this.innerDataIndex <= this.innerStartIndex) this.innerDirection = -this.innerDirection;
            if (this.outerDataIndex >= this.outerEndIndex || this.outerDataIndex <= this.outerStartIndex) this.outerDirection = -this.outerDirection;

            let innerX = data[this.innerDataIndex] * this.innerR * Math.cos(theta) / 100;
            let innerZ = data[this.innerDataIndex] * this.innerR * Math.sin(theta) / 100;
            let innerY = -.01*zindex;

            let outerX = data[this.outerDataIndex] * this.outerR * Math.cos(theta) / 100;
            let outerZ = data[this.outerDataIndex] * this.outerR * Math.sin(theta) / 100;
            let outerY = -.01*zindex;

            this.innerPath.push(new BABYLON.Vector3(innerX, innerY, innerZ));
            this.outerPath.push(new BABYLON.Vector3(outerX, outerY, outerZ));
            
            this.innerDataIndex += this.innerDirection;
            this.outerDataIndex += this.outerDirection;

        }

        this.paths.push(this.innerPath);
        this.paths.push(this.outerPath);

        this.mesh = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: this.paths,
            instance: this.mesh
        });

        return `${this.name} says updated from star.`;
    }

    // destroy(){
    //     return `${this.name} says destroyed from star.`;
    // }
}