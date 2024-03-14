import {
  AlignElements,
  AutoLayout,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
} from "../AutoLayout";
import { ElementSize, Size } from "../Sizes";
import * as THREE from "three";
import { describe, expect, it, test } from "vitest";

type PositionCase = [
  LayoutDirection,
  AlignElements,
  ElementSize,
  ElementSize,
  number,
  number
];
const columnCases: Array<PositionCase> = [
  [
    LayoutDirection.Column,
    AlignElements.Start,
    Size.Unit(1),
    Size.Unit(1),
    0.5,
    0.5,
  ],
  [
    LayoutDirection.Column,
    AlignElements.Center,
    Size.Unit(1),
    Size.Unit(1),
    5,
    0.5,
  ],
  [
    LayoutDirection.Column,
    AlignElements.End,
    Size.Unit(1),
    Size.Unit(1),
    9.5,
    0.5,
  ],
  [
    LayoutDirection.Column,
    AlignElements.Stretch,
    Size.Unit(1),
    Size.Unit(1),
    5,
    0.5,
  ],
];

const rowCases: Array<PositionCase> = [
  [
    LayoutDirection.Row,
    AlignElements.Start,
    Size.Unit(1),
    Size.Unit(1),
    0.5,
    0.5,
  ],
  [
    LayoutDirection.Row,
    AlignElements.Center,
    Size.Unit(1),
    Size.Unit(1),
    0.5,
    5,
  ],
  [
    LayoutDirection.Row,
    AlignElements.End,
    Size.Unit(1),
    Size.Unit(1),
    0.5,
    9.5,
  ],
  [
    LayoutDirection.Row,
    AlignElements.Stretch,
    Size.Unit(1),
    Size.Unit(1),
    0.5,
    5,
  ],
];

describe("AutoLayout", () => {
  describe("Child Position", () => {
    test.each(columnCases.concat(rowCases))(
      `Direction: %s, Alignment: %s, %o, %o, (%f, %f)`,
      (direction, alignElements, width, height, expectedX, expectedY) => {
        const rootLayout = new AutoLayout(
          Size.Unit(10),
          Size.Unit(10),
          new THREE.Group(),
          {
            direction: direction,
            alignElements: alignElements,
          },
          [new LayoutElement(width, height, new THREE.Object3D())]
        );

        rootLayout.recalculate();

        const child = rootLayout.children[0];
        expect(child.position.x).toBe(expectedX);
        expect(child.position.y).toBe(expectedY);
      }
    );
  });

  it(`Nested layout positioning`, () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Row,
        alignElements: AlignElements.Center,
        justifyElements: JustifyElements.Center,
      },
      [
        new AutoLayout(
          Size.Unit(8),
          Size.Unit(8),
          new THREE.Group(),
          {
            direction: LayoutDirection.Column,
            alignElements: AlignElements.Center,
            justifyElements: JustifyElements.Center,
          },
          [
            new LayoutElement(Size.Unit(2), Size.Unit(2), new THREE.Object3D()),
            new LayoutElement(Size.Unit(2), Size.Unit(2), new THREE.Object3D()),
          ]
        ),
      ]
    );

    rootLayout.recalculate();

    const nestedLayout = rootLayout.children[0] as AutoLayout;
    expect(nestedLayout.position.x).toBe(0);
    expect(nestedLayout.position.y).toBe(0);

    const firstNestedChild = nestedLayout.children[0];
    expect(firstNestedChild.position.x).toBe(0);
    expect(firstNestedChild.position.y).toBe(1);

    const secondNestedChild = nestedLayout.children[1];
    expect(secondNestedChild.position.x).toBe(0);
    expect(secondNestedChild.position.y).toBe(-1);
  });
});
