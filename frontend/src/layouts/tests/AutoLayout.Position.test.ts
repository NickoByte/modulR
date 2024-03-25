import { AutoLayout } from "../AutoLayout";
import { Size } from "../Sizes";
import * as THREE from "three";
import { describe, expect, test } from "vitest";
import { columnStartCases } from "./positionTestCases/columnStart";
import { rowStartCases } from "./positionTestCases/rowStart";

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
});
