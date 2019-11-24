/**
* MyNurbsCilinder
* @constructor
* @param scene - Reference to XMLscene object
* @param base - Radius of the base of the cylinder
* @param top - Radius of the top of the cylinder
* @param height - Height of the cylinder
* @param slices - Number of slice subdivisions
* @param stacks - Number of stacks subdiivions
*/
class MyNurbsCylinder extends CGFnurbsObject {
    constructor(scene, base, top, height, slices, stacks) {
        const radiusAngle = Math.PI / 4;

        let controlVertexes =
            [	// U = 0
                [ // V = 0..1
                    [base, 0.0, -height, 1],
                    [top, 0.0, height, 1]
                ],
                // U = 1
                [ // V = 0..1
                    [base, base, -height, radiusAngle],
                    [top, top, height, radiusAngle]
                ],
                // U = 2
                [ // V = 0..1							 
                    [0.0, base, -height, 1],
                    [0.0, top, height, 1]
                ],
                // U = 3
                [ // V = 0..1
                    [-base, base, -height, radiusAngle],
                    [-top, top, height, radiusAngle]
                ],
                // U = 4
                [ // V = 0..1
                    [-base, 0.0, -height, 1],
                    [-top, 0.0, height, 1]
                ],
                // U = 5
                [ // V = 0..1
                    [-base, -base, -height, radiusAngle],
                    [-top, -top, 2.0, radiusAngle]
                ],
                // U = 6
                [ // V = 0..1							 
                    [0.0, -base, -height, 1],
                    [0.0, -top, height, 1]
                ],
                // U = 7
                [ // V = 0..1
                    [base, -base, -height, radiusAngle],
                    [top, -top, height, radiusAngle]
                ],
                // U = 8
                [ // V = 0..1
                    [base, 0.0, -height, 1],
                    [top, 0.0, height, 1]
                ]
            ];

        let surface = new CGFnurbsSurface(8, 1, controlVertexes);

        super(scene, slices, stacks, surface);

        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.baseTexCoords = [...this.texCoords];
    }

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

