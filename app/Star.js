import {
    BaseObject
} from './BaseObject.js';

export class Star extends BaseObject {

    constructor(name, parent, palette, material, resolution, reflect,  scene) {

        super(name, parent, palette, material, resolution, reflect, scene);

        ////////////////////////////
        // user definable variables

        this.innerStartIndex = 0;
        this.outerStartIndex = 0;

        this.innerSlices = 8;
        this.outerSlices = 8;

        this.innerRadius = 0;
        this.outerRadius = 16;

        this.xRotation = 0;
        this.yRotation = 0;
        this.zRotation = 0;
        
        /////////////////////////////
        // class privat4 variables
        
        this.innerPath = [];
        this.outerPath = [];
        
        this.innerIndexDirection = -1;
        this.outerIndexDirection = -1;
        
        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);


        this.create();

        // return this.mesh;
    }

    create() {

        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / this.resolution ) {

                let x = r * Math.cos(theta);
                let z = r * Math.sin(theta);
                let y = 0;

                
                path.push(new BABYLON.Vector3(x, y, z));
            }
            // console.log("path added");
            this.paths.push(path);
        }

        this.mesh = BABYLON.Mesh.CreateRibbon("ribbon", this.paths, true, true, 0, this.scene, true, this.sideO);
        this.mesh.material = this.material;

        if (this.reflect){
            this.reflect.addToRenderList(this.mesh);
        }

        // console.log("material created");
        // console.log(this.material);

        // console.log("mesh created");
        // console.log(this.mesh);

        return this.mesh;
    }

    update(data, zindex) {

        // Rotation imposes the rotation order YXZ in local space using Euler angles.
        this.mesh.rotation.y += this.yRotation;
        this.mesh.rotation.x += this.xRotation;
        this.mesh.rotation.z += this.zRotation;

        this.paths = [];

        this.innerIndexDirection = -1; // this.innerIndexDirection to traverse the frDataArray, flips to positive at start
        this.outerIndexDirection = -1; // this.outerIndexDirection to traverse the frDataArray, flips to positive at start

        this.innerPath = [];
        this.outerPath = [];

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray
 
        
        for (let theta = 0; theta <= 2 * Math.PI; theta += 2 * Math.PI / 256) {
            
            // console.log(this.innerDataIndex)
            // console.log(data[this.innerDataIndex])
            // inner range calculations
            if (this.innerDataIndex >= this.innerEndIndex || this.innerDataIndex <= this.innerStartIndex) this.innerIndexDirection = -this.innerIndexDirection;
            

            let innerX = data[this.innerDataIndex] * this.innerRadius * Math.cos(theta) / 100;
            let innerZ = data[this.innerDataIndex] * this.innerRadius * Math.sin(theta) / 100;
            let innerY = -.01 * zindex;
            this.innerDataIndex += this.innerIndexDirection;
            
            this.innerPath.push(new BABYLON.Vector3(innerX, innerY, innerZ));
            
            // outer range calculations
            if (this.outerDataIndex >= this.outerEndIndex || this.outerDataIndex <= this.outerStartIndex) this.outerIndexDirection = -this.outerIndexDirection;
            
            let outerX = data[this.outerDataIndex] * this.outerRadius * Math.cos(theta) / 100;
            let outerZ = data[this.outerDataIndex] * this.outerRadius * Math.sin(theta) / 100;
            let outerY = -.001 * zindex;
            this.outerDataIndex += this.outerIndexDirection;
            
            this.outerPath.push(new BABYLON.Vector3(outerX, outerY, outerZ));
        }

        // console.log(this.innerPath);
        this.paths.push(this.innerPath);
        this.paths.push(this.outerPath);

        this.mesh = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: this.paths,
            instance: this.mesh
        });

        return `${this.name} says updated from star.`;
    }

    setOptions(p_innerStartIndex, p_outerStartIndex, p_innerSlices, p_outerSlices, p_innerRadius, p_outerRadius, p_resolution, p_reflect, p_xRotation, p_yRotation, p_zRotation) {
        
        this.innerStartIndex = p_innerStartIndex ? p_innerStartIndex : this.innerStartIndex;
        this.outerStartIndex = p_outerStartIndex ? p_outerStartIndex : this.outerStartIndex;

        this.innerSlices = p_innerSlices ? p_innerSlices : this.innerSlices;
        this.outerSlices = p_outerSlices ? p_outerSlices : this.outerSlices;

        this.innerRadius = p_innerRadius ? p_innerRadius : this.innerRadius;
        this.outerRadius = p_outerRadius ? p_outerRadius : this.outerRadius;

        this.resolution = p_resolution ? p_resolution : this.resolution;

        this.reflect = p_reflect ? p_reflect : this.reflect;

        this.xRotation = p_xRotation ? p_xRotation : this.xRotation;
        this.yRotation = p_yRotation ? p_yRotation : this.yRotation;
        this.zRotation = p_zRotation ? p_zRotation : this.zRotation;

        /////////////////////////////////////////////////////////

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);
    }    

}