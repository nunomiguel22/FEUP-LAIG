//From https://github.com/EvanHahn/ScriptInclude
include = function () { function f() { var a = this.readyState; (!a || /ded|te/.test(a)) && (c-- , !c && e && d()) } var a = arguments, b = document, c = a.length, d = a[c - 1], e = d.call; e && c--; for (var g, h = 0; c > h; h++)g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g) };
serialInclude = function (a) { var b = console, c = serialInclude.l; if (a.length > 0) c.splice(0, 0, a); else b.log("Done!"); if (c.length > 0) { if (c[0].length > 1) { var d = c[0].splice(0, 1); b.log("Loading " + d + "..."); include(d, function () { serialInclude([]); }); } else { var e = c[0][0]; c.splice(0, 1); e.call(); }; } else b.log("Finished."); }; serialInclude.l = new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}
//Include additional files here
serialInclude([
    // CGF
    '../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js',
    'CGF/CGFextendedCamera.js', 'CGF/CGFOBJModel.js', 'CGF/CGFResourceReader.js',
    'GraphNode.js',
    // Primitives
    'primitives/MyRectangle.js', 'primitives/MyTriangle.js', 'primitives/MySphere.js',
    'primitives/MyCylinder.js', 'primitives/MyTorus.js', 'primitives/MyPlane.js',
    'primitives/MyPatch.js', 'primitives/MyNurbsCylinder.js',
    // Animation
    'animation/Animation.js', 'animation/Keyframe.js', 'animation/KeyframeAnimation.js',

    // Checkers
    //      Visual
    'checkers/CheckerBoard.js', 'checkers/CheckerThemer.js', 'checkers/CheckerAnimator.js',
    //      Logic
    'checkers/logic/CheckerTile.js', 'checkers/logic/CheckerPiece.js',
    'checkers/logic/CheckerLogic.js', 'checkers/logic/CheckerMode.js',
    'checkers/logic/CheckerPlayer.js', 'checkers/logic/CheckerHuman.js',
    //      Sequence
    'checkers/sequence/CheckerMove.js', 'checkers/sequence/CheckerSequence.js',
    //      States
    'checkers/states/StateGame.js', 'checkers/states/StateMainMenu.js',
    'checkers/states/StateGameOver.js',
    //      Checkers
    'checkers/Checkers.js',
    // UI
    'ui/UITextRenderer.js', 'ui/UIString.js', 'ui/UIMainMenu.js', 'ui/UIGameInfo.js',
    'ui/UIFPSCounter.js',

    main = function () {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        myScene.checkers = new Checkers(myScene);
        // start
        app.run();
    }

]);
