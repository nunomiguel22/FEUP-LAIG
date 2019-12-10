
class CheckerPiece extends CGFOBJModel {

    constructor(scene, model, type) {
        super(scene);
        this.type = type;
        this.model = model;
    }

    display() {
        this.model.display();
    }

    updateTexCoords(coords) {
        this.model.updateTexCoords(coords);
    }

    amplifyTexCoords(length_s, length_t) {
        this.model.amplifyTexCoords(length_s, length_t);
    }

    resetTexCoords() {
        this.model.resetTexCoords();
    }

}
