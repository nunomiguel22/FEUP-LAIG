class GLString {

    constructor(scene, string) {
        this.scene = scene;
        this.textRenderer = this.scene.textRenderer;
        this.alignment = "left";
        this.alignmentValue = 0;
        this.updateString(string);
        this.size = 1.0;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.spacing = 1.0;
        this.position = [0.0, 0.0, 0.0];
        this.rotation = [0.0, 0.0, 0.0];
    }

    hasRotation() { return this.rotation[0] || this.rotation[1] || this.hasRotation[2]; }

    setSize(size) { this.size = size; }
    setPosition(position) { this.position = position; }
    rotateRadians(rotation) { this.rotation = rotation; }

    rotateDegrees(rotation) {
        const degreesToRadians = Math.PI / 180;
        rotation[0] *= degreesToRadians;
        rotation[1] *= degreesToRadians;
        rotation[2] *= degreesToRadians;
        this.rotation = rotation
    }

    setAlignment(alignment) {
        this.alignment = alignment;
        this.updateString(this.string);
    }
    setColor(color) { this.color = color; }

    updateString(string) {
        this.string = string;

        switch (this.alignment) {
            case "left": {
                this.alignmentValue = 0;
                break;
            }
            case "center": {
                this.alignmentValue = -this.string.length / 2.0;
                break;
            }
            case "right": {
                this.alignmentValue = -this.string.length;
                break;
            }
            default: this.alignmentValue = 0; break;
        }
    }

    display() {
        this.textRenderer.displayString(this.string, this.size, this.color, this.position,
            this.alignmentValue, this.rotation);
    }
}
