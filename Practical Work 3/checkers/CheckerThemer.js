class CheckerThemer {

    constructor(scene) {
        this.scene = scene;

        this.activeTheme = null;
        this.themes = [];
        this.reader = new CGFXMLreader();
        this.reader.open('scenes/THEMES.xml', this);
    }

    onXMLReady() {
        console.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;
        this.parseXML(rootElement);


        this.loadedOk = true;

    }

    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    parseXML(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        if (rootElement.children < 1)
            return "Themes file has no themes";

        var themesNode = rootElement.children[0];

        let defaultID = this.reader.getString(themesNode, 'default');
        if (defaultID == null)
            return "No default theme chosen";


        for (let i = 0; i < themesNode.children.length; ++i) {
            let id = this.reader.getString(themesNode.children[i], 'id');
            let filename = this.reader.getString(themesNode.children[i], 'filename');
            this.themes[id] = filename;
        }

        if (Object.keys(this.themes).length < 1)
            return "No theme was found in themes file";

        if (this.themes[defaultID] == null) {
            console.log("Default theme not found, using first in list instead");
            for (let key in this.themes) {
                this.activeTheme = this.themes[key];
                break;
            }
        }
        else this.activeTheme = this.themes[this.defaultID];
    }
}
