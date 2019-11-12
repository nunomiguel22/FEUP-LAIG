/**
* MySecurityCamera
* @constructor
*/
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.init();
    }

    init() {
        this.screen = new MyRectangle(this.scene, null, 0.5, 1.0, -0.5, -1.0);
        this.shader = new CGFshader(this.scene.gl, "shaders/SecurityCamera.vert",
            "shaders/SecurityCamera.frag");
    }

    display() {
        this.scene.setActiveShader(this.shader);
        this.scene.SecurityCameraTex.bind(0);
        this.screen.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
