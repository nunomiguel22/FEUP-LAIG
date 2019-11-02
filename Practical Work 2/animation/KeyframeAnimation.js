/**
 * KeyframeAnimation class
 * @constructor
 */
class KeyframeAnimation extends Animation {
    constructor(sceneGraph) {
        super(sceneGraph);
        this.keyframes = [];
        this.translVec = vec3.create();
        this.rotateVec = vec3.create();
        this.scalVec = vec3.create();
        this.addKeyframe(new Keyframe(0, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1)));
        this.reset();
    }

    addKeyframe(keyframe) { this.keyframes.push(keyframe); }

    update(t) {
        let instantMS = t - this.firstFrame; //Get time into current keyframe
        mat4.identity(this.currentTransform); //Reset transformation matrix
        let timeFactor = instantMS / this.keyframeDuration; //Time factor for the interpolation

        // Interpolate translation, rotation and scaling
        vec3.lerp(this.translVec, this.keyframes[this.previousKeyframe].translation, this.keyframes[this.activeKeyframe].translation, timeFactor);
        vec3.lerp(this.rotateVec, this.keyframes[this.previousKeyframe].rotation, this.keyframes[this.activeKeyframe].rotation, timeFactor);
        vec3.lerp(this.scalVec, this.keyframes[this.previousKeyframe].scale, this.keyframes[this.activeKeyframe].scale, timeFactor);

        // Apply interpolated values to matrix
        mat4.translate(this.currentTransform, this.currentTransform, this.translVec);
        mat4.rotateX(this.currentTransform, this.currentTransform, this.rotateVec[0]);
        mat4.rotateY(this.currentTransform, this.currentTransform, this.rotateVec[1]);
        mat4.rotateZ(this.currentTransform, this.currentTransform, this.rotateVec[2]);
        mat4.scale(this.currentTransform, this.currentTransform, this.scalVec);

        // Switch to next keyframe(if there is one) when current keyframe is complete
        if (instantMS - this.keyframeDuration >= 0)
            this.nextKeyframe(t);
    }

    nextKeyframe(t) {
        this.firstFrame = t;
        this.previousKeyframe = this.activeKeyframe++;
        if (this.activeKeyframe < this.keyframes.length)
            this.keyframeDuration = this.keyframes[this.activeKeyframe].instant - this.keyframes[this.previousKeyframe].instant;
        else this.reset(); // End of animation
        this.update(t);
    }

    apply() { this.graph.scene.multMatrix(this.currentTransform); }

    reset() {
        this.activeKeyframe = 0;
        this.previousKeyframe = 0;
        this.keyframeDuration = 0;
        this.firstFrame = 0;
    }
}
