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
      this.children.forEach((child) => {
        if (child.width instanceof PercentageSize) {
          child.width = child.width.asUnitSize(this.width);
        }
      });

      const widthUnits = this.children
        .filter((c) => c.width instanceof UnitSize)
        .map((c) => c.width);
      const totalWidthUnits = this.getTotalUnits(widthUnits);
      const remainingSpace = this.width - totalWidthUnits;

      const widthFractions = this.children
        .filter((c) => c.width instanceof FractionSize)
        .map((c) => c.width as FractionSize);
      const totalWidthFractions = this.getTotalFractions(widthFractions);

      this.children.forEach((child) => {
        if (child.width instanceof FractionSize) {
          child.width = child.width.asUnitSize(
            remainingSpace,
            totalWidthFractions
          );
        }
      });

      let startPositionX = 0;
      this.children.forEach((child) => {
        startPositionX += child.width.value / 2;
        child.group.position.setX(startPositionX);
        child.group.scale.setX(child.width.value);
        startPositionX += child.width.value / 2;
      });
    } else if (this.props.direction == LayoutDirection.Column) {
    }
  }

  private getTotalFractions(sizes: FractionSize[]): number {
    let fractionsSum = 0;
    sizes.forEach((size) => {
      fractionsSum += size.value;
    });
    return fractionsSum;
  }

  private getTotalUnits(sizes: UnitSize[]): number {
    let totalUnits = 0;
    sizes.forEach((size) => {
      totalUnits += size.value;
    });
    return totalUnits;
  }
}

export { AutoLayout, LayoutDirection, type LayoutElement };
