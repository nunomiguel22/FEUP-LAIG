class CGFextendedCamera extends CGFcamera {
    constructor(fov, near, far, position, target) {
        super(fov, near, far, position, target);
        this.originalFov = fov;
        this.originalNear = near;
        this.originalFar = far;
        this.originalPosition = position;
        this.originalTarget = target;

        this.currentNear = near;
        this.currentFar = far;
        this.currentPosition = vec3.fromValues(position.x, position.y, position.z);
        this.currentTarget = vec3.fromValues(target.x, target.y, target.z);

        this.overcallback = null;
        this.overcallbackargs = null;

        // Camera animation
        this.stopAnimation();
    }

    static swapSceneCamera(scene, camera, keepModelTransform) {
        scene.camera = camera;
        scene.updateProjectionMatrix();
        CGFextendedCamera.transform = scene.getMatrix();
        scene.loadIdentity();
        scene.applyViewMatrix();
        if (keepModelTransform)
            scene.multMatrix(transform);
    }

    static applyPreviousTransform(scene) { scene.multMatrix(CGFextendedCamera.transform); }

    reset() {
        this._viewMatrix = mat4.create(1);
        this._up = vec3.fromValues(0, 1, 0);
        this.setPosition(this.originalPosition);
        this.setTarget(this.originalTarget);
        this.overcallback = null;
        this.overcallbackargs = null;

    }

    animateToCamera(camera, durationMS) {
        this.destCamera = camera;
        this.destTarget = camera.originalTarget;
        this.destPosition = camera.originalPosition;
        this.animate = true;
        this.animationDuration = durationMS;
    }

    stopAnimation() {
        this.animate = false;
        this.firstTime = 0;
        this.animationDuration = null;
        this.destTarget = null;
        this.destPosition = null;
        this.destCamera = null;
        if (this.overcallback != null)
            this.overcallback(...this.overcallbackargs);
    }



    onAnimationOver(func, ...args) {
        this.overcallback = func;
        this.overcallbackargs = args;
    }

    update(t) {
        if (!this.animate)
            return;

        if (!this.firstTime)
            this.firstTime = t;

        let instantMS = t - this.firstTime;
        let timeFactor = instantMS / this.animationDuration;

        vec3.lerp(this.currentPosition, this.originalPosition, this.destPosition, timeFactor);
        vec3.lerp(this.currentTarget, this.originalTarget, this.destTarget, timeFactor);
        this.setPosition(this.currentPosition);
        this.setTarget(this.currentTarget);

        if (instantMS >= this.animationDuration)
            this.stopAnimation();
    }
}
