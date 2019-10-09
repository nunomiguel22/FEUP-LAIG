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

        this.children = [];
        this.primitives = [];
    }

    pushChild(childID) {
        this.children.push(childID);
    }

    pushPrimitive(primitiveID) {
        this.primitives.push(primitiveID);
    }

    display() {

        this.graph.materials[this.material].setTexture(this.graph.textures[this.texture]);
        this.graph.materials[this.material].apply();

        for (let i = 0; i < this.primitives.length; ++i) {
            this.graph.primitives[this.primitives[i]].display();
        }

    }

}
