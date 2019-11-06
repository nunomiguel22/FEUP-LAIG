/**
* MySecurityCamera
* @constructor
*
* TODO
*/
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);



        this.initBuffers();
    }

    initBuffers() {

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
