import {
  AlignElements,
  AutoLayout,
  LayoutDirection,
  LayoutElement,
} from "./AutoLayout";
import { Size } from "./Sizes";
import * as THREE from "three";
import { describe, expect, it } from "vitest";

describe("AutoLayout", () => {
  it("AlignElements.Stretch expands children to fit parent's width when LayoutDirection.Column", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Stretch,
      },
      [new LayoutElement(Size.Unit(1), Size.Unit(1), new THREE.Object3D())]
    );

    rootLayout.recalculate();

    expect(rootLayout.children[0].height.value).toBe(1);
    expect(rootLayout.children[0].width.value).toBe(10);
  });

  it("AlignElements.Stretch expands children to fit parent's height when LayoutDirection.Row", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Row,
        alignElements: AlignElements.Stretch,
      },
      [new LayoutElement(Size.Unit(1), Size.Unit(1), new THREE.Object3D())]
    );

    rootLayout.recalculate();

    expect(rootLayout.children[0].height.value).toBe(10);
    expect(rootLayout.children[0].width.value).toBe(1);
  });

  it("children's dimensions converted to units when fractions given", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Center,
      },
      [
        new LayoutElement(
          Size.Fraction(1),
          Size.Fraction(1),
          new THREE.Object3D()
        ),
      ]
    );

    rootLayout.recalculate();

    const child = rootLayout.children[0];
    expect(child.height.value).toBe(10);
    expect(child.width.value).toBe(10);
  });
});
