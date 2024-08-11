import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { createCamera } from "./camera";
import {
	createBasicObject,
	createBasicCar,
	createBasicHouse,
	createNeighborhood,
} from "../models/basic-geometry";
import { createLights } from "./lights";
import { calculateIdealLookAt, calculateOffset } from "./camera";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
	.setPath("./models/textures/cubeMaps/Gradient/")
	.load([
		"posx.png",
		"negx.png",
		"posy.png",
		"negy.png",
		"posz.png",
		"negz.png",
	]);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
const playWindow = renderer.domElement;
const camera = createCamera(playWindow);
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);

const cube = createBasicObject("box1", "flat_green1");
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.y = 14;
scene.add(cube);

let wireframe;

const ground = createBasicObject("box2", "gradient_green1", "gradient_green1");
ground.castShadow = false;
ground.receiveShadow = true;
scene.add(ground);

let car = new THREE.Object3D();
let neighborhood;

createBasicCar()
	.then((loadedCar) => {
		car = loadedCar;
		car.castShadow = true;
		car.receiveShadow = true;
		scene.add(car);
	})
	.catch((error) => {
		console.error("Failed to load car model:", error);
	});

// createNeighborhood()
// 	.then((loadedNeighborhood) => {
// 		neighborhood = loadedNeighborhood;
// 		scene.add(loadedNeighborhood);
// 	})
// 	.catch((error) => {
// 		console.error("Failed to load Neighborhood model:", error);
// 	});

let moveBackward = false;
let moveForward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3(0, 0, 0);
const delta = 0.2;
const rotationSpeed = 0.02;

function onKeyDown(event) {
	switch (event.code) {
		case "KeyW":
			moveForward = true;
			break;
		case "KeyS":
			moveBackward = true;
			break;
		case "KeyA":
			moveLeft = true;
			break;
		case "KeyD":
			moveRight = true;
			break;
	}
}

function onKeyUp(event) {
	switch (event.code) {
		case "KeyW":
			moveForward = false;
			break;
		case "KeyS":
			moveBackward = false;
			break;
		case "KeyA":
			moveLeft = false;
			break;
		case "KeyD":
			moveRight = false;
			break;
	}
}

const { directionalLight, ambientLight, helper } = createLights(cube);
scene.add(directionalLight, ambientLight);

function updateShadowHelperToggle(showShadowHelper) {
	helper.shadowHelper.visible = showShadowHelper;
	scene.add(helper.shadowHelper);
}

function updateDirectLightHelperToggle(showDirectionalLightHelper) {
	helper.directionalLightHelper.visible = showDirectionalLightHelper;
	scene.add(helper.directionalLightHelper);
}

function updateCubeGeometry(
	width,
	height,
	depth,
	widthSegments,
	heightSegments,
	depthSegments,
	showWireframe
) {
	const newGeometry = new THREE.BoxGeometry(
		width,
		height,
		depth,
		widthSegments,
		heightSegments,
		depthSegments
	);

	cube.geometry.dispose();
	cube.geometry = newGeometry;

	if (wireframe) {
		scene.remove(wireframe);
		wireframe.geometry.dispose();
		wireframe = null;
	}

	if (showWireframe) {
		const wireframeGeometry = new THREE.WireframeGeometry(newGeometry);
		const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
		wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
		wireframe.position.copy(cube.position);
		wireframe.rotation.copy(cube.rotation);
		scene.add(wireframe);
	}

	if (!scene.children.includes(cube)) {
		scene.add(cube);
	}
}

const size = 100;
const divisions = 9;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

let cameraMode;
const controls = new OrbitControls(camera, playWindow);

const physicsWorld = new CANNON.World({
	gravity: new CANNON.Vec3(0, -9.82, 0),
});
const groundBody = new CANNON.Body({
	type: CANNON.Body.STATIC,
	shape: new CANNON.Plane(),
});

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

const radius = 1;
const sphereBody = new CANNON.Body({
	mass: 8,
	shape: new CANNON.Sphere(radius),
});
const squareBody = new CANNON.Body({
	mass: 5,
	shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
});

sphereBody.position.set(0, 7, 0);
physicsWorld.addBody(sphereBody);

squareBody.position.set(-0.5, 14, 0.5);
physicsWorld.addBody(squareBody);

const sphereGeometry = new THREE.SphereGeometry(radius);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

const cannonDebugger = new CannonDebugger(scene, physicsWorld, {});

function animate() {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	if (wireframe) {
		wireframe.rotation.x = cube.rotation.x;
		wireframe.rotation.y = cube.rotation.y;
	}

	if (car) {
		let carVelocity = 0;

		if (moveForward) carVelocity = delta;
		if (moveBackward) carVelocity = -delta;

		if (moveLeft) car.rotation.z += rotationSpeed;
		if (moveRight) car.rotation.z -= rotationSpeed;

		car.translateY(carVelocity);
	}
	if (neighborhood) {
		for (let i = 0; i < neighborhood.children.length; i++) {
			neighborhood.children[i].rotation.x += 0.01;
			neighborhood.children[i].rotation.y += 0.01;
		}
	}

	if (cameraMode === "thirdperson") {
		camera.position.copy(calculateOffset(car));
		camera.lookAt(calculateIdealLookAt(car));
		controls.enabled = false;
	} else if (cameraMode === "birdseye") {
		camera.position.set(
			car.position.x - 40,
			car.position.y + 50,
			car.position.z + 40
		);
		controls.enabled = false;
		camera.lookAt(car.position);
	} else if (cameraMode === "default") {
		controls.enabled = true;
		controls.update();
	}

	physicsWorld.fixedStep();
	cannonDebugger.update();
	cube.position.copy(squareBody.position);
	cube.quaternion.copy(squareBody.quaternion);
	sphereMesh.position.copy(sphereBody.position);
	sphereMesh.quaternion.copy(sphereBody.quaternion);
	// window.requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

export {
	updateCubeGeometry,
	updateShadowHelperToggle,
	updateDirectLightHelperToggle,
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

document.getElementById("button-birdEyePOV").addEventListener("click", () => {
	cameraMode = "birdseye";
});

document
	.getElementById("button-thirdPersonPOV")
	.addEventListener("click", () => {
		cameraMode = "thirdperson";
	});

document.getElementById("button-orbitalPOV").addEventListener("click", () => {
	cameraMode = "default";
});
