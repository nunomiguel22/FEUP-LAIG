var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;
        this.nodes = [];
        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;
        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
        this.scene.interface.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++)
            nodeNames.push(nodes[i].nodeName);

        var error = null;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);
            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }
        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");
            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }
        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");
            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }
        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");
            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");
            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");
            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");
            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }
        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }
        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }
        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");
            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
        return error;
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;
        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        this.cameras = [];
        let defaultCam = viewsNode.attributes[0].nodeValue;

        let children = viewsNode.children;
        if (!children.length)
            return "No views found, at least one view is required";

        for (let i = 0; i < children.length; ++i) {
            let chid = this.reader.getString(children[i], 'id');
            if (children[i].children.length < 2)
                return "Not enough properties in view " + chid;

            var cam;
            // Position
            let pos = this.parseCoordinates3D(children[i].children[0], "position in view " + chid);
            if (!Array.isArray(pos))
                return pos;
            let position = vec3.fromValues(...pos);
            //Target
            let tar = this.parseCoordinates3D(children[i].children[1], "target in view " + chid);
            if (!Array.isArray(tar))
                return tar;
            let target = vec3.fromValues(...tar);

            let near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse near value for view " + chid;
            let far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse far value for view " + chid;
            // Perspective views
            if (children[i].nodeName == 'perspective') {
                let fov = this.reader.getFloat(children[i], 'angle');
                if (!(fov != null && !isNaN(fov)))
                    return "unable to parse fov value for view " + chid;
                fov *= DEGREE_TO_RAD;
                cam = new CGFcamera(fov, near, far, position, target);
                // Ortho views
            } else if (children[i].nodeName == 'ortho') {
                let left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left value for view " + chid;
                let right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right value for view " + chid;
                let top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top value for view " + chid;
                let bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom value for view " + chid;
                // Upwards direction, default: 0,1,0
                let upVal = [0, 1, 0];
                if (children[i].length > 2 && children[i].children[2] == 'up') {
                    upVal = this.parseCoordinates3D(children[i].children[2], "up in view " + chid);
                    if (!Array.isArray(upVal))
                        upVal = [0, 1, 0];
                }
                let up = vec3.fromValues(...upVal);
                cam = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
            }
            // Add camera ID to ID array for interface purposes
            this.scene.cameraIds.push(chid);
            // Add camera to camera array and activate if default camera
            this.cameras[chid] = cam;
            if (chid == defaultCam) {
                this.scene.selectedCamera = defaultCam;
                this.scene.selectedSecurityCamera = defaultCam;
                this.scene.onCameraChanged();
            }
        }
        //If no default camera found use the first camera read
        if (this.cameras[defaultCam] == null) {
            this.onXMLMinorError("Default Camera not found, using first camera element");
            this.scene.selectedCamera = this.scene.cameraIds[0];
            this.scene.onCameraChanged();
        }
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);
                var aux;
                if (attributeIndex != -1) {
                    switch (attributeTypes[j]) {
                        case "position": {
                            aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                            break;
                        }
                        case "color": {
                            aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                            break;
                        }
                        case "attenuation": {
                            aux = [];
                            let values = this.parseMultipleFloats(['constant', 'linear', 'quadratic'], grandChildren[attributeIndex], " illumination for ID" + lightId);

                            if (!Array.isArray(values))
                                return values;
                            aux.push(values['constant'], values['linear'], values['quadratic']);
                            break;
                        }
                        default: break;
                    }

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        this.textures = [];

        let children = texturesNode.children;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current texture.
            let textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";
            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            //Get texture filepath
            let textureFile = this.reader.getString(children[i], 'file');
            if (textureFile == null)
                return "no filepath defined for texture";

            let tex = new CGFtexture(this.scene, textureFile);

            this.textures[textureID] = tex;
        }
        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let children = materialsNode.children;

        this.materials = [];

        let grandChildren = [];

        if (!children.length)
            return "No material blocks detected, there must be at least one material block";

        // Any number of materials.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current material.
            let materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";
            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";
            // Get material shininess
            let shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null)
                return "no shininess defined for material";

            grandChildren = children[i].children;
            var emission;
            var ambient;
            var diffuse;
            var specular;

            for (let j = 0; j < grandChildren.length; ++j) {
                switch (grandChildren[j].nodeName) {
                    case "emission": {
                        emission = this.parseColor(grandChildren[j], "emission value (conflict: ID = " + materialID + ")");
                        if (!Array.isArray(emission))
                            return emission;
                        break;
                    }
                    case "ambient": {
                        ambient = this.parseColor(grandChildren[j], "ambient value (conflict: ID = " + materialID + ")");
                        if (!Array.isArray(ambient))
                            return ambient;
                        break;
                    }
                    case "diffuse": {
                        diffuse = this.parseColor(grandChildren[j], "diffuse value (conflict: ID = " + materialID + ")");
                        if (!Array.isArray(diffuse))
                            return diffuse;
                        break;
                    }
                    case "specular": {
                        specular = this.parseColor(grandChildren[j], "specular value (conflict: ID = " + materialID + ")");
                        if (!Array.isArray(specular))
                            return specular;
                    }
                    default: break;
                }
            }

            var mat = new CGFappearance(this.scene);
            mat.setAmbient(...ambient);
            mat.setEmission(...emission);
            mat.setDiffuse(...diffuse);
            mat.setSpecular(...specular);
            mat.setShininess(shininess);
            mat.setTextureWrap('REPEAT', 'REPEAT');

            this.materials[materialID] = mat;
        }

        this.log("Parsed materials");
        return null;
    }

    parseTransformationMatrix(transformations) {
        var transfMatrix = mat4.create();
        mat4.identity(transfMatrix);

        for (let j = 0; j < transformations.length; j++) {
            switch (transformations[j].nodeName) {
                case 'transformationref': {
                    transfMatrix = this.transformations[this.reader.getString(transformations[j], "id")];
                    if (transfMatrix == null)
                        return null;
                    break;
                }
                case 'translate': {
                    let coordinates = this.parseCoordinates3D(transformations[j], "translate transformation ");
                    if (!Array.isArray(coordinates))
                        return null;
                    mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                }
                case 'scale': {
                    let scl = this.parseCoordinates3D(transformations[j], "scale transformation ");
                    if (!Array.isArray(scl))
                        return null;
                    mat4.scale(transfMatrix, transfMatrix, scl);
                    break;
                }
                case 'rotate': {
                    let axis = this.reader.getString(transformations[j], "axis");
                    if (axis == null)
                        return null;

                    let angle = this.reader.getFloat(transformations[j], "angle");
                    if (!(angle != null && !isNaN(angle)))
                        return null;
                    angle *= DEGREE_TO_RAD;

                    let axisVec = vec3.fromValues(axis == 'x', axis == 'y', axis == 'z');
                    mat4.rotate(transfMatrix, transfMatrix, angle, axisVec);

                    break;
                }
                default: break;
            }
        }
        return transfMatrix;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        this.transformations = [];
        var children = transformationsNode.children;
        var grandChildren = [];

        if (!children.length)
            return "No transformation blocks detected, there must be at least one transformation block";
        // Any number of transformations.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";
            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.
            var transfMatrix = this.parseTransformationMatrix(grandChildren);
            if (transfMatrix == null)
                return "Incorrect transformation ID = " + transformationID + ")";
        }
        this.transformations[transformationID] = transfMatrix;

        this.log("Parsed transformations");
        return null;
    }


    /**
    * Parses the <animations> block.
    * @param {animations block element} animationsNode
    */
    parseAnimations(animationsNode) {
        this.animations = [];
        var children = animationsNode.children;
        var grandChildren = [];

        if (!children.length)
            return "No animation blocks detected, there must be at least one animation block";

        for (let i = 0; i < children.length; ++i) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";
            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;

            this.animations[animationID] = new KeyframeAnimation(this);

            for (let j = 0; j < grandChildren.length; ++j) {
                let instant = this.reader.getFloat(grandChildren[j], 'instant');
                if (!(instant != null && !isNaN(instant)))
                    return "unable to parse instant (conflict: ID = " + animationID + ")";

                let transl = this.parseCoordinates3D(grandChildren[j].children[0], 'keyframe translate');
                if (!Array.isArray(transl))
                    return "unable to parse translation values (conflict: ID = " + animationID + ")";

                let angles = this.parseMultipleFloats(['angle_x', 'angle_y', 'angle_z'],
                    grandChildren[j].children[1], 'animation: ' + animationID);
                if (!Array.isArray(angles))
                    return angles;

                let angx = angles['angle_x'], angy = angles['angle_y'], angz = angles['angle_z'];
                angx *= DEGREE_TO_RAD;
                angy *= DEGREE_TO_RAD;
                angz *= DEGREE_TO_RAD;

                let scl = this.parseCoordinates3D(grandChildren[j].children[2], 'keyframe scale');
                if (!Array.isArray(scl))
                    return "unable to parse scale values (conflict: ID = " + animationID + ")";

                var kf = new Keyframe(instant, vec3.fromValues(...transl), vec3.fromValues(angx, angy, angz),
                    vec3.fromValues(...scl));
                this.animations[animationID].addKeyframe(kf);
            }
        }
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        if (!children.length)
            return "No primitive blocks, there much be at least one primitive block";

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null) {
                this.onXMLMinorError("no ID defined for texture");
                continue;
            }
            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null) {
                this.onXMLMinorError("ID must be unique for each primitive (conflict: ID = " + primitiveId + ")");
                continue;
            }
            grandChildren = children[i].children;
            // Validate the primitive type
            if (grandChildren.length != 1) {
                this.onXMLMinorError("There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus) (conflict: ID = " + primitiveId + ")");
                continue;
            }

            // Specifications for the current primitive.
            var prim;
            switch (grandChildren[0].nodeName) {

                case 'rectangle': {
                    let values = this.parseMultipleFloats(['x1', 'y1', 'x2', 'y2'], grandChildren[0],
                        primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    prim = new MyRectangle(this.scene, primitiveId, values['x1'], values['x2'],
                        values['y1'], values['y2']);

                    break;
                }
                case 'triangle': {
                    let values = this.parseMultipleFloats(['x1', 'y1', 'z1', 'x2', 'y2', 'z2', 'x3', 'y3', 'z3'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    prim = new MyTriangle(this.scene, values['x1'], values['y1'], values['z1'],
                        values['x2'], values['y2'], values['z2'], values['x3'], values['y3'], values['z3']);
                    break;
                }
                case 'sphere': {
                    let values = this.parseMultipleFloats(['radius', 'slices', 'stacks'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    prim = new MySphere(this.scene, values['radius'], values['slices'], values['stacks']);
                    break;
                }
                case 'torus': {

                    let values = this.parseMultipleFloats(['inner', 'outer', 'slices', 'loops'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    prim = new MyTorus(this.scene, values['inner'], values['outer'], values['slices'],
                        values['loops']);
                    break;
                }
                case 'cylinder': {

                    let values = this.parseMultipleFloats(['base', 'top', 'height', 'slices', 'stacks'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    prim = new MyCylinder(this.scene, values['base'], values['top'], values['height'],
                        values['slices'], values['stacks']);
                    break;
                }
                case 'cylinder2': {
                    let values = this.parseMultipleFloats(['base', 'top', 'height', 'slices', 'stacks'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    /** 
                     * TODO: Criar um cilindro usandos NURBS usandos os mesmos parametros
                     * xml: <cylinder2 base=“ff” top=“ff” height=“ff” slices=“ii” stacks=“ii” />
                     */
                    break;
                }
                case 'plane': {
                    let values = this.parseMultipleFloats(['npartsU', 'npartsV'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    /** 
                    * TODO: Criar um plano usando NURBS com tamanho 1x1, nos eixos XZ, centrado na origem, face visivel para Y+. 
                    * O plano deve ter subdivisoes equivalentes a npartsU*npartsV
                    * <plane npartsU=“ii” npartsV=“ii” />
                    */
                    break;
                }
                case 'patch': {

                    let controlPoints = [];
                    let values = this.parseMultipleFloats(['npointsU', 'npointsV', 'npartsU', 'npartsV'],
                        grandChildren[0], primitiveId);

                    if (!Array.isArray(values))
                        return values;

                    for (let i = 0; i < grandChildren[0].length; ++i) {
                        let controlPoint = grandChildren[0].children[i];
                        if (controlPoint.nodeName = 'controlpoint') {
                            let cpvalues = this.parseMultipleFloats('xx', 'yy', 'zz', controlPoint,
                                controlPoint.nodeName + ' of primitive ' + primitiveId);

                            if (!Array.isArray(cpvalues))
                                return cpvalues;

                            controlPoints.push(cpvalues);
                        }
                    }
                    /** 
                     *  TODO: patch, gerada por NURBS
                     *  npartsU: divisão em partes no domínio U
                     *  npartsV: divisão em partes no domínio V
                     *  o número de pontos de controlo dentro da primitiva patch é npointsU * npointsV
                     *  xml:
                     * 
                     *  <patch npointsU=“ii” npointsV=“ii” npartsU=“ii” npartsV=“ii” >
                     *      <controlpoint xx=“ff” yy=“ff” zz=“ff” />
                     *      ...
                     * </patch>
                     */
                    break;
                }
                default: return "Unknown primitive type must be rectangle, triangle, cylinder, sphere or torus"
            }
            this.primitives[primitiveId] = prim;
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
    * Parses the <components> block.
    * @param {components block element} componentsNode
    */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (let i = 0; i < children.length; ++i) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.com
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            let transformationIndex = nodeNames.indexOf("transformation");
            let animationIndex = nodeNames.indexOf("animationref");
            let materialsIndex = nodeNames.indexOf("materials");
            let textureIndex = nodeNames.indexOf("texture");
            let childrenIndex = nodeNames.indexOf("children");

            // Transformations
            if (transformationIndex == -1)
                return "No transformation block for component " + componentID;

            let transformation = grandChildren[transformationIndex].children;
            let transfMatrix = this.parseTransformationMatrix(transformation);

            // Materials
            if (materialsIndex == -1)
                return "There must be at least one material per component (conflict: ID = " + componentID + ")";
            let chmaterials = [];
            grandgrandChildren = grandChildren[materialsIndex].children;
            for (let i = 0; i < grandgrandChildren.length; ++i) {
                let matinfo = grandChildren[materialsIndex].children[i];
                chmaterials.push(this.reader.getString(matinfo, 'id'));
            }
            if (!chmaterials.length)
                return "There must be at least one material per component (conflict: ID = " + componentID + ")";

            // Texture
            if (textureIndex == -1)
                return "There must be at least one texture per component (conflict: ID = " + componentID + ")";

            let texinfo = grandChildren[textureIndex];
            let texID = this.reader.getString(texinfo, 'id');
            let length_s = 1;
            let length_t = 1;
            if (texID != 'inherit' && texID != 'none') {
                length_s = this.reader.getString(texinfo, 'length_s');
                if (!(length_s != null && !isNaN(length_s) && length_s > 0))
                    return "unable to parse S length of texture " + texID;
                length_t = this.reader.getString(texinfo, 'length_t');
                if (!(length_t != null && !isNaN(length_t) && length_t > 0))
                    return "unable to parse T length of texture " + texID;
            }

            // Children
            let node = new GraphNode(this, componentID, chmaterials,
                texID, length_s, length_t, transfMatrix);
            grandgrandChildren = grandChildren[childrenIndex].children;

            if (!grandgrandChildren.length)
                return "No childrens for component " + componentID;

            for (let i = 0; i < grandgrandChildren.length; ++i) {
                let chid = this.reader.getString(grandgrandChildren[i], 'id');
                if (grandgrandChildren[i].nodeName == 'primitiveref')
                    node.pushPrimitive(chid);
                else if (grandgrandChildren[i].nodeName == 'componentref')
                    node.pushChild(chid);
            }
            //  Animation
            if (animationIndex != -1) {
                var animID = this.reader.getString(grandChildren[animationIndex], 'id');
                node.addAnimation(animID);
            }
            this.components[componentID] = node;
        }
    }
    /**
     * Parse multiple floats, returns array with parsed values, ids are used as keys
     * @param {array} elements - array with all elemenent ids to be parsed
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseMultipleFloats(elements, node, messageError) {
        var values = [];

        for (let i = 0; i < elements.length; ++i) {
            let value = this.reader.getFloat(node, elements[i]);
            if (!(value != null && !isNaN(value)))
                return "unable to parse " + elements[i] + " value of the " + messageError;
            values[elements[i]] = value;
        }
        return values;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        let values = this.parseMultipleFloats(['x', 'y', 'z'], node, messageError);
        if (!Array.isArray(values))
            return values;

        position.push(values['x'], values['y'], values['z']);
        return position;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        let values = this.parseMultipleFloats(['x', 'y', 'z', 'w'], node, messageError);
        if (!Array.isArray(values))
            return values;

        position.push(values['x'], values['y'], values['z'], values['w']);
        return position;
    }
    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];
        let values = this.parseMultipleFloats(['r', 'g', 'b', 'a'], node, messageError);

        if (!Array.isArray(values))
            return values;

        color.push(values['r'], values['g'], values['b'], values['a']);
        return color;
    }
    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }
    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) { console.warn("Warning: " + message); }
    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) { console.log("   " + message); }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() { this.components[this.idRoot].display(null, null); }
}
