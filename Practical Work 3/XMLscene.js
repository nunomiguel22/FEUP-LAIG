var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.scaleFactor = 1;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(8000.0);
        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(20);

        this.testShader = new CGFshader(this.gl, "../lib/CGF/shaders/Gouraud/textured/multiple_light-vertex.glsl", "shaders/test.frag");
        this.textRenderer = new TextRenderer(this, "scenes/images/fontAtlas.jpg");
        this.testString = new GLString(this, "New Game");
        this.testString.setPosition([-50.0, 79.0, 0.0]);
        this.testString.setSize(10.0);
        this.testString.setColor([0, 0.2, 0.5, 0.8]);
        this.testString.rotateDegrees([-90, 0.0, 0.0]);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.selectedCamera = null;
        this.mainCamera = this.camera;
        this.animationDuration = 2000;

        this.camera = new CGFextendedCamera(1.0, 0.1, 8000, vec3.fromValues(3, 400, 300), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];


                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.mainCamera = this.graph.cameras[this.selectedCamera];

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.checkers.checkerBoard.init();

        this.sceneInited = true;
    }

    onCameraChanged() {
        if (this.graph.cameras != null && this.graph.cameras[this.selectedCamera] != null) {
            this.interface.lookAround = false;
            this.interface.onLookAroundChange();

            this.mainCamera.animateToCamera(this.graph.cameras[this.selectedCamera], this.animationDuration);
            this.mainCamera.onAnimationOver(this.swapCamera.bind(this), this.graph.cameras[this.selectedCamera]);
            this.checkers.checkerAnimator.playCameraAnimation(this.mainCamera);
        }
    }

    swapCamera(camera) {
        this.mainCamera.reset();
        this.mainCamera = camera;
    }

    update(t) {
        if (this.sceneInited)
            this.checkers.update(t);

    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        this.checkers.handlePick(customId);
                        console.log(customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    /**
     * Displays the scene.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup
        if (this.gui.isKeyPressed("KeyM")) {
            if (!this.checkers.checkerAnimator.cameraAnimations.length) {
                this.mainCamera.animateToCamera(this.graph.cameras["topView"], 2000);
                this.mainCamera.onAnimationOver(this.swapCamera.bind(this), this.graph.cameras["topView"]);
                this.checkers.checkerAnimator.playCameraAnimation(this.mainCamera);
            }
        }

        if (this.gui.isKeyPressed("KeyN")) {
            if (!this.checkers.checkerAnimator.cameraAnimations.length) {
                this.mainCamera.animateToCamera(this.graph.cameras["normal"], 2000);
                this.mainCamera.onAnimationOver(this.swapCamera.bind(this), this.graph.cameras["normal"]);
                this.checkers.checkerAnimator.playCameraAnimation(this.mainCamera);
            }
        }

        // ---- BEGIN Background, camera and axis setup
        if (camera != null)
            this.camera = camera;

        this.setActiveShader(this.testShader);

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

        this.pushMatrix();
        for (let i = 0; i < this.lights.length; ++i)
            this.lights[i].update();

        if (this.sceneInited) {
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        this.popMatrix();
        this.clearPickRegistration();
        // ---- END Background, camera and axis setup
    }
    display() {
        this.render(this.mainCamera);
    }
    setDepthTest(type) {
        if (type)
            this.gl.enable(this.gl.DEPTH_TEST);
        else this.gl.disable(this.gl.DEPTH_TEST);
    }
}
