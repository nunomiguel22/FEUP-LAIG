/**
 * Animation class, abstract class for all animations
 * @constructor
 * @param {sceneGraph} sceneGraph  Reference to the scene's graph
 */
class Animation {
    constructor(sceneGraph) {
        this.graph = sceneGraph;
        this.currentTransform = mat4.create();
        mat4.identity(this.currentTransform);
    }

    update(t) { }

    apply() { }
}
