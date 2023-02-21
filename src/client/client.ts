import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'

// Creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Init Camera
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;

// Init Materials
const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()

// Setup Lights
const light1 = new THREE.SpotLight()
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

// Setup Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render)

// Creating Cube Rigid Body
const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxMesh = new THREE.Mesh( boxGeometry, phongMaterial );
boxMesh.position.y = 3
boxMesh.castShadow = true
boxMesh.receiveShadow = true
boxMesh.material.wireframe = false;
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const boxBody = new CANNON.Body({ mass: 1 })
boxBody.addShape(boxShape)

boxBody.position.x = boxMesh.position.x
boxBody.position.y = boxMesh.position.y
boxBody.position.z = boxMesh.position.z
scene.add( boxMesh );

// Setup Ground Plane
const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)

const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

/******** Setup Physics *********/
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.addBody(planeBody)
world.addBody(boxBody)

/******** Enable WebXR Options *********/
renderer.xr.enabled = true;
var btnContainer = document.createElement('div');
var vrButton = VRButton.createButton(renderer);
var arButton = ARButton.createButton(renderer); 
vrButton.style.bottom = '70px';
btnContainer.appendChild(vrButton);
btnContainer.appendChild(arButton);
document.body.appendChild(btnContainer);

//renderer.setAnimationLoop( function() {
//    renderer.render(scene, camera);
//} );

/******** GUI *********/
const gui = new GUI();
gui.close();

const cameraFolder = gui.addFolder("Camera");
cameraFolder.open();
cameraFolder.add(camera.position, "x", 0, Math.PI * 2);
cameraFolder.add(camera.position, "y", 0, Math.PI * 2);
cameraFolder.add(camera.position, "z", 0, Math.PI * 2);

const physicsFolder = gui.addFolder('Physics')
physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
physicsFolder.open()


/******** RenderLoop *********/
const clock = new THREE.Clock()
let delta

function animate() {
	requestAnimationFrame( animate );

    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    // Copy coordinates from Cannon to Three.js
    boxMesh.position.set(
        boxBody.position.x,
        boxBody.position.y,
        boxBody.position.z
    )
    boxMesh.quaternion.set(
        boxBody.quaternion.x,
        boxBody.quaternion.y,
        boxBody.quaternion.z,
        boxBody.quaternion.w
    )

    render();
}

function render() {
    renderer.render( scene, camera );
}

animate();
