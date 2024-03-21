import {
  AlignElements,
  AutoLayout,
  LayoutDirection,
  LayoutElement,
} from "../AutoLayout";
import { Size } from "../Sizes";
import * as THREE from "three";
import { describe, expect, it } from "vitest";

describe("AutoLayout", () => {
  it("AlignElements.Stretch expands children to fit parent's width when LayoutDirection.Column", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Stretch,
      },
      [
        new LayoutElement(
          Size.Unit(1),
          Size.Unit(1),
          Size.Unit(1),
          new THREE.Object3D()
        ),
      ]
    );

    rootLayout.recalculate();

    expect(rootLayout.children[0].height.value).toBe(1);
    expect(rootLayout.children[0].width.value).toBe(10);
  });

  it("AlignElements.Stretch expands children to fit parent's height when LayoutDirection.Row", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Row,
        alignElements: AlignElements.Stretch,
      },
      [
        new LayoutElement(
          Size.Unit(1),
          Size.Unit(1),
          Size.Unit(1),
          new THREE.Object3D()
        ),
      ]
    );

    rootLayout.recalculate();

    expect(rootLayout.children[0].height.value).toBe(10);
    expect(rootLayout.children[0].width.value).toBe(1);
  });

  it("children's dimensions converted to units when fractions given", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
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

  it("children's dimensions converted to units when percentage given", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Center,
      },
      [
        new LayoutElement(
          Size.Percentage(50),
          Size.Percentage(50),
          Size.Percentage(50),
          new THREE.Object3D()
        ),
      ]
    );

    rootLayout.recalculate();

    const child = rootLayout.children[0];
    expect(child.height.value).toBe(5);
    expect(child.width.value).toBe(5);
  });

  it("different size types converted properly to unit size when layout calculated", () => {
    const rootLayout = new AutoLayout(
      Size.Unit(10),
      Size.Unit(10),
      Size.Unit(10),
      new THREE.Group(),
      {
        direction: LayoutDirection.Column,
        alignElements: AlignElements.Center,
      },
      [
        new LayoutElement(
          Size.Percentage(50),
          Size.Percentage(50),
          Size.Percentage(50),
          new THREE.Object3D()
        ),
        new LayoutElement(
          Size.Unit(1),
          Size.Unit(1),
          Size.Unit(1),
          new THREE.Object3D()
        ),
        new LayoutElement(
          Size.Fraction(1),
          Size.Fraction(1),
          Size.Fraction(1),
          new THREE.Object3D()
        ),
      ]
    );

    rootLayout.recalculate();

    const firstChild = rootLayout.children[0];
    expect(firstChild.height.value).toBe(5);
    expect(firstChild.width.value).toBe(5);

    const secondChild = rootLayout.children[1];
    expect(secondChild.height.value).toBe(1);
    expect(secondChild.width.value).toBe(1);

    const thirdChild = rootLayout.children[2];
    expect(thirdChild.height.value).toBe(4);
    expect(thirdChild.width.value).toBe(10);
  });
});
