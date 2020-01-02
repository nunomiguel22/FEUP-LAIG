class UIString {

    constructor(scene, string) {
        this.scene = scene;
        this.textRenderer = this.scene.textRenderer;

        // String Info
        this.setString(string);
        this.setColor(1.0, 1.0, 1.0, 1.0);
        this.setSpacing(1.0);
        this.setAlignment("left");
        this.setPosition(0.0, 0.0, 0.0);
        this.setSize(1.0);
        this.setRotationDegrees(0.0, 0.0, 0.0);
        this.setOrtho(false);
        this.setPickID(null);
    }

    display() {
        this.transformMatrix = [...this.scene.getMatrix()];
        this.textRenderer.strings.push(this);
    }

    setString(string) {
        this.string = string;
        this.setAlignment(this.alignment);
    }

    setColor(red, green, blue, alpha) { this.color = [red, green, blue, alpha]; }

    setSpacing(spacing) {
        this.spacing = spacing;
        this._updateSpacing();
    }

    setAlignment(alignment) {
        this.alignment = alignment;

        switch (this.alignment) {
            case "left": {
                this.alignmentValue = 0;
                break;
            }
            case "center": {
                this.alignmentValue = -this.string.length / 2.0 * this.spacingValue;
                break;
            }
            case "right": {
                this.alignmentValue = -this.string.length * this.spacingValue;
                break;
            }
            default: this.alignmentValue = 0; break;
        }
    }

    setPosition(x, y, z) { this.position = [x, y, z]; }

    setSize(size) {
        this.size = size;
        this._updateSpacing();
    }

    setRotationDegrees(xAxis, yAxis, zAxis) {
        const degreesToRadians = Math.PI / 180;
        xAxis *= degreesToRadians;
        yAxis *= degreesToRadians;
        zAxis *= degreesToRadians;
        this.rotation = [xAxis, yAxis, zAxis];
    }

    setRotationRadians(xAxis, yAxis, zAxis) { this.rotation = [xAxis, yAxis, zAxis]; }

    hasRotation() { return this.rotation[0] || this.rotation[1] || this.hasRotation[2]; }

    setOrtho(ortho) { this.ortho = ortho; }

    setPickID(ID) { this.ID = ID; }

    _updateSpacing() {
        this.spacingValue = (this.size * this.spacing) / 2.0;
        this.setAlignment(this.alignment);
    }
}
