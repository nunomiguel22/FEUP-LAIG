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
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
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
