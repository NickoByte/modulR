import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FlexLayout, FlexDirection } from "./layouts/FlexLayout";

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
  { width: 2, height: 1, group: createCube() },
  { width: 1, height: 1, group: createCube() },
];

const cubesLayout = new FlexLayout(FlexDirection.Row, 100, 100, cubes);
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

function createCube(
  sizeX: number = 1,
  sizeY: number = 1,
  sizeZ: number = 1
): THREE.Group {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  return new THREE.Group().add(cube);
}
