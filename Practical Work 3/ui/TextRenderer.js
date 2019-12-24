class TextRenderer {

    constructor(scene, fontAtlas) {
        this.scene = scene;
        this.atlasTexture = new CGFtexture(this.scene, fontAtlas);
        this.shader = new CGFshader(this.scene.gl, "shaders/text/text.vert",
            "shaders/text/text.frag");
        this.shader.setUniformsValues({ uSampler: 0 });

        this.characters = [];

        this.createAtlas();

    }

    createAtlas() {
        let ab = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`"
        ab += "abcdefghijklmnopqrstuvwxyz{|}~";

        this.squareSize = 1.0 / 10.0;
        const halfSize = this.squareSize / 2.0;

        let charIndex = 0;
        for (let j = 0; j < 10; ++j)
            for (let i = 0; i < 10; ++i) {
                let rect = new MyRectangle(this.scene, null, -0.5, 0.5, 0.0, 1.0);

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

    displayChar(char) {
        if (this.characters[char] == null)
            char = ' ';

        this.atlasTexture.bind(0);
        this.characters[char].display();
    }

    displayString(string, size, color, position, alignment, rotation) {
        const halfSize = size / 3.0;


        this.scene.setDepthTest(false);
        this.scene.setActiveShader(this.shader);
        this.shader.setUniformsValues({ uFontColor: color });
        this.scene.pushMatrix();
        this.scene.translate(position[0], position[1], position[2]);

        this.scene.rotate(rotation[1], 0, 1, 0);
        this.scene.rotate(rotation[0], 1, 0, 0);
        this.scene.rotate(rotation[2], 0, 0, 1);


        for (let i = 0; i < string.length; ++i) {
            this.scene.pushMatrix();
            this.scene.translate(alignment * halfSize + (halfSize * i), 0, 0);
            this.scene.scale(size, size, size);
            this.displayChar(string.charAt(i));
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.setDepthTest(true);
    }

}
