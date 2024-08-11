import * as THREE from "three";

function createLights(targetObject) {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.9 );
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)

    
    directionalLight.position.set(80, 80, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = 0.0001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom =  -50;
	directionalLight.shadow.camera.left = -50;
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.near = 40;
	directionalLight.shadow.camera.far = 160;
    directionalLight.target = targetObject
    
    const helper = {
        directionalLightHelper: new THREE.DirectionalLightHelper(directionalLight),
        shadowHelper: new THREE.CameraHelper(directionalLight.shadow.camera)
    }

	return {directionalLight, ambientLight, helper}
}

export { createLights };
