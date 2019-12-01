class CheckerBoardFloor extends CGFobject {
    constructor(scene, size) {
        super(scene);
        const halfSize = size / 2.0;

        this.floorSquare = new MyRectangle(scene, null, -halfSize, halfSize,
            -halfSize, halfSize);

        this.floorMaterial = new CGFappearance(scene);
        this.floorMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.floorMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.floorMaterial.setSpecular(0.7, 0.7, 0.7, 1.0);
        this.floorMaterial.setShininess(10.0);
        this.floorMaterial.loadTexture('scenes/images/checkerFloor.jpg');
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(- Math.PI / 2, 1, 0, 0);
        this.floorMaterial.apply();
        this.floorSquare.display();
        this.scene.popMatrix();
    }
}
