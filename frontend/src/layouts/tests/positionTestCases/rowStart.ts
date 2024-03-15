import {
  AlignElements,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
} from "../../AutoLayout";
import { Size } from "../../Sizes";
import { PositionCase } from "./PositionCase";
import * as THREE from "three";

export const rowStartCases: Array<PositionCase> = [
  [
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.Start,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 4, 0),
      position1: new THREE.Vector3(-2, 4, 0),
    },
  ],
  [
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.End,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(2, 4, 0),
      position1: new THREE.Vector3(4, 4, 0),
    },
  ],
  [
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceAround,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-2.5, 4, 0),
      position1: new THREE.Vector3(2.5, 4, 0),
    },
  ],
  [
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceBetween,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-4, 4, 0),
      position1: new THREE.Vector3(4, 4, 0),
    },
  ],
  [
    LayoutDirection.Row,
    AlignElements.Start,
    JustifyElements.SpaceEvenly,
    {
      element0: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
      element1: new LayoutElement(
        Size.Unit(2),
        Size.Unit(2),
        new THREE.Object3D()
      ),
    },
    {
      position0: new THREE.Vector3(-2, 4, 0),
      position1: new THREE.Vector3(2, 4, 0),
    },
  ],
];
