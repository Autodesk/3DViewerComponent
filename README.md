
ThreeD Viewer Component
=====================

This is a 3D viewer web component that presents a model, currently based on 3 parameters:

* Previews - An array of objects, each consisting of two properties:
 	1. file_type: "obj"/"stl"
 	2. file_url: can be an absolute URL (for an S3 bucket for instance), or a relative path
* Color (optional) - If not provided, a value of #F18D05 will be used

### Installation

		bower install --save https://git.autodesk.com/FrontEndTLV/ThreeDViewerWC.git

Then add these 2 lines at your HTML file:

        <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="bower_components/ThreeDViewerComponent/html/three-d-viewer.html">

From here you just use the tag itself with the parameters, e.g.:

        <three-d-viewer color="#ff0000" 
                        previews='[{"file_type": "stl", "file_url": "../samples/Camel.stl"}]'>
        </three-d-viewer>
