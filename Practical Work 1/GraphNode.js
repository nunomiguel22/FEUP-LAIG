/**
 * GraphNode
 * @constructor
 * @param sceneGraph - Reference to MySceneGraph object
 * @param id - Node ID
 */
class GraphNode {

    constructor(sceneGraph, id, material, texture, transform) {
        this.graph = sceneGraph;
        this.id = id;
        this.material = material;
        this.texture = texture;
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

    display(fatherMaterial, fatherTexture) {
        //Transformation
        this.graph.scene.pushMatrix();
        this.graph.scene.multMatrix(this.transformation);

        //Materials
        let compMat;
        if (this.material == 'inherit')
            compMat = fatherMaterial;
        else compMat = this.material[this.materialIter];

        //Textures
        let compTex;
        switch (this.texture) {
            case 'inherit': {
                compTex = fatherTexture;
                break;
            }
            case 'none': {
                compTex = null;
                break;
            }
            default: {
                compTex = this.texture;
                break;
            }
        }

        //Apply material/texture
        let currentMat = this.graph.materials[compMat];
        let currentTex = this.graph.textures[compTex];
        currentMat.setTexture(currentTex);
        currentMat.apply();

        //Draw child primitives
        for (let i = 0; i < this.primitives.length; ++i) {
            this.graph.primitives[this.primitives[i]].display();
        }

        //Draw child components
        for (let i = 0; i < this.children.length; ++i) {
            this.graph.components[this.children[i]].display(compMat, compTex);
        }

        this.graph.scene.popMatrix();
    }
}
