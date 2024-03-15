import {
  AlignElements,
  AutoLayout,
  JustifyElements,
  LayoutDirection,
  LayoutElement,
} from "../AutoLayout";
import { Size } from "../Sizes";
import * as THREE from "three";
import { describe, expect, it, test } from "vitest";
import { columnStartCases } from "./positionTestCases/columnStart";
import { rowStartCases } from "./positionTestCases/rowStart";

describe("AutoLayout", () => {
  describe("Child Position", () => {
    test.each(columnStartCases.concat(rowStartCases))(
      `Direction: %s, Alignment: %s, Justify: %s`,
      (
        direction,
        alignElements,
        justifyElements,
        layoutElements,
        expectedPositions
      ) => {
        const rootLayout = new AutoLayout(
          Size.Unit(10),
          Size.Unit(10),
          new THREE.Group(),
          {
            direction: direction,
            alignElements: alignElements,
            justifyElements: justifyElements,
          },
          [layoutElements.element0, layoutElements.element1]
        );

        rootLayout.recalculate();

        const firstChild = rootLayout.children[0];
        expect(firstChild.position.x).toBe(expectedPositions.position0.x);
        expect(firstChild.position.y).toBe(expectedPositions.position0.y);

        const secondChild = rootLayout.children[1];
        expect(secondChild.position.x).toBe(expectedPositions.position1.x);
        expect(secondChild.position.y).toBe(expectedPositions.position1.y);
      }
    );
  });

  // it(`Nested layout positioning`, () => {
  //   const rootLayout = new AutoLayout(
  //     Size.Unit(10),
  //     Size.Unit(10),
  //     new THREE.Group(),
  //     {
  //       direction: LayoutDirection.Row,
  //       alignElements: AlignElements.Center,
  //       justifyElements: JustifyElements.Center,
  //     },
  //     [
  //       new AutoLayout(
  //         Size.Unit(8),
  //         Size.Unit(8),
  //         new THREE.Group(),
  //         {
  //           direction: LayoutDirection.Column,
  //           alignElements: AlignElements.Center,
  //           justifyElements: JustifyElements.Center,
  //         },
  //         [
  //           new LayoutElement(Size.Unit(2), Size.Unit(2), new THREE.Object3D()),
  //           new LayoutElement(Size.Unit(2), Size.Unit(2), new THREE.Object3D()),
  //         ]
  //       ),
  //     ]
  //   );

  //   rootLayout.recalculate();

  //   const nestedLayout = rootLayout.children[0] as AutoLayout;
  //   expect(nestedLayout.position.x).toBe(0);
  //   expect(nestedLayout.position.y).toBe(0);

  //   const firstNestedChild = nestedLayout.children[0];
  //   expect(firstNestedChild.position.x).toBe(0);
  //   expect(firstNestedChild.position.y).toBe(1);

  //   const secondNestedChild = nestedLayout.children[1];
  //   expect(secondNestedChild.position.x).toBe(0);
  //   expect(secondNestedChild.position.y).toBe(-1);
  // });
});
