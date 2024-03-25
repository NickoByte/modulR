import {
  AlignElements,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
  PlaneAxes,
} from "../../AutoLayout";
import * as THREE from "three";

export type PositionCaseElements = {
  element0: LayoutElement;
  element1: LayoutElement;
};

export type ExpectedPositions = {
  position0: THREE.Vector3;
  position1: THREE.Vector3;
};

export type PositionCase = [
  PlaneAxes,
  LayoutDirection,
  AlignElements,
  JustifyElements,
  PositionCaseElements,
  ExpectedPositions
];
