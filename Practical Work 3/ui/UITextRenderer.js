class UITextRenderer {

    constructor(scene, fontAtlas) {
        this.scene = scene;
        this.atlasTexture = new CGFtexture(this.scene, fontAtlas);
        this.shader = new CGFshader(this.scene.gl, "shaders/text/text.vert",
            "shaders/text/text.frag");
        this.shader.setUniformsValues({ uSampler: 0 });

        this.characters = [];
        this._createAtlas();

        this.ortho = new CGFcameraOrtho(-1.0, 1.0, -1.0, 1.0, 0.1, 100,
            vec3.fromValues(0, 0, 1), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

        this.strings = [];
    }

    displayChar(char) {
        if (this.characters[char] == null)
            char = ' ';

        this.atlasTexture.bind(0);
        this.characters[char].display();
    }

    /**
     * Change parameters to GLString
     */
    displayString(uistring) {
        // Apply Ortho Camera when required

        let prevCamera = null;
        if (uistring.ortho) {
            this.scene.pushMatrix();
            prevCamera = this.scene.camera;
            this.scene.camera = this.ortho;
            this.scene.updateProjectionMatrix();
            this.scene.loadIdentity();
            this.scene.applyViewMatrix();
        }

        // Apply text shader, temporarily disable depth test as it was causing artifacts
        this.scene.pushMatrix();
        this.scene.setDepthTest(false);

        // Set string color
        this.shader.setUniformsValues({ uFontColor: uistring.color });

        // Transformations to entire string
        this.scene.pushMatrix();
        this.scene.translate(uistring.startPosition,
            uistring.position[1], uistring.position[2]);
        this.scene.rotate(uistring.rotation[1], 0, 1, 0);
        this.scene.rotate(uistring.rotation[0], 1, 0, 0);
        this.scene.rotate(uistring.rotation[2], 0, 0, 1);

        // Draw each character
        for (let i in uistring.string) {

            this.scene.pushMatrix();
            // Set character size and width position for each character
            let x = uistring.alignmentValue + (uistring.spacingValue * i);
            this.scene.translate(x, 0, 0);
            this.scene.scale(uistring.size, uistring.size, 0);
            // Display each character
            this.displayChar(uistring.string.charAt(i));
            this.scene.popMatrix();
        }
        // Cleanup after drawing string
        this.scene.popMatrix();
        this.scene.setDepthTest(true);

        this.scene.popMatrix();
        if (uistring.ortho) {
            this.scene.popMatrix();
            this.scene.camera = prevCamera;
        }
    }

    display() {
        this.scene.setActiveShader(this.shader);

        for (let i in this.strings) {
            //this.scene.registerForPick(this.strings[i].ID, this.strings[i]);
            this.displayString(this.strings[i]);
        }
        this.scene.setActiveShader(this.scene.defaultShader);
        this.strings = [];
    }

    _createAtlas() {
        let ab = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`"
        ab += "abcdefghijklmnopqrstuvwxyz{|}~";

        this.squareSize = 1.0 / 10.0;
        const halfSize = this.squareSize / 2.0;

        let charIndex = 0;
        for (let j = 0; j < 10; ++j)
            for (let i = 0; i < 10; ++i) {
                let rect = new MyRectangle(this.scene, null, 0.0, 1.0, 0.0, 1.0);

                let u1 = this.squareSize * i;
                let v1 = this.squareSize * j;
                let u2 = this.squareSize * i + this.squareSize;
                let v2 = this.squareSize * j + this.squareSize;
                let texCoords = [
                    u1, v2,
                    u2, v2,
                    u1, v1,
                    u2, v1
                ]

                rect.updateTexCoords(texCoords);
                this.characters[ab.charAt(charIndex++)] = rect;
            }
    }
}
