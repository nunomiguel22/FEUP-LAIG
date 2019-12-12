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
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(20);

        this.testShader = new CGFshader(this.gl, "../lib/CGF/shaders/Gouraud/textured/multiple_light-vertex.glsl", "shaders/test.frag");
        this.setPickEnabled(true);
        this.objid = 0;
        this.checkerBoard = new CheckerBoard(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameraIds = [];

        this.selectedCamera = null;
        this.mainCamera = this.camera;

        this.camera = new CGFcamera(1.0, 0.1, 8000, vec3.fromValues(3, 400, 300), vec3.fromValues(0, 0, 0));
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
        this.axis = new CGFaxis(this, 200);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.mainCamera = this.graph.cameras[this.selectedCamera];

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.checkerBoard.initTiles();
        this.checkerBoard.initPieces();
        this.checkerBoard.initStartTable();

        this.sceneInited = true;
    }

    onCameraChanged() {

        if (this.graph.cameras != null && this.graph.cameras[this.selectedCamera] != null) {
            this.mainCamera = this.graph.cameras[this.selectedCamera];
            this.interface.setActiveCamera(this.mainCamera);
        }
    }

    update(t) {
        for (let key in this.graph.animations)
            this.graph.animations[key].update(t);

        if (this.SecurityCamera != null)
            this.SecurityCamera.update(t);
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
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
        this.logPicking();
        this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup
        if (this.gui.isKeyPressed("KeyM")) {
            for (let key in this.graph.components)
                this.graph.components[key].cycleMaterial();
        }
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
        this.axis.display();
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        this.objid = 0;
        if (this.sceneInited) {
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        this.popMatrix();


        // ---- END Background, camera and axis setup
    }
    display() {
        this.render(this.mainCamera);
    }
}
