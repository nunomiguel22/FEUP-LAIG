/**
* MySphere
* @constructor
*/
class MySphere extends CGFobject {
    constructor(scene, radius, slices, rings) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.rings = rings;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let sliceStep = 2 * Math.PI / this.slices;
        let ringStep = Math.PI / this.rings;

        for (let i = 0; i <= this.rings; ++i) {
            let ringAngle = Math.PI / 2 - ringStep * i;
            let xyRingAngle = this.radius * Math.cos(ringAngle);
            let z = this.radius * Math.sin(ringAngle);

            let vert1 = i * (this.slices + 1);
            let vert2 = vert1 + this.slices + 1;

            for (let j = 0; j <= this.slices; ++j) {
                /* Vertices */
                let sliceAngle = j * sliceStep;
                let x = xyRingAngle * Math.cos(sliceAngle);
                let y = xyRingAngle * Math.sin(sliceAngle);
                this.vertices.push(x, y, z);

                /* Indices, exclude first and last ring */
                if (i != this.rings && j != this.slices) {
                    /* Top triangle*/
                    if (i != 0)
                        this.indices.push(vert1, vert2, vert1 + 1); //vert 3 = vert 1 + 1
                    /* Bottom triangle*/
                    if (i != this.rings - 1)
                        this.indices.push(vert1 + 1, vert2, vert2 + 1); //vert 4 = vert 2 + 1
                    ++vert1;
                    ++vert2;
                }

                /* Normals */
                this.normals.push(x, y, z);

                /* Texture Coordinates*/
                this.texCoords.push(j * 1 / this.slices, i * 1 / this.rings);
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
