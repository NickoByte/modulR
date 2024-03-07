import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  AutoLayout,
  LayoutElement,
  LayoutDirection,
  ElementSize,
  SizeType,
} from "./layouts/FlexLayout";

const gui = new GUI();
let properties = { width: 10 };
gui.add(properties, "width", 1, 100, 1).onChange((value): any => {
  redrawLayout(value);
});

const scene = new THREE.Scene();
const cubesContainer = new THREE.Group();
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

redrawLayout(properties.width);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

function createLayoutElement(
  sizeX: ElementSize,
  sizeY: ElementSize,
  color: THREE.ColorRepresentation = 0xffffff
): LayoutElement {
  const geometry = new THREE.BoxGeometry(1, 1, 0.1);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  return {
    width: sizeX,
    height: sizeY,
    group: new THREE.Group().add(cube),
  };
}

function redrawLayout(width: number) {
  cubesContainer.clear();

  const cubes = [
    createLayoutElement(
      { value: 1, type: SizeType.Unit },
      { value: 1, type: SizeType.Unit },
      0xff0000
    ),
    createLayoutElement(
      { value: 2, type: SizeType.Unit },
      { value: 1, type: SizeType.Unit },
      0x00ff00
    ),
    createLayoutElement(
      { value: 1, type: SizeType.Fraction },
      { value: 1, type: SizeType.Fraction },
      0x0000ff
    ),
    createLayoutElement(
      { value: 2, type: SizeType.Fraction },
      { value: 2, type: SizeType.Fraction },
      0xff0000
    ),
    createLayoutElement(
      { value: 10, type: SizeType.Percentage },
      { value: 10, type: SizeType.Percentage },
      0x00ff00
    ),
    createLayoutElement(
      { value: 10, type: SizeType.Percentage },
      { value: 10, type: SizeType.Percentage },
      0x0000ff
    ),
  ];

  const cubesLayout = new AutoLayout(
    { direction: LayoutDirection.Row },
    width,
    1,
    cubes
  );

  cubes.forEach((cube) => {
    cubesContainer.add(cube.group);
  });

  scene.add(cubesContainer);

  cubesLayout.recalculate();
}
