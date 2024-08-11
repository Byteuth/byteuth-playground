import { updateCubeGeometry } from "./main";
import { updateShadowHelperToggle } from "./main";
import { updateDirectLightHelperToggle } from "./main";
import { setActiveCamera } from "./camera";

const widthSlider = document.getElementById("shape-width");
const heightSlider = document.getElementById("shape-height");
const depthSlider = document.getElementById("shape-depth");
const segmentWidthSlider = document.getElementById("segment-width");
const segmentHeightSlider = document.getElementById("segment-height");
const segmentDepthSlider = document.getElementById("segment-depth");

const widthValue = document.getElementById("width-value");
const heightValue = document.getElementById("height-value");
const depthValue = document.getElementById("depth-value");
const segmentWidthValue = document.getElementById("segment-width-value");
const segmentHeightValue = document.getElementById("segment-height-value");
const segmentDepthValue = document.getElementById("segment-depth-value");

const wireframeToggle = document.getElementById("wireframe-toggle");
const shadowHelperToggle = document.getElementById("shadowHelper-toggle");
const directionalLightHelperToggle = document.getElementById(
	"directionalLightHelper-toggle"
);


let isWireframeEnabled = false;
let isShadowHelperEnabled = false;
let isDirectionalLightHelperEnabled = false;

function updateSliderValues() {
	widthValue.value = widthSlider.value;
	heightValue.value = heightSlider.value;
	depthValue.value = depthSlider.value;
	segmentWidthValue.value = segmentWidthSlider.value;
	segmentHeightValue.value = segmentHeightSlider.value;
	segmentDepthValue.value = segmentDepthSlider.value;
}

function toggleWireframe() {
	isWireframeEnabled = wireframeToggle.checked;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
}

function toggleShadowHelper() {
	isShadowHelperEnabled = shadowHelperToggle.checked;
	updateShadowHelperToggle(isShadowHelperEnabled);
}

function toggleDirectionalLightHelper() {
	isDirectionalLightHelperEnabled = directionalLightHelperToggle.checked;
	updateDirectLightHelperToggle(isDirectionalLightHelperEnabled);
}

widthSlider.oninput = function () {
	widthValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};
heightSlider.oninput = function () {
	heightValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};
depthSlider.oninput = function () {
	depthValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};
segmentWidthSlider.oninput = function () {
	segmentWidthValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};
segmentHeightSlider.oninput = function () {
	segmentHeightValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};
segmentDepthSlider.oninput = function () {
	segmentDepthValue.value = this.value;
	updateCubeGeometry(
		widthSlider.value,
		heightSlider.value,
		depthSlider.value,
		segmentWidthSlider.value,
		segmentHeightSlider.value,
		segmentDepthSlider.value,
		isWireframeEnabled
	);
};

document
	.getElementById("button-birdEyePOV")
	.addEventListener("click", () => {
		setActiveCamera("birdseye");
	});

document
	.getElementById("button-thirdPersonPOV")
	.addEventListener("click", () => {
		setActiveCamera("thirdperson");
	});

document
	.getElementById("button-orbitalPOV")
	.addEventListener("click", () => {
		setActiveCamera("default");
	});
	
wireframeToggle.addEventListener("change", toggleWireframe);
shadowHelperToggle.addEventListener("change", toggleShadowHelper);
directionalLightHelperToggle.addEventListener(
	"change",
	toggleDirectionalLightHelper
);
updateSliderValues();
