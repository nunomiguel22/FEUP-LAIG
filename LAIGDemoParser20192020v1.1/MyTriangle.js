/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.initBuffers();

	}
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0.0,	//0
			this.x2, this.y2, 0.0,	//1
			this.x3, this.y3, 0.0,	//2
			this.x1, this.y1, 0.0, //0
			this.x2, this.y2, 0.0, //1
			this.x3, this.y3, 0.0 //2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			3, 5, 4
		];

		//Normals
		this.normals = [];

		for (var i = 0; i < 3; i++)
			this.normals.push(0, 0, 1);

		for (var i = 0; i < 3; i++)
			this.normals.push(0, 0, -1);

		//Texture coordinates
		this.texCoords = [
			0, 1,
			0, 0,
			1, 0,
			0, 1,
			0, 0,
			1, 0
		];
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
