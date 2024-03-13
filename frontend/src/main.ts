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
} from "./layouts/AutoLayout";
import { ElementSize, Size } from "./layouts/Sizes";

const gui = new GUI();
let properties = { width: 10, height: 10 };
gui.add(properties, "width", 1, 100, 1).onChange((value: number) => {
  redrawLayout(value, properties.height);
});
gui.add(properties, "height", 1, 100, 1).onChange((value: number) => {
  redrawLayout(properties.width, value);
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

redrawLayout(properties.width, properties.height);

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

function redrawLayout(width: number, height: number) {
  cubesContainer.clear();

  const helperGeometry = new THREE.BoxGeometry(width, height, 0.1, 1, 1, 1);
  const helperMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
  const helperBox = new THREE.Mesh(helperGeometry, helperMaterial);
  helperBox.position.set(width / 2, height / 2, 0);
  cubesContainer.add(helperBox);

  const differentUnitsElements = [
    createLayoutElement(Size.Unit(1), Size.Unit(1), 0xff0000),
    createLayoutElement(Size.Unit(2), Size.Unit(2), 0x00ff00),
    createLayoutElement(Size.Fraction(1), Size.Fraction(1), 0x0000ff),
    createLayoutElement(Size.Fraction(2), Size.Fraction(1), 0xff0000),
    createLayoutElement(Size.Percentage(10), Size.Percentage(30), 0x00ff00),
    createLayoutElement(Size.Percentage(10), Size.Percentage(20), 0x0000ff),
  ];

  const differentUnitsLayout = new AutoLayout(
    {
      direction: LayoutDirection.Column,
      alignElements: AlignElements.End
    },
    width,
    height,
    differentUnitsElements
  );

  differentUnitsLayout.recalculate();

  differentUnitsElements.forEach((cube) => {
    cubesContainer.add(cube.group);
  });

  const justifyContentElements = [
    createLayoutElement(Size.Unit(1), Size.Unit(1), 0xff0000),
    createLayoutElement(Size.Unit(1), Size.Unit(1), 0x00ff00),
    createLayoutElement(Size.Unit(1), Size.Unit(1), 0xff0000),
  ];

  const justifyContentLayout = new AutoLayout(
    {
      direction: LayoutDirection.Column,
      alignElements: AlignElements.Stretch,
      justifyElements: JustifyElements.SpaceEvenly,
    },
    width,
    height,
    justifyContentElements
  );

  justifyContentLayout.recalculate();

  justifyContentElements.forEach((cube) => {
    cube.group.position.add(new THREE.Vector3(width, 0, 0));
    cubesContainer.add(cube.group);
  });

  scene.add(cubesContainer);
}
