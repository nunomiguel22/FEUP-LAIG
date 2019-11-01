/**
 * Abstract Class
 * @constructor
 */
class Keyframe {
    constructor(instant, translation, rotation, scale) {
        this.instant = instant * 1000;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
}
