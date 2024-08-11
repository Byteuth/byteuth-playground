import * as THREE from "three";
import { createCamera, setActiveCamera } from "./camera";
import { createBasicObject, createBasicCar } from "../models/basic-geometry";
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
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const cube = createBasicObject("box1", "flat_green1");
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.y = 10;
scene.add(cube);

let wireframe;

const ground = createBasicObject("box2", "gradient_green1", "gradient_green1");
ground.castShadow = false;
ground.receiveShadow = true;
scene.add(ground);

let car;
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

let moveBackward = false;
let moveForward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3(0, 0, 0);
const delta = 0.9;
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
	if (showShadowHelper) scene.add(helper.shadowHelper);
	else scene.remove(helper.shadowHelper);
}

function updateDirectLightHelperToggle(showDirectionalLightHelper) {
	if (showDirectionalLightHelper) scene.add(helper.directionalLightHelper);
	else scene.remove(helper.directionalLightHelper);
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
	const geometry = new THREE.BoxGeometry(
		width,
		height,
		depth,
		widthSegments,
		heightSegments,
		depthSegments
	);

	const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
	scene.remove(cube);
	cube.geometry.dispose();

	cube.geometry = geometry;
	cube.material = material;

	cube.castShadow = true;
	cube.receiveShadow = true;

	scene.add(cube);

	if (showWireframe) {
		if (wireframe) {
			scene.remove(wireframe);
			wireframe.geometry.dispose();
		}
		const wireframemat = new THREE.LineBasicMaterial({ color: 0xffffff });
		wireframe = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			wireframemat
		);
		wireframe.position.copy(cube.position);
		scene.add(wireframe);
	} else if (wireframe) {
		scene.remove(wireframe);
		wireframe.geometry.dispose();
		wireframe = null;
	}

	scene.add(wireframe);
}

const size = 600;
const divisions = 9;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

let cameraMode;
const controls = new OrbitControls(camera, playWindow);

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

animate();
