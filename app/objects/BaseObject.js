export class BaseObject {

    constructor(name, parent, palette, material, resolution, reflect, eventBus, scene, dataSource) {

        this.name = name;
        this.parent = parent;
        this.palette = palette;
        this.material = material;
        this.resolution = resolution;
        this.reflect = reflect;
        this.scene = scene;
        this.dataSource = dataSource;

        this.mesh = null;
        this.paths = [];
        this.sideO = BABYLON.Mesh.BACKSIDE;

        this.eventBus = eventBus;
    }

    create() {
        return `${this.name} reports create from BaseObject: ${this.mesh}`;
    }

    update() {
        return `${this.name} reports update from BaseObject: ${this.mesh}`;
    }

    remove() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        return `${this.name} reports destroy from BaseObject: ${this.mesh}`;
    }

}