import {
  AlignElements,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
} from "../../AutoLayout";
import { Size } from "../../Sizes";
import { PositionCase } from "./PositionCase";
import * as THREE from "three";

export const columnStartCases: Array<PositionCase> = [
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.Start,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 4, 0),
      position1: new THREE.Vector3(-4, 2, 0),
    },
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.End,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, -2, 0),
      position1: new THREE.Vector3(-4, -4, 0),
    },
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 2.5, 0),
      position1: new THREE.Vector3(-4, -2.5, 0),
    },
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 4, 0),
      position1: new THREE.Vector3(-4, -4, 0),
    },
  ],
  [
    "xy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 2, 0),
      position1: new THREE.Vector3(-4, -2, 0),
    },
  ],

  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.Start,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(0, 4, -4),
      position1: new THREE.Vector3(0, 2, -4),
    },
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.End,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(0, -2, -4),
      position1: new THREE.Vector3(0, -4, -4),
    },
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(0, 2.5, -4),
      position1: new THREE.Vector3(0, -2.5, -4),
    },
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(0, 4, -4),
      position1: new THREE.Vector3(0, -4, -4),
    },
  ],
  [
    "zy",
    LayoutDirection.Column,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(0, 2, -4),
      position1: new THREE.Vector3(0, -2, -4),
    },
  ],
];
