import * as THREE from "three";

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

enum SizeType {
  Unit,
  Percentage,
  Fraction,
}

type PercentageSize = { value: number; type: SizeType.Percentage };

type UnitSize = { value: number; type: SizeType.Unit };

type FractionSize = { value: number; type: SizeType.Fraction };

type ElementSize = PercentageSize | UnitSize | FractionSize;

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
        if (child.width.type === SizeType.Percentage) {
          child.width = {
            value: (child.width.value / 100) * this.width,
            type: SizeType.Unit,
          };
        }
      });

      let widthSum = 0;
      convertedChildren.forEach((child) => {
        if (child.width.type === SizeType.Unit) {
          widthSum += child.width.value;
        }
      });

      const widthLeft = this.width - widthSum;

      let fractionsSum = 0;
      convertedChildren.forEach((child) => {
        if (child.width.type === SizeType.Fraction) {
          fractionsSum += child.width.value;
        }
      });

      convertedChildren.forEach((child) => {
        if (child.width.type === SizeType.Fraction) {
          child.width = {
            value: (child.width.value / fractionsSum) * widthLeft,
            type: SizeType.Unit,
          };
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
