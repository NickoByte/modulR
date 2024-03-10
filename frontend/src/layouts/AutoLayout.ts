import * as THREE from "three";
import { ElementSize, FractionSize, PercentageSize, UnitSize } from "./Sizes";

enum LayoutDirection {
  Column,
  Row,
}

enum JustifyElements {
  Start,
  End,
  Center,
  SpaceBetween,
  SpaceAround,
  SpaceEvenly,
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
  justifyElements?: JustifyElements;
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
      let gapBetweenElements = 0;
      if (totalWidthFractions === 0) {
        switch (this.props.justifyElements) {
          case JustifyElements.Center:
            startPositionX = remainingSpace / 2;
            break;
          case JustifyElements.End:
            startPositionX = remainingSpace;
            break;
          case JustifyElements.SpaceEvenly:
            startPositionX = remainingSpace / (this.children.length + 1);
            gapBetweenElements = remainingSpace / (this.children.length + 1);
            break;
          case JustifyElements.SpaceBetween:
            gapBetweenElements = remainingSpace / (this.children.length - 1);
            break;
          case JustifyElements.SpaceAround:
            const gap = remainingSpace / (this.children.length * 2);
            startPositionX = gap;
            gapBetweenElements = gap * 2;
        }
      }
      this.children.forEach((child) => {
        startPositionX += child.width.value / 2;
        child.group.position.setX(startPositionX);
        child.group.scale.setX(child.width.value);
        startPositionX += child.width.value / 2 + gapBetweenElements;
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

export { AutoLayout, LayoutDirection, JustifyElements, type LayoutElement };
