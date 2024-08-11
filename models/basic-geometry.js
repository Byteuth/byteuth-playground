import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
		box2: new THREE.BoxGeometry(100, 0.1, 100),
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
	mesh.receiveShadow = true
	mesh.castShadow = true
	
	return mesh;
}

function createBasicCar() {
	let carModel;
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(
			"./models/textures/gltf/cars/scene.gltf",
			(gltf) => {
				gltf.scene.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
						child.geometry.computeVertexNormals();
					}
				});
				carModel = gltf.scene.children[0];
				carModel.position.set(0, 0.4, 6);
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

function createBasicHouse() {
	let houseModel;
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(
			"./models/textures/gltf/houses/scene.gltf",
			(gltf) => {
				gltf.scene.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
						child.geometry.computeVertexNormals();
					}
				});
				houseModel = gltf.scene.children[0];
				// houseModel.position.set(-24, 0.4, -30);
				houseModel.scale.set(2, 2, 2);
				// houseModel.rotation.z = .4
				resolve(houseModel);
			},
			undefined,
			(error) => {
				console.error(
					"An error happened while loading the house model:",
					error
				);
				reject(error);
			}
		);
	});
}

async function createNeighborhood() {
	const neighborhood = new THREE.Group();
	for (let i = 0; i < 100; i++) {
		const angle = Math.random() * Math.PI * 2;
		const maxRadius = 10
		const minRadius = 50
		const radius = minRadius + Math.random() * (maxRadius - minRadius)
		const x = Math.sin(angle) * radius;
		const z = Math.cos(angle) * radius;

		const house = await createBasicObject("box1", "flat_green1");
		house.position.x = x;
		house.position.z = z;
		house.position.y = 2;

		house.rotation.z = Math.random();
		house.rotation.y = Math.random() * 0.1;
		neighborhood.add(house);
	}

	return neighborhood;
}

export {
	createBasicObject,
	createBasicCar,
	createBasicHouse,
	createNeighborhood,
};
