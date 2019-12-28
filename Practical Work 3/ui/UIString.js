class UIString {

    constructor(scene, string) {
        this.scene = scene;
        this.textRenderer = this.scene.textRenderer;

        // String Info
        this.setString(string);
        this.setAlignment("left");
        this.setSize(1.0);
        this.setColor(1.0, 1.0, 1.0, 1.0);
        this.setSpacing(0.6); // 1.0 is a full character space
        this.setPosition(0.0, 0.0, 0.0);
        this.setRotationDegrees(0.0, 0.0, 0.0);
        this.setOrtho(false);

        //Technical Values
        this._updateSpacing();
        this._updateEmptySpace();
        this.ID = null;
    }

    setSize(size) {
        this.size = size;
        this._updateEmptySpace();
        this._updateSpacing();
    }
    setPosition(x, y, z) { this.position = [x, y, z]; }
    setString(string) {
        this.string = string;
        this.setAlignment(this.alignment);
    }
    setAlignment(alignment) {
        this.alignment = alignment;

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
    setPickID(ID) { this.ID = ID; }
    setColor(red, green, blue, alpha) { this.color = [red, green, blue, alpha]; }
    setOrtho(ortho) { this.ortho = ortho; }
    setSpacing(spacing) {
        this.spacing = spacing;
        this._updateSpacing();
    }

    hasRotation() { return this.rotation[0] || this.rotation[1] || this.hasRotation[2]; }
    setRotationRadians(xAxis, yAxis, zAxis) { this.rotation = [xAxis, yAxis, zAxis]; }
    setRotationDegrees(xAxis, yAxis, zAxis) {
        const degreesToRadians = Math.PI / 180;
        xAxis *= degreesToRadians;
        yAxis *= degreesToRadians;
        zAxis *= degreesToRadians;
        this.rotation = [xAxis, yAxis, zAxis];
    }

    display() {
        this.scene.registerForPick(this.ID, this);
        this.textRenderer.displayString(this);
    }

    _updateSpacing() {
        this.spacingValue = (this.size * this.spacing) / 2.0;
    }
    _updateEmptySpace() {
        this.emptySpace = 0.3 * this.size;
    }
}
