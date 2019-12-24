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

        this.over = false;
        this.overcallback = null;
        this.overcallbackargs = null;
        this.repeat = false;
    }

    endAnimation() {
        if (this.overcallback != null)
            this.overcallback(...this.overcallbackargs);

        this.over = true;
    }

    onAnimationOver(func, ...args) {
        this.overcallback = func;
        this.overcallbackargs = args;
    }

    update(t) { }

    apply() { }
}
