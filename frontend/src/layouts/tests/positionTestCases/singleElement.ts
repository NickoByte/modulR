import {
  AlignElements,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
} from "../../AutoLayout";
import { Size } from "../../Sizes";
import { SingleElementCase } from "./PositionCase";
import * as THREE from "three";

export const singleElementColumnCases: Array<SingleElementCase> = [
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.Start,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, 4, 0),
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.End,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, -4, 0),
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, 0, 0),
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, 0, 0),
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, 0, 0),
  ],

  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.Start,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, -4),
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.End,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, -4, -4),
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 0, -4),
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 0, -4),
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 0, -4),
  ],
];

export const singleElementRowCases: Array<SingleElementCase> = [
  [
    "xy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.Start,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(-4, 4, 0),
  ],
  [
    "xy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.End,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(4, 4, 0),
  ],
  [
    "xy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],
  [
    "xy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],
  [
    "xy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],

  [
    "zy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.Start,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, -4),
  ],
  [
    "zy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.End,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 4),
  ],
  [
    "zy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],
  [
    "zy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],
  [
    "zy",
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    new LayoutElement(
      Size.Unit(2),
      Size.Unit(2),
      Size.Unit(2),
      new THREE.Object3D()
    ),
    new THREE.Vector3(0, 4, 0),
  ],
];
