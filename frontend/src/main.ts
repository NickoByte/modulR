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

function createLayoutElement(
  sizeX: ElementSize,
  sizeY: ElementSize,
  sizeZ: ElementSize,
  color: THREE.ColorRepresentation = 0xffffff
): LayoutElement {
  const geometry = new THREE.BoxGeometry(1, 1, 0.1);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  return new LayoutElement(sizeX, sizeY, sizeZ, cube);
}

function createAutoLayout(
  sizeX: ElementSize,
  sizeY: ElementSize,
  sizeZ: ElementSize,
  props: LayoutProps,
  children: LayoutElement[]
): AutoLayout {
  const group = new THREE.Group();
  children.forEach((child) => {
    group.add(child.sceneObject);
  });
  return new AutoLayout(sizeX, sizeY, sizeZ, group, props, children);
}

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

  const differentUnitsElements = [
    createLayoutElement(Size.Unit(1), Size.Unit(1), Size.Unit(1), 0xff0000),
    createLayoutElement(Size.Unit(2), Size.Unit(2), Size.Unit(2), 0x00ff00),
    createLayoutElement(
      Size.Fraction(1),
      Size.Fraction(1),
      Size.Fraction(1),
      0x0000ff
    ),
    createLayoutElement(
      Size.Fraction(2),
      Size.Fraction(1),
      Size.Fraction(1),
      0xff0000
    ),
    createLayoutElement(
      Size.Percentage(10),
      Size.Percentage(30),
      Size.Percentage(30),
      0x00ff00
    ),
    createLayoutElement(
      Size.Percentage(10),
      Size.Percentage(20),
      Size.Percentage(20),
      0x0000ff
    ),
  ];

  const differentUnitsLayout = new AutoLayout(
    Size.Unit(width),
    Size.Unit(height),
    Size.Unit(depth),
    new THREE.Group(),
    {
      direction: LayoutDirection.Column,
      alignElements: AlignElements.End,
    },
    differentUnitsElements
  );

  differentUnitsLayout.recalculate();

  differentUnitsElements.forEach((cube) => {
    cube.sceneObject.position.setX(cube.position.x + width + 1);
    cubesContainer.add(cube.sceneObject);
  });

  const differentUnitsElementsZ = [
    createLayoutElement(Size.Unit(1), Size.Unit(1), Size.Unit(1), 0xff0000),
    createLayoutElement(Size.Unit(2), Size.Unit(2), Size.Unit(2), 0x00ff00),
    createLayoutElement(
      Size.Fraction(1),
      Size.Fraction(1),
      Size.Fraction(1),
      0x0000ff
    ),
    createLayoutElement(
      Size.Fraction(2),
      Size.Fraction(1),
      Size.Fraction(1),
      0xff0000
    ),
    createLayoutElement(
      Size.Percentage(10),
      Size.Percentage(30),
      Size.Percentage(30),
      0x00ff00
    ),
    createLayoutElement(
      Size.Percentage(10),
      Size.Percentage(20),
      Size.Percentage(20),
      0x0000ff
    ),
  ];

  const differentUnitsLayoutZ = new AutoLayout(
    Size.Unit(width),
    Size.Unit(height),
    Size.Unit(depth),
    new THREE.Group(),
    {
      axes: LayoutAxes.ZY,
      direction: LayoutDirection.Column,
      alignElements: AlignElements.End,
    },
    differentUnitsElementsZ
  );

  differentUnitsLayoutZ.recalculate();

  differentUnitsElementsZ.forEach((cube) => {
    cube.sceneObject.position.setX(cube.position.x - width - 1);
    cubesContainer.add(cube.sceneObject);
  });

  const justifyContentElements = [
    createLayoutElement(Size.Unit(4), Size.Unit(1), Size.Unit(1), 0xff0000),
    createAutoLayout(
      Size.Fraction(1),
      Size.Fraction(1),
      Size.Fraction(1),
      {
        axes: LayoutAxes.XY,
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Stretch,
      },
      [
        createLayoutElement(Size.Unit(2), Size.Unit(2), Size.Unit(2), 0xfff000),
        createAutoLayout(
          Size.Fraction(1),
          Size.Fraction(1),
          Size.Fraction(1),
          {
            axes: LayoutAxes.XY,
            direction: LayoutDirection.Column,
            alignElements: AlignElements.Stretch,
            justifyElements: JustifyElements.SpaceAround,
          },
          [
            createLayoutElement(
              Size.Fraction(1),
              Size.Unit(1),
              Size.Unit(1),
              0x000fff
            ),
            createLayoutElement(
              Size.Fraction(1),
              Size.Unit(1),
              Size.Unit(1),
              0x000fff
            ),
            createLayoutElement(
              Size.Fraction(1),
              Size.Unit(1),
              Size.Unit(1),
              0x000fff
            ),
          ]
        ),
        createLayoutElement(Size.Unit(1), Size.Unit(1), Size.Unit(1), 0xfff000),
      ]
    ),
    createLayoutElement(Size.Unit(1), Size.Unit(1), Size.Unit(1), 0xff0000),
  ];

  const justifyContentLayout = new AutoLayout(
    Size.Unit(width),
    Size.Unit(height),
    Size.Unit(depth),
    new THREE.Group(),
    {
      axes: LayoutAxes.XY,
      direction: LayoutDirection.Row,
      alignElements: AlignElements.Stretch,
      justifyElements: JustifyElements.SpaceEvenly,
    },
    justifyContentElements
  );

  justifyContentLayout.recalculate();

  justifyContentElements.forEach((element) => {
    cubesContainer.add(element.sceneObject);
  });

  scene.add(cubesContainer);
}
