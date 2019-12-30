class UITextRenderer {

    constructor(scene, fontAtlas, rows, columns) {
        this.scene = scene;
        this.rows = rows;
        this.columns = columns;

        this.atlasTexture = new CGFtexture(this.scene, fontAtlas);
        this.shader = new CGFshader(this.scene.gl, "shaders/text/text.vert",
            "shaders/text/text.frag");
        this.shader.setUniformsValues({ uSampler: 0 });

        this.ortho = new CGFcameraOrtho(-1.0, 1.0, -1.0, 1.0, 0.1, 100,
            [0, 0, 1], [0, 0, 0], [0, 1, 0]);

        this.characters = [];
        this._createAtlas();

        this.strings = [];
    }

    getAspectRatioScale() { return this.scene.gl.canvas.height / this.scene.gl.canvas.width; }

    displayChar(char) {
        if (this.characters[char] == null)
            char = ' ';

        this.atlasTexture.bind(0);
        this.characters[char].display();
    }

    displayString(uistring) {

        this.scene.pushMatrix();
        // Apply Ortho Camera when required
        if (uistring.ortho) {
            CGFextendedCamera.swapSceneCamera(this.scene, this.ortho, false);
            this.scene.setDepthTest(false);
        }

        // Apply transformation at time of display
        else this.scene.setMatrix(uistring.transformMatrix);
        // Set string color
        this.shader.setUniformsValues({ uFontColor: uistring.color });
        // Transformations to entire string
        this.scene.translate(...uistring.position);
        this.scene.rotateXYZ(...uistring.rotation);

        // Draw each character
        for (let i in uistring.string) {

            this.scene.pushMatrix();
            // Set character size and width position for each character
            let x = uistring.alignmentValue + (uistring.spacingValue * i);
            this.scene.translate(x, 0, 0);
            this.scene.scale(uistring.size * this.getAspectRatioScale(), uistring.size, 0);
            // Display each character
            this.displayChar(uistring.string.charAt(i));
            this.scene.popMatrix();
        }

        // Cleanup after drawing string
        this.scene.popMatrix();
        if (uistring.ortho) {
            CGFextendedCamera.applyPreviousTransform(this.scene);
            this.scene.setDepthTest(true);
        }
    }

    display() {
        this.scene.setActiveShader(this.shader);

        for (let i in this.strings) {
            this.scene.registerForPick(this.strings[i].ID, this.strings[i]);
            this.displayString(this.strings[i]);
        }
        this.scene.setActiveShader(this.scene.defaultShader);
        this.strings = [];
    }

    _createAtlas() {
        const squareWidth = 1.0 / this.columns;
        const squareHeight = 1.0 / this.rows;

        //Stating from space(32)
        let charIndex = 32;

        for (let j = 0; j < this.rows; ++j)
            for (let i = 0; i < this.columns; ++i) {
                let rect = new MyRectangle(this.scene, null, 0.0, 1.0, 0.0, 1.0);

                let u1 = squareWidth * i;
                let v1 = squareHeight * j;
                let u2 = squareWidth * i + squareWidth;
                let v2 = squareHeight * j + squareHeight;
                let texCoords = [
                    u1, v2,
                    u2, v2,
                    u1, v1,
                    u2, v1
                ]

                rect.updateTexCoords(texCoords);
                this.characters[String.fromCharCode(charIndex++)] = rect;
            }
    }
}
