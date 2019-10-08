/**
* MyCilinder
* @constructor
*/
class MyCylinder extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.base = base;
        this.top = top;
        this.height = height;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.defaultTextCoords = [];

        var alphaAng = 2 * Math.PI / this.slices; //diferença do angulo entre cada slice
        var radius = (this.top - this.base) / this.stacks; // diferença entre o tamanho de cada slice
        var stackheight = this.height / this.stacks; //Height para cada stack

        // para cada triangulo
        for (var i = 0; i <= this.slices; ++i) {

            for (var j = 0; j <= this.stacks; ++j) {

                var angle = i * alphaAng;
                var x = Math.cos(angle);
                var z = Math.sin(angle);

                this.vertices.push(
                    x * this.base + radius * j , 
                    z * this.base + radius *j,
                    j * stackheight
                );

                this.texCoords.push(i * 1 / this.slices,
                    i-( j * 1 / this.stacks));

                this.normals.push(x,z,0);            
            }
        }

        //para cada rectangulo
        for(var i= 0; i < this.slices; ++i){
            for(var j = 0; j < this.stacks; ++j)
            {
                this.indices.push((i+1) * (this.stacks + 1) + j,
                i* (this.stacks + 1) + j + 1,
                i * (this.stacks + 1) + j,
                i*(this.stacks + 1) + j + 1, (i+1) * (this.stacks + 1) + j,
                (i+1) * (this.stacks + 1) + j+1);
            }
        }

        this.defaultTextCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


	/**
	 * @method updateTexCoords
	 */
    updateTexCoords(s,t) {
        this.texCoords = this.defaultTextCoords.slice();

        for(var i=0; i < this.texCoords.length; i +=2)
        {
            this.texCoords[i] /=s;
            this.texCoords[i + 1] /=t;
        }

        this.updateTexCoordsGLBuffers();
    }
}
