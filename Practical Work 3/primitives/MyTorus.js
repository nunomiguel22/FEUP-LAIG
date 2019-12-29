/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - Inner radius
 * @param outer - Outer radius
 * @param slices - Torus complexity in slices
 * @param loops - Torus complexity in loops
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();

    }
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];
        this.baseTexCoords = [];

        for (let i = 0; i <= this.slices; ++i) {
            let slice = i / this.slices;
            let sliceAngle = slice * 2 * Math.PI;
            let sliceCos = Math.cos(sliceAngle);
            let sliceSin = Math.sin(sliceAngle);
            let sliceRad = this.outer + this.inner * sliceCos;

            for (let j = 0; j <= this.loops; ++j) {
                let loop = j / this.loops;
                let loopAngle = loop * 2 * Math.PI;
                let loopCos = Math.cos(loopAngle);
                let loopSin = Math.sin(loopAngle);

                this.vertices.push(sliceRad * loopCos, sliceRad * loopSin,
                    this.inner * sliceSin);
                this.normals.push(loopCos * sliceSin, loopSin * sliceSin,
                    sliceCos);
                this.texCoords.push(slice, loop);
            }
        }

        let vertsPerSlice = this.loops + 1;
        for (let i = 0; i < this.slices; ++i) {
            let vert1 = i * vertsPerSlice;
            let vert2 = vert1 + vertsPerSlice;
            for (let j = 0; j < this.loops; ++j) {
                this.indices.push(vert1, vert1 + 1, vert2);
                this.indices.push(vert2, vert1 + 1, vert2 + 1);

                ++vert1; ++vert2;
            }
        }
        this.baseTexCoords = [...this.texCoords]
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
	/**
	 * @method amplifyTexCoords
	 * Amplify the list of texture coordinates by an S and T factor
	 * @param length_s - S amplification factor
	 * @param length_t - T amplification factor
	 */
    amplifyTexCoords(length_s, length_t) {
        if (length_s != 1 || length_t != 1) {
            for (let i = 0; i < this.texCoords.length; ++i) {
                this.texCoords[i] /= length_s;
                this.texCoords[++i] /= length_t;
            }
            this.updateTexCoordsGLBuffers();
            return true;
        }
        return false;
    }
	/**
	 * @method updateTexCoords
	 * Resets the list of texture coordinates to the initial values
	 */
    resetTexCoords() {
        this.texCoords = [...this.baseTexCoords]
        this.updateTexCoordsGLBuffers();
    }
}
