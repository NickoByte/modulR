import * as THREE from "three";
import {
  ElementSize,
  FractionSize,
  PercentageSize,
  Size,
  UnitSize,
} from "./Sizes";

enum LayoutDirection {
  Column = "Column",
  Row = "Row",
}

enum LayoutAxes {
  XY = "XY",
  ZY = "ZY",
}

enum JustifyElements {
  Start = "Start",
  End = "End",
  Center = "Center",
  SpaceBetween = "SpaceBetween",
  SpaceAround = "SpaceAround",
  SpaceEvenly = "SpaceEvenly",
}

enum AlignElements {
  Start = "Start",
  End = "End",
  Center = "Center",
  Stretch = "Stretch",
}

type LayoutPadding = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type LayoutProps = {
  axes?: LayoutAxes;
  direction?: LayoutDirection;
  gap?: number;
  padding?: LayoutPadding;
  justifyElements?: JustifyElements;
  alignElements?: AlignElements;
};

class LayoutElement {
  public position: THREE.Vector3;

  constructor(
    public width: ElementSize,
    public height: ElementSize,
    public depth: ElementSize,
    public sceneObject: THREE.Object3D,
    position?: THREE.Vector3
  ) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.position = position ?? new THREE.Vector3();
    this.sceneObject = sceneObject;
  }
}

class AutoLayout extends LayoutElement {
  constructor(
    width: ElementSize,
    height: ElementSize,
    depth: ElementSize,
    sceneObject: THREE.Object3D,
    private props: LayoutProps,
    public children: LayoutElement[],
    position?: THREE.Vector3
  ) {
    super(width, height, depth, sceneObject, position);
  }

  recalculate() {
    let getElementWidth = (element: LayoutElement): ElementSize =>
      element.width;
    let getElementHeight = (element: LayoutElement): ElementSize =>
      element.height;
    let getElementDepth = (element: LayoutElement): ElementSize =>
      element.depth;

    let setElementWidth = (element: LayoutElement, size: ElementSize): void => {
      element.width = size;
    };
    let setElementHeight = (
      element: LayoutElement,
      size: ElementSize
    ): void => {
      element.height = size;
    };
    let setElementDepth = (element: LayoutElement, size: ElementSize): void => {
      element.depth = size;
    };

    let mainAxisSize: number;
    let crossAxisSize: number;
    let getMainSize = getElementWidth;
    let getCrossSize = getElementHeight;
    let setMainSize = setElementWidth;
    let setCrossSize = setElementHeight;

    if (this.props.direction == LayoutDirection.Row) {
      mainAxisSize = this.width.value;
      crossAxisSize = this.height.value;
      getMainSize = getElementWidth;
      getCrossSize = getElementHeight;
      setMainSize = setElementWidth;
      setCrossSize = setElementHeight;
    } else {
      mainAxisSize = this.height.value;
      crossAxisSize = this.width.value;
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
        setMainSize(child, size.asUnitSize(remainingSpace, totalFractions));
        setCrossSize(child, Size.Unit(crossAxisSize));
      }
    });

    let currentPositionMain =
      this.props.direction == LayoutDirection.Row
        ? -this.width.value / 2
        : this.height.value / 2;
    let gapBetweenElements = 0;
    if (totalFractions === 0) {
      switch (this.props.justifyElements) {
        case JustifyElements.Center:
          currentPositionMain +=
            this.props.direction == LayoutDirection.Row
              ? remainingSpace / 2
              : -remainingSpace / 2;
          break;
        case JustifyElements.End:
          currentPositionMain +=
            this.props.direction == LayoutDirection.Row
              ? remainingSpace
              : -remainingSpace;
          break;
        case JustifyElements.SpaceEvenly:
          currentPositionMain +=
            this.props.direction == LayoutDirection.Row
              ? remainingSpace / (this.children.length + 1)
              : -(remainingSpace / (this.children.length + 1));
          gapBetweenElements = remainingSpace / (this.children.length + 1);
          break;
        case JustifyElements.SpaceBetween:
          gapBetweenElements = remainingSpace / (this.children.length - 1);
          break;
        case JustifyElements.SpaceAround:
          const gap = remainingSpace / (this.children.length * 2);
          currentPositionMain +=
            this.props.direction == LayoutDirection.Row ? gap : -gap;
          gapBetweenElements = gap * 2;
      }
    }

    this.children.forEach((child) => {
      if (this.props.direction === LayoutDirection.Row) {
        currentPositionMain += getMainSize(child).value / 2;
        child.position.setX(currentPositionMain);
        currentPositionMain +=
          getMainSize(child).value / 2 + gapBetweenElements;
      } else {
        currentPositionMain -= getMainSize(child).value / 2;
        child.position.setY(currentPositionMain);
        currentPositionMain -=
          getMainSize(child).value / 2 + gapBetweenElements;
      }
    });

    this.children.forEach((child) => {
      if (this.props.direction == LayoutDirection.Row) {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.position.setY((this.height.value - child.height.value) / 2);
            break;
          case AlignElements.End:
            child.position.setY(-(this.height.value - child.height.value) / 2);
            break;
          case AlignElements.Center:
            child.position.setY(0);
            break;
          case AlignElements.Stretch:
            child.height = Size.Unit(this.height.value);
            child.position.setY(0);
            break;
        }
      } else {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.position.setX(-(this.width.value - child.width.value) / 2);
            break;
          case AlignElements.End:
            child.position.setX((this.width.value - child.width.value) / 2);
            break;
          case AlignElements.Center:
            child.position.setX(0);
            break;
          case AlignElements.Stretch:
            child.width = Size.Unit(this.width.value);
            child.position.setX(0);
            break;
        }
      }
    });

    this.children.forEach((child) => {
      let cube =
        child.sceneObject instanceof THREE.Mesh
          ? (child.sceneObject as THREE.Mesh)
          : undefined;
      if (cube) {
        const newGeometry = new THREE.BoxGeometry(
          child.width.value,
          child.height.value,
          0.1,
          1,
          1,
          1
        );
        cube.geometry.dispose();
        cube.geometry = newGeometry;
      }

      child.sceneObject.position.setX(child.position.x);
      child.sceneObject.position.setY(child.position.y);

      if (child instanceof AutoLayout) {
        child.recalculate();
      }
    });
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

export {
  AutoLayout,
  LayoutAxes,
  LayoutDirection,
  JustifyElements,
  AlignElements,
  LayoutElement,
  type LayoutProps,
};
