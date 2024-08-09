import * as THREE from "three";

function createLights(targetObject) {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.7 );
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)

    
    directionalLight.position.set(30, 80, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = 0.0001;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.top = 14;
	directionalLight.shadow.camera.bottom = -14;
	directionalLight.shadow.camera.left = -14;
	directionalLight.shadow.camera.right = 14;
	directionalLight.shadow.camera.near = 40;
	directionalLight.shadow.camera.far = 100;
    directionalLight.target = targetObject
    
    const helper = {
        directionalLightHelper: new THREE.DirectionalLightHelper(directionalLight),
        shadowHelper: new THREE.CameraHelper(directionalLight.shadow.camera)
    }

	return {directionalLight, ambientLight, helper}
}

export { createLights };
