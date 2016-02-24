
ThreeD Viewer Component
=====================

This is a 3D viewer web component that presents a model, currently based on 3 parameters:

* AssetID
* AssetPreviews
* Color(optional)

### Installation

		bower install --save https://git.autodesk.com/SparkTLV/ServiceBureau3DViewer.git

Then add these 2 lines at your HTML file:

        <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="bower_components/threedviewercomponent/three-d-viewer.html">

From here you just use the tag itself with the parameters, e.g.:

        <three-d-viewer id="viewer" asset-data-id=" *assetId Here* "
                    color=" *hexa color here, e.g. ff0000* "
                    previews=' *arrayOfAssetPreviews* '></three-d-viewer>
