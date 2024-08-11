import * as THREE from "three";

let cameraMode;

function createCamera(playWindow) {
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		10000
	);
	camera.position.set(20, 61, 94)	

	camera.lookAt(0, 10, 0);
	return camera;
}

function calculateOffset(carModel) {
	let offset;
	if (cameraMode === "birdseye") {
		offset.applyQuaternion(carModel.quaternion);
		return carModel.position.clone().add(offset);
		
	} else if (cameraMode === "thirdperson") {
		offset = new THREE.Vector3(0, -7, 7);
		offset.applyQuaternion(carModel.quaternion);
		return carModel.position.clone().add(offset);

	} else if (cameraMode === "default") {
		return new THREE.Vector3(100, 100, 100); 
	}
}

function calculateIdealLookAt(carModel) {
	let lookAtOffset;
	if (cameraMode === "birdseye") {
		lookAtOffset.applyQuaternion(carModel.quaternion);
		return carModel.position.clone().add(lookAtOffset);

	} else if (cameraMode === "thirdperson") {
		lookAtOffset = new THREE.Vector3(0, 16, -2);
		lookAtOffset.applyQuaternion(carModel.quaternion);
		return carModel.position.clone().add(lookAtOffset);
		
	} else if (cameraMode === "default") {
		return new THREE.Vector3(100, 100, 100); 
	}
}

function setActiveCamera(mode) {
	cameraMode = mode;
	console.log("Camera mode set to:", cameraMode);

	const birdEyeButton = document.getElementById("button-birdEyePOV");
	const thirdPersonButton = document.getElementById("button-thirdPersonPOV");
	const orbitalButton = document.getElementById("button-orbitalPOV");

	if 	(cameraMode === "thirdperson") {
		orbitalButton.classList.remove("selected");
		birdEyeButton.classList.remove("selected");
		thirdPersonButton.classList.add("selected");

	} else if (cameraMode === "birdseye") {
		orbitalButton.classList.remove("selected");
		birdEyeButton.classList.add("selected");
		thirdPersonButton.classList.remove("selected");

	} else if (cameraMode === "default") {
		orbitalButton.classList.add("selected");
		birdEyeButton.classList.remove("selected");
		thirdPersonButton.classList.remove("selected");
	}
	return mode
}

export { createCamera, calculateOffset, calculateIdealLookAt, setActiveCamera };
