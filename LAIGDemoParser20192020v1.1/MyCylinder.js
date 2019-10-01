/**
* MyCilinder
* @constructor
*/
class MyCylinder extends CGFobject {
    constructor(scene, slices, minComplexity, maxComplexity) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
        this.minComplexity = minComplexity;
        this.complexityDelta = (maxComplexity - minComplexity);
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var alphaAng = 2 * Math.PI / this.slices;
        var m = 2 * this.slices; // ensure indices wrap around

        for (var i = 0; i < this.slices; i++) {
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var angle = i * alphaAng;
            var x = Math.cos(angle);
            var z = Math.sin(angle);

            this.vertices.push(
                x, 0, z,
                x, 1, z
            );

            this.normals.push(
                x, 0, z,
                x, 0, z
            );

            this.indices.push(
                2 * i, 2 * i + 1, (2 * (i + 1)) % m,
                (2 * (i + 1)) % m, 2 * i + 1, (2 * (i + 1)) % m + 1
            );

            this.texCoords.push(0.5, 0.0);
            this.texCoords.push(0.0, 1.0);
            this.texCoords.push(1.0, 1.0);

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = this.minComplexity + Math.round(this.complexityDelta * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}
