/**
* MyPatch
* @constructor
* @param scene - Reference to XMLscene object
* @param nPointsU - Number of control points on the U coordinate
* @param nPointsV - Number of control points on the V coordinate
* @param nPartsU - Number of subdivisions on the U coordinate
* @param nPartsV - Number of subdivisions on the V coordinate
* @param controlPoints - Array with control points for the nurbs surface
*/
class MyPatch extends CGFnurbsObject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {


        let surface = new CGFnurbsSurface(npointsU - 1, npointsV - 1, controlPoints);

        super(scene, npartsU, npartsV, surface);

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = controlPoints;

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

