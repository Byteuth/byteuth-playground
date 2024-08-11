import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let carModel;
function createBasicCar() {
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(
			"./models/textures/gltf/car2/scene.gltf",
			(gltf) => {
				carModel = gltf.scene.children[0];
				carModel.position.set(0, 0.4, 0);
				carModel.scale.set(0.01, 0.01, 0.01);
				carModel.children[0].rotation.y = 1.53;
				resolve(carModel);
			},
			undefined,
			(error) => {
				console.error("An error happened while loading the car model:", error);
				reject(error);
			}
		);
	});
}

function createBasicObject(geometryKey, materialKey, textureKey) {
	const textureCatalog = {
		gradient_green1: new THREE.TextureLoader().load(
			"./models/textures/cubeMaps/Gradient/posz.png",
			(texture) => {},
			undefined,
			(err) => {}
		),
	};

	const geometryCatalog = {
		box1: new THREE.BoxGeometry(1, 1, 1),
		box2: new THREE.BoxGeometry(600, 0.1, 600),
		plane1: new THREE.PlaneGeometry(10, 10),
	};

	const materialCatalog = {
		flat_green1: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
		flat_yellow1: new THREE.MeshLambertMaterial({
			color: 0xffff00,
		}),
		gradient_green1: new THREE.MeshLambertMaterial({
			map: textureCatalog[textureKey],
		}),
	};
	const geometry = geometryCatalog[geometryKey];
	const material = materialCatalog[materialKey];
	material.wireframe = false;
	const mesh = new THREE.Mesh(geometry, material);
	// console.log(mesh)
	return mesh;
}

export { createBasicObject, createBasicCar };
