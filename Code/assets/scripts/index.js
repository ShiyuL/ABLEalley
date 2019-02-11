var scene;
$('document').ready(function () {
        var camera, renderer, controls, loader;
        var WIDTH  = window.innerWidth;
        var HEIGHT = window.innerHeight;

        function init() {
            scene = new THREE.Scene();

            initBackground();
            initMesh();
            initCamera();
            initLights();
            initRenderer();
            controls = new THREE.OrbitControls( camera, renderer.domElement );
            document.body.appendChild(renderer.domElement);
        }

        function initBackground() {


          var bowlingAlly = createBowlingAlly(1000, 1000, 300);
          //bowlingAlly.position.set(-475, -10, 0);
          scene.add(bowlingAlly);
          loadPinsModel();

        }

        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 4000);
          camera.position.set(-250, 100, 0);
          camera.lookAt(0, 0, 0);
        }


        function initRenderer() {
            renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
            renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor( 0x000000, 0 );
        }

        function initLights() {
            //TODO light looks weird
            var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
            keyLight.position.set(-5, 0, 5);

            var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
            fillLight.position.set(5, 0, 5);

            var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
            backLight.position.set(5, 0, -5).normalize();

            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);
        }

        var mesh = null;
        function initMesh() {

            // ball
            loader = new THREE.GLTFLoader();
            loader.load( 'assets/models/ball.gltf', function ( gltf ) {
              mesh = gltf.scene;
              mesh.traverse( function ( child ) {
                if ( child.isMesh ) {
                  child.geometry.center();//in order to make rotation work
                }
              });
              mesh.scale.set(20,20,20);
              mesh.position.set(-100, 20, 0);
              scene.add( mesh );
            });

        }

        function render() {
            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
        }

        function onDocumentMouseDown(event) {
            switch ( event.button ) {
                case 0: // left click to trigger movement
                    moveWithRotate();
                    break;
                case 1: // middle
                    break;
                case 2: // right click to reset ball position
                    mesh.position.x = -100;
                    mesh.position.y = 20;
                    mesh.position.z = 0;
                    break;
            }

        }

        function moveWithRotate() {
            if (mesh.position.x < 400) {
                requestAnimationFrame(moveWithRotate)
                renderer.render(scene, camera)
                var direction = new THREE.Vector3( 1, 0, 0 );

                // scalar to simulate speed
                var speed = 5;

                var vector = direction.multiplyScalar( speed, speed, speed );
                mesh.position.x += vector.x;
                mesh.position.y += vector.y;
                mesh.position.z += vector.z;
                rotateAboutPoint(mesh, new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),new THREE.Vector3(0,0,1),0.1, true);
            }
        }

    function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }


        init();
        render();
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
});
