import { ElementSize, Size } from "../Sizes";
import * as THREE from "three";
import {
  AutoLayout,
  LayoutElement,
  LayoutDirection,
  JustifyElements,
  AlignElements,
  LayoutProps,
  PlaneAxes,
} from "../AutoLayout";

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

const differentUnitsElements = () => [
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
    Size.Fraction(2),
    Size.Fraction(2),
    0xff0000
  ),
  createLayoutElement(
    Size.Percentage(10),
    Size.Percentage(10),
    Size.Percentage(10),
    0x00ff00
  ),
  createLayoutElement(
    Size.Percentage(20),
    Size.Percentage(20),
    Size.Percentage(20),
    0x0000ff
  ),
];

export const createDifferentUnitsLayout = (
  width: number,
  height: number,
  depth: number,
  axes: PlaneAxes
): AutoLayout =>
  new AutoLayout(
    Size.Unit(width),
    Size.Unit(height),
    Size.Unit(depth),
    new THREE.Group(),
    {
      planeAxes: axes,
      direction: LayoutDirection.Column,
      alignElements: AlignElements.End,
    },
    differentUnitsElements()
  );

const justifyContentElements = [
  createLayoutElement(Size.Unit(4), Size.Unit(4), Size.Unit(4), 0xff0000),
  createAutoLayout(
    Size.Fraction(1),
    Size.Fraction(1),
    Size.Fraction(1),
    {
      planeAxes: "xy",
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
          planeAxes: "xy",
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

export const createNestedLayout = (
  width: number,
  height: number,
  depth: number
): AutoLayout =>
  new AutoLayout(
    Size.Unit(width),
    Size.Unit(height),
    Size.Unit(depth),
    new THREE.Group(),
    {
      planeAxes: "xy",
      direction: LayoutDirection.Row,
      alignElements: AlignElements.Stretch,
      justifyElements: JustifyElements.SpaceEvenly,
    },
    justifyContentElements
  );
