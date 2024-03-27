import { AutoLayout } from "../AutoLayout";
import { Size } from "../Sizes";
import * as THREE from "three";
import { describe, expect, test } from "vitest";
import { columnStartCases } from "./positionTestCases/columnStart";
import { rowStartCases } from "./positionTestCases/rowStart";
import {
  singleElementColumnCases,
  singleElementRowCases,
} from "./positionTestCases/singleElement";

describe("AutoLayout", () => {
  describe("Child Position", () => {
    test.each(columnStartCases.concat(rowStartCases))(
      `Axes: %s, Direction: %s, Alignment: %s, Justify: %s`,
      (
        axes,
        direction,
        alignElements,
        justifyElements,
        layoutElements,
        expectedPositions
      ) => {
        const rootLayout = new AutoLayout(
          Size.Unit(10),
          Size.Unit(10),
          Size.Unit(10),
          new THREE.Group(),
          {
            planeAxes: axes,
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
        expect(firstChild.position.z).toBe(expectedPositions.position0.z);

        const secondChild = rootLayout.children[1];
        expect(secondChild.position.x).toBe(expectedPositions.position1.x);
        expect(secondChild.position.y).toBe(expectedPositions.position1.y);
        expect(secondChild.position.z).toBe(expectedPositions.position1.z);
      }
    );
  });

  describe("One Element Position", () => {
    test.each(singleElementColumnCases.concat(singleElementRowCases))(
      `Axes: %s, Direction: %s, Alignment: %s, Justify: %s`,
      (
        axes,
        direction,
        alignElements,
        justifyElements,
        layoutElement,
        expectedPosition
      ) => {
        const rootLayout = new AutoLayout(
          Size.Unit(10),
          Size.Unit(10),
          Size.Unit(10),
          new THREE.Group(),
          {
            planeAxes: axes,
            direction: direction,
            alignElements: alignElements,
            justifyElements: justifyElements,
          },
          [layoutElement]
        );

        rootLayout.recalculate();

        const child = rootLayout.children[0];
        expect(child.position.x).toBe(expectedPosition.x);
        expect(child.position.y).toBe(expectedPosition.y);
        expect(child.position.z).toBe(expectedPosition.z);
      }
    );
  });
});
