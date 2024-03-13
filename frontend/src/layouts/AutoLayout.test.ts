import { AlignElements, AutoLayout, JustifyElements, LayoutDirection, LayoutElement } from "./AutoLayout";
import { Size } from "./Sizes";
import * as THREE from "three";

test("vertical auto layout with nested auto layout", () => {
  const rootLayout = new AutoLayout(Size.Unit(10), Size.Unit(10), new THREE.Group(),
    {
      direction: LayoutDirection.Row,
      alignElements: AlignElements.Stretch,
      justifyElements: JustifyElements.SpaceEvenly,
    },
    [
      new LayoutElement(Size.Unit(1), Size.Unit(1), new THREE.Object3D())
    ]);

  rootLayout.recalculate();

  expect(rootLayout.children[0].height.value).toBe(10);
});
