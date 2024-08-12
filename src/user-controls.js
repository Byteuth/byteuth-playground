import * as THREE from "three";

let carVelocity = 0;
let moveBackward = false;
let moveForward = false;
let moveLeft = false;
let moveRight = false;

export const moveVehicle = (car, speed) => {
	let velocity = new THREE.Vector3(0, 0, 0);
	let delta = speed
	let rotationSpeed = 0.02;

	if (moveForward) carVelocity = delta;
	if (moveBackward) carVelocity = -delta;

	if (moveLeft) car.rotation.z += rotationSpeed;
	if (moveRight) car.rotation.z -= rotationSpeed;
	car.translateY(carVelocity);
    console.log(car)
};

export const onKeyDown = (event) => {
	switch (event.code) {
		case "KeyW":
			moveForward = true;
			break;
		case "KeyS":
			6;
			moveBackward = true;
			break;
		case "KeyA":
			moveLeft = true;
			break;
		case "KeyD":
			moveRight = true;
			break;
	}
};

export const onKeyUp = (event) => {
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
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
