import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { createBasicObject, createBasicCar } from "../models/basic-geometry";
import { createLights } from "./lights";
import { createCamera, calculateIdealLookAt, calculateOffset } from "./camera";
import { onKeyDown, onKeyUp, moveVehicle } from "./user-controls";
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const playWindow = renderer.domElement;

const cameraControls = createCamera(playWindow);
const controls = new OrbitControls(cameraControls, playWindow);
const { directionalLight, ambientLight, helper } = createLights();

let cameraMode;
let wireframe;
let cube, car, neighborhood;


async function init() {

	const bluePrintCube = {
		position: { x: -0.5, y: 14, z: 0.5 },
		scale: { x: 1, y: 1, z: 1 },
		shape: "box",
		color: "bright_green",
		texture: "gradient_green",
		shadows: { castShadow: true, receiveShadow: true },
	};

	const bluePrintCar = {
		position: { x: 1, y: 1, z: 1 },
		scale: 0.01,
		shadows: { castShadow: true, receiveShadow: true },
	};

	scene.add(directionalLight, ambientLight);

	const size = 100;
	const divisions = 9;
	const gridHelper = new THREE.GridHelper(size, divisions);
	scene.add(gridHelper);



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

	squareBody.position.set(
		bluePrintCube.position.x,
		bluePrintCube.position.y,
		bluePrintCube.position.z
	);
	physicsWorld.addBody(squareBody);

	const sphereGeometry = new THREE.SphereGeometry(radius);
	const sphereMaterial = new THREE.MeshNormalMaterial();
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphereMesh);

	const cannonDebugger = new CannonDebugger(scene, physicsWorld, {});

	cube = await createBasicObject(bluePrintCube);
	if (cube) {
		cube.castShadow = true;
		cube.receiveShadow = true;
		scene.add(cube);
	}

	car = await createBasicCar(bluePrintCar);
	if (car) {
		car.castShadow = true;
		car.receiveShadow = true;
		scene.add(car);
	}

	// Now that everything is loaded, start the animation loop
	renderer.setAnimationLoop(animate);

	function animate() {
		if (cube) {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
		}

		if (wireframe) {
			wireframe.rotation.x = cube.rotation.x;
			wireframe.rotation.y = cube.rotation.y;
		}
		
		if (neighborhood) {
			for (let i = 0; i < neighborhood.children.length; i++) {
				neighborhood.children[i].rotation.x += 0.01;
				neighborhood.children[i].rotation.y += 0.01;
			}
		}

		if (car) {
			moveVehicle(car, 0.2)
		}

		if (cameraMode === "thirdperson" && car) {
			cameraControls.position.copy(calculateOffset(car));
			cameraControls.lookAt(calculateIdealLookAt(car));
			controls.enabled = false;
		} else if (cameraMode === "birdseye" && car) {
			cameraControls.position.set(
				car.position.x - 40,
				car.position.y + 50,
				car.position.z + 40
			);
			controls.enabled = false;
			cameraControls.lookAt(car.position);
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
		renderer.render(scene, cameraControls);
	}
}

init();


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
export {
	updateCubeGeometry,
	updateShadowHelperToggle,
	updateDirectLightHelperToggle,
};

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
