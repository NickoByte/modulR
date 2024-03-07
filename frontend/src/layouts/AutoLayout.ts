import * as THREE from "three";
import { ElementSize, FractionSize, PercentageSize, UnitSize } from "./Sizes";

enum LayoutDirection {
  Column,
  Row,
}

type LayoutPadding = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type LayoutProps = {
  direction?: LayoutDirection;
  gap?: number;
  padding?: LayoutPadding;
};

type LayoutElement = {
  width: ElementSize;
  height: ElementSize;
  group: THREE.Group;
};
class AutoLayout {
  constructor(
    private props: LayoutProps,
    private width: number,
    private height: number,
    private children: LayoutElement[]
  ) {}

  recalculate() {
    if (this.props.direction == LayoutDirection.Row) {
      const convertedChildren = [...this.children];
      convertedChildren.forEach((child) => {
        if (child.width instanceof PercentageSize) {
          child.width = child.width.asUnitSize(this.width);
        }
      });

      let widthSum = 0;
      convertedChildren.forEach((child) => {
        if (child.width instanceof UnitSize) {
          widthSum += child.width.value;
        }
      });

      const widthLeft = this.width - widthSum;

      let fractionsSum = 0;
      convertedChildren.forEach((child) => {
        if (child.width instanceof FractionSize) {
          fractionsSum += child.width.value;
        }
      });

      convertedChildren.forEach((child) => {
        if (child.width instanceof FractionSize) {
          child.width = child.width.asUnitSize(widthLeft, fractionsSum);
        }
      });

      let startPositionX = 0;
      this.children.forEach((child) => {
        startPositionX += child.width.value / 2;
        child.group.position.setX(startPositionX);
        child.group.scale.setX(child.width.value);
        startPositionX += child.width.value / 2;
      });
    } else {
    }
  }
}

export {
  AutoLayout,
  LayoutDirection,
  SizeType,
  type LayoutElement,
  type ElementSize,
};

export { type PercentageSize, type UnitSize, type FractionSize };
