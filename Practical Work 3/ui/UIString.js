/**
 * Class displays a text string on screen
 * @constructor
 * @param {scene} scene  Reference to the scene
 * @param {string} string  Text to display
 */
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
        this.setAlwaysVisible(false);
    }

    display() {
        this.transformMatrix = [...this.scene.getMatrix()];
        this.textRenderer.strings.push(this);
    }
    /**
     * Updates UI string value
     */
    setString(string) {
        this.string = string;
        this.setAlignment(this.alignment);
    }
    /**
     * Sets string color
     */
    setColor(red, green, blue, alpha) { this.color = [red, green, blue, alpha]; }
    /**
     * Sets spacing between characters
     */
    setSpacing(spacing) {
        this.spacing = spacing;
        this._updateSpacing();
    }
    /**
     * Disables depth testing when rendering string
     */
    setAlwaysVisible(vis) { this.forceVis = vis; }
    /**
     * Sets horizontal string aligment in relation to the location
     * values are "left", "right" and "center"
     */
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
    /**
     * Sets string position
     */
    setPosition(x, y, z) { this.position = [x, y, z]; }
    /**
     * Font size
     */
    setSize(size) {
        this.size = size;
        this._updateSpacing();
    }
    /**
     * Rotates string on each axis
     */
    setRotationDegrees(xAxis, yAxis, zAxis) {
        const degreesToRadians = Math.PI / 180;
        xAxis *= degreesToRadians;
        yAxis *= degreesToRadians;
        zAxis *= degreesToRadians;
        this.rotation = [xAxis, yAxis, zAxis];
    }
    /**
     * Rotates string on each axis
     */
    setRotationRadians(xAxis, yAxis, zAxis) { this.rotation = [xAxis, yAxis, zAxis]; }
    /**
     * Returns true if it has rotation
     */
    hasRotation() { return this.rotation[0] || this.rotation[1] || this.hasRotation[2]; }
    /**
     * If true the string will be rendered in a ortho (-1, -1) to (1, 1) perspective
     */
    setOrtho(ortho) { this.ortho = ortho; }
    /**
     * Set unique ID for object picking
     */
    setPickID(ID) { this.ID = ID; }

    _updateSpacing() {
        this.spacingValue = (this.size * this.spacing) / 2.0;
        this.setAlignment(this.alignment);
    }
}
