/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Rectangle name
 * @param x1 - First point in the X axis
 * @param x2 - Second point in the X axis
 * @param y1 - First point in the Y axis
 * @param y2 - Second point in the Y axis
 */
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.id = id;

		this.initBuffers();
	}

	initBuffers() {
		this.baseTexCoords = [];

		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			1, 2, 0,
			1, 3, 2,
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 0,
			1, 0,
			0, 1,
			1, 1
		]
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
		this.baseTexCoords = [...this.texCoords]
		this.updateTexCoordsGLBuffers();
	}
	/**
	 * @method amplifyTexCoords
	 * Amplify the list of texture coordinates by an S and T factor
	 * @param length_s - S amplification factor
	 * @param length_t - T amplification factor
	 */
	amplifyTexCoords(length_s, length_t) {
		for (let i = 0; i < this.texCoords.length; ++i) {
			this.texCoords[i] /= length_s;
			this.texCoords[++i] /= length_t;
		}
		this.updateTexCoordsGLBuffers();
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

