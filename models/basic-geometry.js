import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const createBasicObject = async ({
	position,
	scale,
	shape,
	color,
	texture,
}) => {
	return new Promise(
		(resolve, reject) => {
			console.log(scale);
			const textures = {
				gradient_green: new THREE.TextureLoader().load(
					"./models/textures/cubeMaps/Gradient/posz.png"
				),
			};

			const geometries = {
				box: new THREE.BoxGeometry(scale.x, scale.y, scale.z),
				sphere: new THREE.SphereGeometry(scale.x, scale.y, scale.z),
				plane: new THREE.PlaneGeometry(scale.x, scale.z),
			};

			const materials = {
				bright_green: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
				gradient_green: new THREE.MeshLambertMaterial({
					map: textures[texture] || null,
				}),
				flat_yellow: new THREE.MeshLambertMaterial({
					color: 0xffff00,
				}),
			};

			const geometry = geometries[shape];
			const material = materials[color];

			const mesh = new THREE.Mesh(geometry, material);
			resolve(mesh);
		},
		undefined,
		(error) => {
			reject(error);
		}
	);
};

const loader = new GLTFLoader();
export const createBasicCar = ({ position, scale, shadows }) => {
	return new Promise((resolve, reject) => {
		loader.load(
			"./models/textures/gltf/cars/scene.gltf",
			(gltf) => {
				gltf.scene.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = shadows.castShadow;
						child.receiveShadow = shadows.receiveShadow;
						child.geometry.computeVertexNormals();
					}
				});

				const mesh = gltf.scene.children[0];
				mesh.position.set(position.x, position.y, position.z);
				mesh.scale.multiplyScalar(scale)
				mesh.children[0].rotation.y = 1.53
				resolve(mesh);
			},
			undefined,
			(error) => {
				reject(error);
			}
		);
	});
};

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
		const maxRadius = 10;
		const minRadius = 50;
		const radius = minRadius + Math.random() * (maxRadius - minRadius);
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

export { createBasicHouse, createNeighborhood };
