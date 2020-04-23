import {
    BaseObject
} from './BaseObject.js';


export class Star extends BaseObject {

    constructor(name, parent, palette, material, resolution, reflect, eventBus, scene, dataSource) {

        super(name, parent, palette, material, resolution, reflect, eventBus, scene, dataSource);

        ////////////////////////////
        // class specific variables

        this.innerStartIndex = 0;
        this.outerStartIndex = 1;

        this.innerSlices = 8;
        this.outerSlices = 8;

        this.innerRadius = 90;
        this.outerRadius = 95;

        this.xRotationDelta = 0;
        this.yRotationDelta = 0;
        this.zRotationDelta = 0;

        this.innerPath = [];
        this.outerPath = [];

        // oscillates for the up/down of data points on each pie slice
        this.innerIndexDirection = -1;
        this.outerIndexDirection = -1;

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);

        this.create();

        var self = this;
        this.eventBus.subscribe("eventTest", eventTestCallback);

        function eventTestCallback() {
            // console.log("Event Received from " + self.name);
            // console.log("My position is " + self.mesh.position);
            self.testCallback();
        }
        this.eventBus.unsubscribe("eventTest", eventTestCallback);

    }

    testCallback() {
        // console.log("method test from: " + this.name);
    }

    create() {
        for (let r = 1; r <= 2; r++) {
            let path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / this.resolution) {

                let x = r * Math.cos(theta);
                let z = r * Math.sin(theta);
                let y = 0;

                path.push(new BABYLON.Vector3(x, y, z));
            }
            this.paths.push(path);
        }

        this.mesh = BABYLON.Mesh.CreateRibbon("ribbon", this.paths, true, true, 0, this.scene, true, this.sideO);
        this.mesh.material = this.material;

        if (this.reflect) {
            this.reflect.addToRenderList(this.mesh);
        }

        return this.mesh;
    }

    update(zindex) {

        let data = this.dataSource;

        // Rotation imposes the rotation order YXZ in local space using Euler angles.
        this.mesh.rotation.y += this.yRotationDelta;
        this.mesh.rotation.x += this.xRotationDelta;
        this.mesh.rotation.z += this.zRotationDelta;
        this.innerIndexDirection = -1; // this.innerIndexDirection to traverse the frDataArray, flips to positive at start
        this.outerIndexDirection = -1; // this.outerIndexDirection to traverse the frDataArray, flips to positive at start
        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray
        this.paths = [];
        this.innerPath = [];
        this.outerPath = [];

        for (let theta = 0; theta <= 2 * Math.PI; theta += 2 * Math.PI / this.resolution) {
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

        this.paths.push(this.innerPath);
        this.paths.push(this.outerPath);

        this.mesh = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: this.paths,
            instance: this.mesh
        });

        return `${this.name} says updated from star.`;
    }

    remove() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        super.remove();
    }

    setOptions(p_innerStartIndex, p_outerStartIndex, p_innerSlices, p_outerSlices, p_innerRadius, p_outerRadius, p_resolution, p_reflect, p_xRotation, p_yRotation, p_zRotation) {
        // reset other things in here too like color, reset rotations

        // this.innerStartIndex = p_innerStartIndex ? p_innerStartIndex : this.innerStartIndex;
        // this.outerStartIndex = p_outerStartIndex ? p_outerStartIndex : this.outerStartIndex;

        this.innerSlices = p_innerSlices ? p_innerSlices : this.innerSlices;
        this.outerSlices = p_outerSlices ? p_outerSlices : this.outerSlices;

        // this.innerRadius = p_innerRadius ? p_innerRadius : this.innerRadius;
        // this.outerRadius = p_outerRadius ? p_outerRadius : this.outerRadius;

        this.resolution = p_resolution ? p_resolution : this.resolution;

        this.reflect = p_reflect ? p_reflect : this.reflect;

        this.xRotationDelta = p_xRotation ? p_xRotation : this.xRotationDelta;
        this.yRotationDelta = p_yRotation ? p_yRotation : this.yRotationDelta;
        this.zRotationDelta = p_zRotation ? p_zRotation : this.zRotationDelta;

        /////////////////////////////////////////////////////////

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);
    }

}