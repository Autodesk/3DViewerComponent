THREE.TADLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.materials = null;

};

THREE.TADLoader.prototype = {

	constructor: THREE.TADLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;
		
		var loader = new THREE.XHRLoader( scope.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			onLoad( scope.translate( text ) );

		}, onProgress, onError );

	},
	
	setPath: function ( value ) {
		this.path = value;
	},
	
	cubic: function(vertices, closed) {
		closed = closed || false; // closed if circular chromosome eg. Bacteria
		var controlLength = 1; // variable for possible corner tweaking

		var totalParticles = vertices.length;
		var pathControls = {};
		pathControls.vertices = [];
		pathControls.colors = [];
		var previousOffset = new THREE.Vector3(0,0,0);

		for (var i = 0 ; i < totalParticles ; i++) {

			var baseParticle = vertices[i];
			var foreParticle = new THREE.Vector3(0,0,0);
			if (i == totalParticles - 1) {
				if (closed) {
					// fore particle == first particle
					foreParticle = vertices[0];
				} else {
					// fore particle == extend same dist as to previous particle
					// really ???
					//foreParticle.copy(baseParticle).addVectors(baseParticle, vertices[i - 1]);
					foreParticle.copy(baseParticle).add(new THREE.Vector3(0.5, 0.5, 0.5));
				}
			} else {
				foreParticle = vertices[i + 1];
			}
			
			var midControl = new THREE.Vector3(0,0,0);
			midControl.addVectors(baseParticle, foreParticle).divideScalar(2);
			
			var midOffset = new THREE.Vector3(0,0,0);
			midOffset.copy(midControl).sub(baseParticle);

			if (i === 0) {
				if (closed) {
					// set previous for first particle
					var previousControl =  new THREE.Vector3(0,0,0);
					previousControl.addVectors(vertices[totalParticles - 1], vertices[0]).divideScalar(2);
					previousOffset.copy(previousControl).sub(vertices[totalParticles - 1]);
				} else {
					previousOffset.copy(midOffset);
				}
			}

			var backControl = new THREE.Vector3(0,0,0);
			backControl.copy(baseParticle).sub(midOffset);

			var foreControl = new THREE.Vector3(0,0,0);
			foreControl.copy(baseParticle).add(previousOffset);

			// Node tangent
			var baseTangent =  new THREE.Vector3(0,0,0);
			baseTangent.subVectors(foreControl, backControl).divideScalar(controlLength);
			backControl.copy(baseParticle).sub(baseTangent);
			foreControl.copy(baseParticle).add(baseTangent);

			// Add controls to array
			pathControls.vertices.push(backControl);
				pathControls.colors.push(new THREE.Color(0xcccccc));
			pathControls.vertices.push(baseParticle);
				pathControls.colors.push(new THREE.Color(0x000000));
			pathControls.vertices.push(foreControl);
				pathControls.colors.push(new THREE.Color(0xcccccc));

			previousOffset = midOffset;
		}
		// add start and end controls
		// requires calc of join midway on cubicBezier between start and end
		var startBackControl = new THREE.Vector3(0,0,0);
		var startPoint = new THREE.Vector3(0,0,0);
		var endForeControl = new THREE.Vector3(0,0,0);
		var endPoint = new THREE.Vector3(0,0,0);

		var totalControls = pathControls.vertices.length;
		var p1 = pathControls.vertices[totalControls-2]; // last particle
		var p2 = pathControls.vertices[totalControls-1]; // last fore control
		var p3 = pathControls.vertices[0]; // first back control
		var p4 = pathControls.vertices[1]; // first particle
		if (closed) {
			// curve between start and end Controls
			var joinCurve = new THREE.CubicBezierCurve3(p1,p2,p3,p4);
			// split join curve in two
			var joinMidpoint = joinCurve.getPointAt(0.5);
			var joinTangent = joinCurve.getTangent(0.5).multiplyScalar(1);

			// NEEDS ROUNDING OFF TO NEAREST 0.5??? Math.round(num*2)/2;
			startBackControl.copy(joinMidpoint).sub(joinTangent);
			startPoint.copy(joinMidpoint);
			endForeControl.copy(joinMidpoint).add(joinTangent);
			endPoint.copy(joinMidpoint);
		} else {
			startBackControl.copy(p3);
			startPoint.copy(p3);
			endForeControl.copy(p2);
			endPoint.copy(p2);
		}
		pathControls.vertices.unshift(startBackControl);
			pathControls.colors.unshift(new THREE.Color(0xffff00));
		pathControls.vertices.unshift(startPoint);
			pathControls.colors.unshift(new THREE.Color(0xff0000));
		pathControls.vertices.push(endForeControl);
			pathControls.colors.push(new THREE.Color(0x00ffff));
		pathControls.vertices.push(endPoint);
			pathControls.colors.push(new THREE.Color(0x0000ff));

		return pathControls;
	},
	
	cubicBezier: function(controls, segments, closed) {
		closed = closed || false; // closed if circular chromosome eg. Bacteria
		var cubicPath = new THREE.CurvePath();
		var totalControls = controls.length;
		var cubicCurveStart, cubicCurveEnd;

			// controls[0] == start point
			// controls[1] == start point fore control
			// controls[2] == first particle back control
			// controls[3] == first particle
			// ...
			// n == totalControls - 1
			// controls[n-3] == last particle
			// controls[n-2] == last particle fore control
			// controls[n-1] == end point back control
			// controls[n] == end point (if closed, end point == start point)

			for (var i = 0 ; i < totalControls - 1 ; i = i + 3) {

				var c1 = controls[i];
				var c2 = controls[i+1];
				var c3 = controls[i+2];
				var c4 = controls[i+3];

				var cubicCurve = new THREE.CubicBezierCurve3(c1,c2,c3,c4);
				 cubicPath.add(cubicCurve);
			}
		return cubicPath;
	},
	
	translate: function ( text ) {
		
		function getGeometry(data) {
			var offset = 0, vertex,
				 vertexGeometry = new THREE.Geometry();
			var totalVertices = data.length;
			while ( offset < totalVertices ) {
				vertex = new THREE.Vector3();
				vertex.x = data[ offset ++ ];
				vertex.y = data[ offset ++ ];
				vertex.z = data[ offset ++ ];
				vertexGeometry.vertices.push( vertex );
			}
			vertexGeometry.name = "Chromatin Geometry";
			return vertexGeometry;
		}
		
		var tadobj;
		var first_centroid;
		var pathClosed = false;
		var particleSegments = 40;
		var genomeLength = 816394;
		var palette = ["#ff0000","#ff0000"];
		
		var tadjson = JSON.parse(text);
		for (var i = tadjson.models.length - 1; i >= 0; i--) {
			if (tadjson.models[i].ref == tadjson.centroids[0]) first_centroid = tadjson.models[i];
		}
		
		var segmentsCount = tadjson.models.length * particleSegments
		
		var colors = [];
		var hexStart = palette[0];
		var hexEnd = palette[1];

		for (var i = segmentsCount - 1; i >= 0; i--) {
			colors.push(hexStart);
		}
		
		// Convert Data to Vector triplets
		var geometry = getGeometry(first_centroid.data);
		for (var g = geometry.vertices.length - 1; g >= 0; g--) {
			var geometryColor = new THREE.Color(colors[g*20]);
			geometry.colors.unshift(geometryColor);
		}

		// Derive path controls from geometry vectors
		// var pathControls = getPathControls( geometry.vertices );
		var pathControls = this.cubic(geometry.vertices, pathClosed);
		
		var pathSegments = geometry.vertices.length * particleSegments;
		
		var cubicPath = this.cubicBezier(pathControls.vertices, pathSegments, pathClosed);
		var cubicGeom = cubicPath.createPointsGeometry(pathSegments);
		for (var j = cubicGeom.vertices.length - 1; j >= 0; j--) {
			var cubicGeomColor = new THREE.Color(colors[j]);
			cubicGeom.colors.unshift(cubicGeomColor);
		}
		cubicGeom.name = "cubicGeom";
		var pathLength = cubicPath.getLength();
		var chromatinRadius = 5; // 10nm * 0.5
		var chromatinLength = genomeLength * 11 / 1080;
		var radius = (pathLength * chromatinRadius) / chromatinLength;
		var chromatinFiber = new THREE.Object3D();
		var chromatinGeometry;
		
		chromatinGeometry = new THREE.TubeGeometry(cubicPath, pathSegments, 4, 8, pathClosed);
		chromatinGeometry.dynamic = true;
		chromatinGeometry.verticesNeedUpdate = true;
	
	    var tubeMesh = new THREE.Mesh(chromatinGeometry, new THREE.MeshLambertMaterial({
	        color: 0xffffff,
	        //shading: THREE.FlatShading,
	        //side: THREE.DoubleSide,
	        wireframe: false,
	        transparent: false,
	        vertexColors: THREE.FaceColors, // CHANGED
	        overdraw: true
	    }));
	
	    for(var k=0;k< chromatinGeometry.faces.length;k++) {
	    	//if(k%12) chromatinGeometry.faces[k].color.setRGB(1,0,0);
	    	//else chromatinGeometry.faces[k].color.setRGB(0,0,0);
	    	chromatinGeometry.faces[k].color.setRGB(1,0,0);
		}
	    
	    tubeMesh.dynamic = true;
	    tubeMesh.needsUpdate = true;
        
		chromatinFiber.add( tubeMesh );
		//chromatinFiber.userData = {display:'tube'};
/*		var tadobj =
			{
			
				"metadata": {
					"version" : 1.0,
					"type" : "Object",
					"generator" : "TADkit"
				},
				"geometries": [{
					"uuid": 'geom-'+tadjson.object.uuid,
					"type": "BufferGeometry",
					"data": {
						"attributes": {
							"position": {
								"itemSize": 3,
								"type": "Float32Array",
								"array": first_centroid.data,
								"normalized": false
							}
						}
					}
				}],
				"materials": [
	      		{
	      			"uuid": 'mat-'+tadjson.object.uuid,
	      			"type": "MeshStandardMaterial",
	      			"color": 16777215,
	      			"roughness": 0.5,
	      			"metalness": 0.5,
	      			"emissive": 0,
	      			"depthFunc": 3,
	      			"depthTest": true,
	      			"depthWrite": true,
	      			"skinning": false,
	      			"morphTargets": false
	      		}],
		      	"object": {
		      		"uuid": tadjson.object.uuid,
		      		"type": "Mesh",
		      		"name": "Camel.stl",
		      		"matrix": [1,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,1],
		      		"geometry": 'geom-'+tadjson.object.uuid,
		      		"material": 'mat-'+tadjson.object.uuid
		      	}

	
			};*/
	
		return chromatinFiber; 
	}
	
};