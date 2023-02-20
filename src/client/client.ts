import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// Creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.xr.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
var btnContainer = document.createElement('div');
var vrButton = VRButton.createButton(renderer);
var arButton = ARButton.createButton(renderer); 
vrButton.style.bottom = '70px';

btnContainer.appendChild(vrButton);
btnContainer.appendChild(arButton);
document.body.appendChild(btnContainer);


new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
const cube = new THREE.Mesh( geometry, material );
cube.material.wireframe = true;

scene.add( cube );

camera.position.z = 5;

renderer.setAnimationLoop( function() {
    renderer.render(scene, camera);
} );

function animate() {
	requestAnimationFrame( animate );

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    
	renderer.render( scene, camera );
}
animate();
