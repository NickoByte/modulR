import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  FlexLayout,
  FlexDirection,
  FlexLayoutElement,
} from "./layouts/FlexLayout";

const gui = new GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubes = [
  createLayoutElement(2, 1, 0.1, 0xff0000),
  createLayoutElement(1, 1, 0.1, 0x00ff00),
  createLayoutElement(3, 1, 0.1, 0x0000ff),
];

const cubesLayout = new FlexLayout(
  { direction: FlexDirection.Row },
  100,
  100,
  cubes
);
cubes.forEach((cube) => {
  console.log(cube.group);
  scene.add(cube.group);
});
cubesLayout.recalculate();
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

function createLayoutElement(
  sizeX: number = 1,
  sizeY: number = 1,
  sizeZ: number = 1,
  color: THREE.ColorRepresentation = 0xffffff
): FlexLayoutElement {
  const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  return {
    width: sizeX,
    height: sizeY,
    group: new THREE.Group().add(cube),
  };
}
