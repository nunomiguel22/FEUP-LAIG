/**
* MyPlane
* @constructor
* @param scene - Reference to XMLscene object
* @param nPartsU - Number of subdivisions on the U coordinate
* @param nPartsV - Number of subdivisions on the V coordinate
*/
class MyPlane extends CGFnurbsObject {
    constructor(scene, npartsU, npartsV) {
        let controlVertexes = [
            // U = 0
            [ // V = 0..1							 
                [0.5, 0.0, -0.5, 1],
                [0.5, 0.0, 0.5, 1]
            ],
            // U = 1
            [ // V = 0..1
                [-0.5, 0.0, -0.5, 1],
                [-0.5, 0.0, 0.5, 1]
            ]

        ];
        let surface = new CGFnurbsSurface(1, 1, controlVertexes);

        super(scene, npartsU, npartsV, surface);

        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.baseTexCoords = [...this.texCoords];
    }

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
