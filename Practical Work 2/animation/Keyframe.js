/**
 * Keyframe Class, this class contains the data of each keyframe
 * @constructor
 * @param {instant} instant  Keyframe instant in seconds
 * @param {translation} translation  vec3 with the translation transformation values (x, y, z)
 * @param {rotation} rotation  vec3 with rotation transformation (rx, ry, rz)
 * @param {scale} scale  vec3 with the translation scale values (x, y, z)
 */
class Keyframe {
    constructor(instant, translation, rotation, scale) {
        this.instant = instant * 1000;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
}
