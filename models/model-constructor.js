import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const createBasicMesh = async ({
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
export const createGLTFMesh = ({ position, scale, shadows }) => {
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
				mesh.scale.set(scale.x, scale.y, scale.z),
					(mesh.children[0].rotation.y = 1.53);

				resolve(mesh);
			},
			undefined,
			(error) => {
				reject(error);
			}
		);
	});
};
