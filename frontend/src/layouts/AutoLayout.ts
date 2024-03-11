import * as THREE from "three";
import { ElementSize, FractionSize, PercentageSize, Size, UnitSize } from "./Sizes";

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

enum AlignElements {
  Start,
  End,
  Center,
  Stretch,
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
  alignElements?: AlignElements;
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
  ) { }

  recalculate() {
    let getElementWidth = (element: LayoutElement): ElementSize => element.width;
    let getElementHeight = (element: LayoutElement): ElementSize => element.height;
    let setElementWidth = (element: LayoutElement, size: ElementSize): void => { element.width = size; }
    let setElementHeight = (element: LayoutElement, size: ElementSize): void => { element.height = size; }

    let mainAxisSize: number;
    let crossAxisSize: number;
    let getMainSize = getElementWidth;
    let getCrossSize = getElementHeight;
    let setMainSize = setElementWidth;
    let setCrossSize = setElementHeight;

    if (this.props.direction == LayoutDirection.Row) {
      mainAxisSize = this.width;
      crossAxisSize = this.height;
      getMainSize = getElementWidth;
      getCrossSize = getElementHeight;
      setMainSize = setElementWidth;
      setCrossSize = setElementHeight;
    } else {
      mainAxisSize = this.height;
      crossAxisSize = this.width;
      getMainSize = getElementHeight;
      getCrossSize = getElementWidth;
      setMainSize = setElementHeight;
      setCrossSize = setElementWidth;
    }

    this.children.forEach((child) => {
      let size = getMainSize(child);
      if (size instanceof PercentageSize) {
        setMainSize(child, size.asUnitSize(mainAxisSize));
        setCrossSize(child, size.asUnitSize(crossAxisSize));
      }
    });

    const unitSizes = this.children
      .filter((c) => getMainSize(c) instanceof UnitSize)
      .map((c) => getMainSize(c) as UnitSize);
    const totalUnits = this.getTotalUnits(unitSizes);
    const remainingSpace = mainAxisSize - totalUnits;

    const fractionSizes = this.children
      .filter((c) => getMainSize(c) instanceof FractionSize)
      .map((c) => getMainSize(c) as FractionSize);
    const totalFractions = this.getTotalFractions(fractionSizes);

    this.children.forEach((child) => {
      let size = getMainSize(child);
      if (size instanceof FractionSize) {
        setMainSize(child, size.asUnitSize(
          remainingSpace,
          totalFractions
        ));
        setCrossSize(child, Size.Unit(crossAxisSize));
      }
    });

    let startPosition = 0;
    let gapBetweenElements = 0;
    if (totalFractions === 0) {
      switch (this.props.justifyElements) {
        case JustifyElements.Center:
          startPosition = remainingSpace / 2;
          break;
        case JustifyElements.End:
          startPosition = remainingSpace;
          break;
        case JustifyElements.SpaceEvenly:
          startPosition = remainingSpace / (this.children.length + 1);
          gapBetweenElements = remainingSpace / (this.children.length + 1);
          break;
        case JustifyElements.SpaceBetween:
          gapBetweenElements = remainingSpace / (this.children.length - 1);
          break;
        case JustifyElements.SpaceAround:
          const gap = remainingSpace / (this.children.length * 2);
          startPosition = gap;
          gapBetweenElements = gap * 2;
      }
    }

    this.children.forEach((child) => {
      startPosition += getMainSize(child).value / 2;

      if (this.props.direction === LayoutDirection.Row) {
        child.group.position.setX(startPosition);
        child.group.scale.setX(getMainSize(child).value);
        child.group.scale.setY(getCrossSize(child).value);
      } else {
        child.group.position.setY(startPosition);
        child.group.scale.setX(getCrossSize(child).value);
        child.group.scale.setY(getMainSize(child).value);
      }
      startPosition += getMainSize(child).value / 2 + gapBetweenElements;
    });

    this.children.forEach((child) => {
      if (this.props.direction == LayoutDirection.Row) {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.group.position.setY(child.height.value / 2);
            break;
          case AlignElements.End:
            child.group.position.setY(this.height - (child.height.value / 2));
            break;
          case AlignElements.Center:
            child.group.position.setY((this.height / 2));
            break;
          case AlignElements.Stretch:
            child.group.position.setY((this.height / 2));
            child.group.scale.setY(this.height);
            break;
        }
      } else {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.group.position.setX(child.width.value / 2);
            break;
          case AlignElements.End:
            child.group.position.setX(this.width - (child.width.value / 2));
            break;
          case AlignElements.Center:
            child.group.position.setX((this.width / 2));
            break;
          case AlignElements.Stretch:
            child.group.position.setX((this.width / 2));
            child.group.scale.setX(this.width);
            break;
        }
      }
    })
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

export { AutoLayout, LayoutDirection, JustifyElements, AlignElements, type LayoutElement };
