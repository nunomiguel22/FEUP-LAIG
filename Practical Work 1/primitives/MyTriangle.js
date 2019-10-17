/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - X Coordinate for vertice 1
 * @param y1 - Y Coordinate for vertice 1
 * @param z1 - Z Coordinate for vertice 1
 * @param x2 - X Coordinate for vertice 2
 * @param y2 - Y Coordinate for vertice 2
 * @param z2 - Z Coordinate for vertice 2
 * @param x3 - X Coordinate for vertice 3
 * @param y3 - Y Coordinate for vertice 3
 * @param z3 - Z Coordinate for vertice 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {
		this.baseTexCoords = [];

		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
			this.x1, this.y1, this.z1, //0
			this.x2, this.y2, this.z2, //1
			this.x3, this.y3, this.z3 //2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			3, 5, 4
		];

		//Normals
		this.normals = [];

		let v1 = vec3.fromValues(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
		let v2 = vec3.fromValues(this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1);
		let normal = vec3.create();
		vec3.cross(normal, v1, v2);

		for (let i = 0; i < 3; ++i) {
			this.normals.push(normal[0]);
			this.normals.push(normal[1]);
			this.normals.push(normal[2]);
		}
		for (let i = 0; i < 3; ++i) {
			this.normals.push(-normal[0]);
			this.normals.push(-normal[1]);
			this.normals.push(-normal[2]);
		}

		//Textures
		let dist_a = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) + Math.pow(this.z2 - this.z3, 2));
		let dist_b = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
		let dist_c = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2) + Math.pow(this.z1 - this.z2, 2));

		let cosBeta = (Math.pow(dist_a, 2) - Math.pow(dist_b, 2) + Math.pow(dist_c, 2)) / (2 * dist_a * dist_c);
		let sinBeta = Math.sqrt(1 - Math.pow(cosBeta, 2));
		let dist_d = dist_a * sinBeta;

		let max = Math.max.apply(Math, [dist_c, dist_a, dist_b, dist_d]);

		dist_a /= max;
		dist_b /= max;
		dist_c /= max;
		dist_d /= max;

		this.texCoords = [dist_c - dist_a * cosBeta, 1 - dist_d, dist_c, 1, 0, 1];
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
		for (let i = 0; i < this.texCoords.length; ++i) {
			this.texCoords[i] = this.texCoords[i] / length_s;
			this.texCoords[++i] = this.texCoords[i] / length_t;
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
