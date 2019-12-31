
export class BaseObject{
    constructor(name, parent, palette, material, resolution, reflect, scene) {
        this.name = name;
        this.parent = parent;
        this.palette = palette;
        this.material = material;
        this.resolution = resolution;
        this.reflect = reflect;
        this.scene = scene;

        this.mesh = null;
        this.paths = [];
        this.sideO = BABYLON.Mesh.BACKSIDE;
    }

    create(){
        return `${this.name} says create from BaseObject: ${this.mesh}`;
    }

    update(){
        return `${this.name} says update from BaseObject: ${this.mesh}`;
    }

    destroy(){
        if (this.mesh) {
            this.mesh.dispose();
        }

        return `${this.name} says destroy from BaseObject: ${this.mesh}`;
    }
}