(function () {
    'use strict';

    //threejs global vars
    var camera, scene, renderer, controls, mesh, light, backlight, viewerEl;

    // RENDER LOOP
    var render = function () {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    };


    /**
     * Check for webgl support
     * @returns {*}
     */
    var webglSupport = function () {
        try {
            var canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext && (
                canvas.getContext('webgl') || canvas.getContext('experimental-webgl') );
        } catch (e) {
            return false;
        }
    };

    function Viewer() {
        return {
            init: function (elem, dimensions) {
                // SCENE BASIC SETUP

                viewerEl = elem;

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0xb5b5b5, 500, 3000);

                renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
                renderer.setSize(dimensions.width, dimensions.height);
                renderer.setClearColor(0xffffff);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.soft = true;
                renderer.shadowMap.type = THREE.PCFShadowMap;

                // APPEND RENDERER
                elem.prepend(renderer.domElement);

                // CAMERA & CONTROLS
                var VIEW_ANGLE = 60;
                var ASPECT = dimensions.width / dimensions.height;
                var NEAR = 0.01;
                var FAR = 1000;
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

                camera.position.set(-9.5, 7, 20);

                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.maxDistance = 1600;
                controls.autoRotate = true;

                // LIGHTS
                var ambient = new THREE.AmbientLight(0x444444);
                scene.add(ambient);

                light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
                light.position.set(100, 1000, 1000);
                light.target.position.set(0, 0, 0);
                light.castShadow = true;
                light.shadowCameraNear = 1200;
                light.shadowCameraFar = 2500;
                light.shadowCameraFov = 1;
                light.shadowMapWidth = 2048;
                light.shadowMapHeight = 2048;
                light.shadowBias = 0.0001;
                light.shadowDarkness = 0.2;
                light.shadowMapWidth = 1024;
                light.shadowMapHeight = 1024;

                scene.add(light);

                backlight = new THREE.SpotLight(0xffff00, 1, 0, Math.PI / 2, 1);
                backlight.position.set(0, 50, -800);
                backlight.target.position.set(0, 0, 0);
                backlight.castShadow = true;
                backlight.shadowCameraNear = 1200;
                backlight.shadowCameraFar = 2500;
                backlight.shadowCameraFov = 1;
                backlight.shadowMapWidth = 2048;
                backlight.shadowMapHeight = 2048;
                backlight.shadowBias = 0.0001;
                backlight.shadowDarkness = 0.2;
                backlight.shadowMapWidth = 1024;
                backlight.shadowMapHeight = 1024;

                scene.add(backlight);

                var size = 500;
                var step = 20;

                var gridHelper = new THREE.GridHelper(size, step);
                gridHelper.setColors(0xaaaaaa, 0xe0e0e0);
                gridHelper.position.y = 0.2;
                scene.add(gridHelper);

                // GROUND
                var geometry = new THREE.PlaneBufferGeometry(10, 10);
                var planeMaterial = new THREE.MeshPhongMaterial({color: 0xe9e9e9});
                var ground = new THREE.Mesh(geometry, planeMaterial);

                ground.position.set(0, 0, 0);
                ground.rotation.x = -Math.PI / 2;
                ground.scale.set(100, 100, 100);
                ground.castShadow = false;
                ground.receiveShadow = true;

                scene.add(ground);

                function animate() {
                    requestAnimationFrame(animate);

                    controls.update();
                    renderer.render(scene, camera);
                }

                animate();
            },

            loadObject: function (obj, type, onViewerReady) {
                switch (type) {
                    case 'obj':
                        this.loadObj(obj, onViewerReady);
                        break;
                    case 'stl':
                        this.loadStl(obj, onViewerReady);
                        break;
                    default:
                }
            },

            loadObj: function (obj, onViewerReady) {
                var self = this;

                var loader = new THREE.OBJLoader();

                loader.load(obj, function (ob) {
                    var obGroup = new THREE.Group();

                    ob.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            var newColor = '#F18D05',
                                color = new THREE.Color(newColor),
                                material = new THREE.MeshPhongMaterial({color: color});

                            var geometry = new THREE.Geometry();
                            geometry.fromBufferGeometry(child.geometry);
                            var mesh = new THREE.Mesh(geometry, material);

                            if (this.autorotate) {
                                mesh.rotation.x = -Math.PI / 2;
                            }

                            obGroup.add(mesh);
                        }
                    }.bind(this));

                    obGroup.name = 'objGroup';
                    this.unloadObj();
                    scene.add(obGroup);

                    this.fitMeshToCamera(obGroup);

                    onViewerReady && onViewerReady()
                }.bind(this));
            },

            unloadObj: function () {
                var obj = scene.getObjectByName('');
                scene.remove(obj);
            },

            centerGeometry: function (geom) {
                var geometry = new THREE.Geometry();
                geometry.fromBufferGeometry(geom);
                geometry.computeBoundingBox();
                geometry.center();
                return geometry;
            },

            resize: function () {
                $(window).resize(function () {
                    this.resizeAccordingToViewerElem();
                }.bind(this));
            },

            resizeAccordingToViewerElem: function () {
                renderer.setSize(viewerEl.width(), viewerEl.height());
                camera.aspect = viewerEl.width() / viewerEl.height();
                camera.updateProjectionMatrix();
            },

            loadStl: function (obj, onViewerReady) {
                var loader = new THREE.STLLoader();

                loader.load(obj, function (geom) {
                    var newColor = '#F18D05';
                    var color = new THREE.Color(newColor);
                    var material = new THREE.MeshPhongMaterial({color: color});

                    geom = this.centerGeometry(geom);
                    var mesh = new THREE.Mesh(geom, material);

                    if (this.autorotate) {
                        mesh.rotation.x = -Math.PI / 2;
                    }

                    mesh.name = 'objGroup';
                    scene.add(mesh);
                    this.fitMeshToCamera(mesh);

                    onViewerReady && onViewerReady()
                }.bind(this));
            },

            fitMeshToCamera: function (group) {
                var max = {x: 0, y: 0, z: 0};
                var min = {x: 0, y: 0, z: 0};

                group.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        var bbox = new THREE.BoundingBoxHelper(child, 0xffffff);
                        bbox.update();

                        max.x = (bbox.box.max.x > max.x) ? bbox.box.max.x : max.x;
                        max.y = (bbox.box.max.y > max.y) ? bbox.box.max.y : max.y;
                        max.z = (bbox.box.max.z > max.z) ? bbox.box.max.z : max.z;

                        min.x = (bbox.box.min.x < min.x) ? bbox.box.min.x : min.x;
                        min.y = (bbox.box.min.y < min.y) ? bbox.box.min.y : min.y;
                        min.z = (bbox.box.min.z < min.z) ? bbox.box.min.z : min.z;
                    }
                }.bind(this));

                var meshY = Math.abs(max.y - min.y);
                var meshX = Math.abs(max.x - min.x);
                var meshZ = Math.abs(max.z - min.z);
                var scaleFactor = 10 / Math.max(meshX, meshY);

                group.scale.set(scaleFactor, scaleFactor, scaleFactor);

                //group.position.x = meshX/2;
                group.position.y = meshY / 2 * scaleFactor;
                //group.position.z = meshZ/2;

                var box = new THREE.Box3().setFromObject(group);
                box.center(group.position); // this re-sets the mesh position
                group.position.multiplyScalar(-1);

                group.position.y += meshY * scaleFactor + 0.2;
            },

            stopRotation: function () {
                controls.autoRotate = false;
            }
        };

    }

    function noWebGLFallback() {
        var userNotified = false;
        var errMsg = 'Your browser doesn\'t support WebGL';

        return {
            __noSuchMethod__: function () {
                if (!userNotified) {
                    console.warn(errMsg);
                    userNotified = true;
                    for (var i = 0; i < arguments[1].length; i++) {
                        if (typeof arguments[1][i] == 'function') {
                            arguments[1][i](errMsg);
                        }
                    }
                }
            }
        }
    }

    window.Viewer = webglSupport() ? Viewer() : noWebGLFallback();

})();