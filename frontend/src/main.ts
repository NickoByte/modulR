import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  AutoLayout,
  LayoutElement,
  LayoutDirection,
  JustifyElements,
  AlignElements,
  LayoutProps,
  LayoutAxes,
} from "./layouts/AutoLayout";
import { ElementSize, Size } from "./layouts/Sizes";
import {
  createDifferentUnitsLayout,
  createNestedLayout,
} from "./layouts/examples/differentUnitsElements";

const gui = new GUI();
let properties = { width: 10, height: 10, depth: 10 };
gui.add(properties, "width", 1, 100, 1).onChange((value: number) => {
  redrawLayout(value, properties.height, properties.depth);
});
gui.add(properties, "height", 1, 100, 1).onChange((value: number) => {
  redrawLayout(properties.width, value, properties.depth);
});
gui.add(properties, "depth", 1, 100, 1).onChange((value: number) => {
  redrawLayout(properties.width, properties.height, value);
});

const scene = new THREE.Scene();
const cubesContainer = new THREE.Group();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

redrawLayout(properties.width, properties.height, properties.width);

camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

function redrawLayout(width: number, height: number, depth: number) {
  cubesContainer.clear();

  const helperGeometry = new THREE.BoxGeometry(width, height, 0.1, 1, 1, 1);
  const helperMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.1,
    transparent: true,
  });
  const helperBox = new THREE.Mesh(helperGeometry, helperMaterial);
  cubesContainer.add(helperBox);

  // const differentUnitsLayoutXY = createDifferentUnitsLayout(
  //   width,
  //   height,
  //   depth,
  //   LayoutAxes.XY
  // );
  // differentUnitsLayoutXY.recalculate();
  // addLayoutElementsToScene(differentUnitsLayoutXY, -width * 1.1);

  const nestedLayout = createNestedLayout(width, height, depth);
  nestedLayout.recalculate();
  addLayoutElementsToScene(nestedLayout, width * 1.1);

  const differentUnitsLayoutZY = createDifferentUnitsLayout(
    width,
    height,
    depth,
    LayoutAxes.ZY
  );
  differentUnitsLayoutZY.recalculate();
  addLayoutElementsToScene(differentUnitsLayoutZY, 0);

  function addLayoutElementsToScene(layout: AutoLayout, displacementX: number) {
    cubesContainer.add(layout.sceneObject);
    layout.children.forEach((child) => {
      child.sceneObject.position.add(new THREE.Vector3(displacementX, 0, 0));
      cubesContainer.add(child.sceneObject);
    });
  }
  scene.add(cubesContainer);
}
