/**
 * Abstract Class
 * @constructor
 */
class Animation {
    constructor(sceneGraph) {
        this.graph = sceneGraph;
        this.currentTransform = mat4.create();
        mat4.identity(this.currentTransform);
    }

    update(t) {

    }

    apply() { }
}
