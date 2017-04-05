
ThreeD Viewer Component
=====================

This is a 3D viewer web component that presents a model, currently based on 2 parameters:

* Previews - An array of objects, each consisting of two properties:
 	1. file_type: "obj"/"stl"/"json" (where "json" is a valid [THREEjs Scene Object](https://github.com/mrdoob/three.js/wiki/JSON-Object-Scene-format-4))
 	2. file_url: can be an absolute URL (for an S3 bucket for instance), or a relative path
* Color (optional) - If not provided, a value of #F18D05 will be used

### Demo

You can find a demo page [here.](http://codepen.io/OmriAharon/pen/XKVXKk)

### Installation

Currently the best way to install is using Bower since it has Polymer's dependencies installed automatically.
If you rather install via npm you can, but you need to take care of the `webcomponents` & `polymer` dependencies manually.

		bower install --save 3DViewerComponent

Then add these 2 lines at your HTML file:

        <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="bower_components/3DViewerComponent/dist/three-d-viewer.html">

From here you just use the tag itself with the parameters, e.g.:

        <three-d-viewer color="ff0000"
                        previews='[{"file_type": "stl", "file_url": "bower_components/3DViewerComponent/samples/Camel.stl"}]'>
        </three-d-viewer>

If you're running as a new project or a blank new HTML page and don't have your styling, add this CSS for styling just to see how it looks:

        <style>
            html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        </style>
