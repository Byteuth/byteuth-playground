import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let cameraMode = 1;

function createCamera(playWindow) {
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	const controls = new OrbitControls(camera, playWindow);
	camera.position.set(0, 40, 30);
	camera.lookAt(0, 10, 0);
	return camera;
}

function calculateOffset(carModel) {
	let offset;
	if (cameraMode === 1) {
		offset = new THREE.Vector3(10, -16, 30);
	} else if (cameraMode === 2) {
		offset = new THREE.Vector3(0, -7, 7);
	}
	offset.applyQuaternion(carModel.quaternion);
	return carModel.position.clone().add(offset);
}

function calculateIdealLookAt(carModel) {
	let lookAtOffset;
	if (cameraMode === 1) {
		lookAtOffset = new THREE.Vector3(0, 10, 14);
	} else if (cameraMode === 2) {
		lookAtOffset = new THREE.Vector3(0, 16, -2);
	}
	lookAtOffset.applyQuaternion(carModel.quaternion);
	return carModel.position.clone().add(lookAtOffset);
}

function setActiveCamera(mode) {
	cameraMode = parseInt(mode, 10);
	console.log("Camera mode set to:", cameraMode);

	const birdEyeButton = document.getElementById("button-birdEyePOV");
	const thirdPersonButton = document.getElementById("button-thirdPersonPOV");

	if (cameraMode === 1) {
		birdEyeButton.classList.add("selected");
		thirdPersonButton.classList.remove("selected");
	} else if (cameraMode === 2) {
		birdEyeButton.classList.remove("selected");
		thirdPersonButton.classList.add("selected");
	}
}

export { createCamera, calculateOffset, calculateIdealLookAt, setActiveCamera };
