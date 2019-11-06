/**
* Plane
* @constructor
*
* TODO
*/
class Plane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.initBuffers();
    }

    initBuffers() {

        /**
         * TODO: Create NURBS plane with npartsU * npartsV subdivisions
         */

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
