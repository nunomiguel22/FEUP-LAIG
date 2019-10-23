/**
 * GraphNode
 * @constructor
 * @param sceneGraph - Reference to MySceneGraph object
 * @param id - Node ID
 * @param material - Material ID
 * @param texture - Texture ID
 * @param length_s - Texture amplifier for s coordinates
 * @param length_t - Texture amplifier for t coordinates
 * @param transform - Transformations for component
 */
class GraphNode {

    constructor(sceneGraph, id, material, texture, length_s, length_t, transform) {
        this.graph = sceneGraph;
        this.id = id;
        this.material = material;
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
        this.transformation = transform;
        this.materialIter = 0;

        this.children = [];
        this.primitives = [];
    }

    pushChild(childID) {
        this.children.push(childID);
    }

    pushPrimitive(primitiveID) {
        this.primitives.push(primitiveID);
    }

    cycleMaterial() {
        let nextIter = this.materialIter + 1;
        this.materialIter = (nextIter == this.material.length) ? 0 : nextIter;
    }

    display(fatherMaterial, fatherTexture, fatherLength_s, fatherLength_t) {
        //Transformation
        this.graph.scene.pushMatrix();
        if (this.transformation != null)
            this.graph.scene.multMatrix(this.transformation);

        //Materials
        let compMat;
        if (this.material[this.materialIter] == 'inherit')
            compMat = fatherMaterial;
        else compMat = this.material[this.materialIter];

        //Textures
        let compTex;
        let compLength_s;
        let compLength_t;
        switch (this.texture) {
            case 'inherit': {
                compTex = fatherTexture;
                compLength_s = fatherLength_s;
                compLength_t = fatherLength_t;
                break;
            }
            case 'none': {
                compTex = null;
                compLength_s = 0;
                compLength_t = 0;
                break;
            }
            default: {
                compTex = this.texture;
                compLength_s = this.length_s;
                compLength_t = this.length_t;
                break;
            }
        }

        //Apply material/texture

        let currentMat = this.graph.materials[compMat];
        let currentTex = this.graph.textures[compTex];
        if (currentMat != null) {
            currentMat.setTexture(currentTex);
            currentMat.apply();
        }
        //Draw child primitives
        for (let i = 0; i < this.primitives.length; ++i) {
            this.graph.primitives[this.primitives[i]].amplifyTexCoords(compLength_s, compLength_t);
            this.graph.primitives[this.primitives[i]].display();
            this.graph.primitives[this.primitives[i]].resetTexCoords();
        }

        //Draw child components
        for (let i = 0; i < this.children.length; ++i)
            this.graph.components[this.children[i]].display(compMat, compTex, compLength_s, compLength_t);

        this.graph.scene.popMatrix();
    }
}
