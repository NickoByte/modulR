import * as THREE from "three";
import {
  ElementSize,
  FractionSize,
  PercentageSize,
  Size,
  UnitSize,
} from "./Sizes";
import { axisToSizePropName, getDepthAxis } from "./util";

enum LayoutDirection {
  Column = "Column",
  Row = "Row",
}

type PlaneAxes = "xy" | "zy";

type Axis = "x" | "y" | "z";
type AxisSize = "width" | "height" | "depth";
type AxisProps = {
  name: Axis;
  sizeName: AxisSize;
};

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
  planeAxes?: PlaneAxes;
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
    const mainAxisName = this.props.planeAxes![0] as Axis;
    const crossAxisName = this.props.planeAxes![1] as Axis;
    const depthAxisName = getDepthAxis(this.props.planeAxes!);
    const mainAxisProps = {
      name: mainAxisName,
      sizeName: axisToSizePropName(mainAxisName),
    };
    const crossAxisProps = {
      name: crossAxisName,
      sizeName: axisToSizePropName(crossAxisName),
    };
    const depthAxisProps = {
      name: depthAxisName,
      sizeName: axisToSizePropName(depthAxisName),
    };

    let mainAxisLength = this[mainAxisProps.sizeName].value;
    let crossAxisLength = this[crossAxisProps.sizeName].value;

    this.children.forEach((child) => {
      let size = child[mainAxisProps.sizeName];
      if (size instanceof PercentageSize) {
        child[mainAxisProps.sizeName] = size.asUnitSize(mainAxisLength);
        child[crossAxisProps.sizeName] = size.asUnitSize(crossAxisLength);
      }
    });

    const unitSizes = this.children
      .filter((child) => child[mainAxisProps.sizeName] instanceof UnitSize)
      .map((child) => child[mainAxisProps.sizeName] as UnitSize);
    const totalUnits = this.getTotalUnits(unitSizes);
    const remainingSpace = mainAxisLength - totalUnits;

    const fractionSizes = this.children
      .filter((child) => child[mainAxisProps.sizeName] instanceof FractionSize)
      .map((child) => child[mainAxisProps.sizeName] as FractionSize);
    const totalFractions = this.getTotalFractions(fractionSizes);

    this.children.forEach((child) => {
      let size = child[mainAxisProps.sizeName];
      if (size instanceof FractionSize) {
        child[mainAxisProps.sizeName] = size.asUnitSize(
          remainingSpace,
          totalFractions
        );
        child[crossAxisProps.sizeName] = Size.Unit(crossAxisLength);
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
        currentPositionMain += child[mainAxisProps.sizeName].value / 2;
        child.position[mainAxisProps.name] = currentPositionMain;
        currentPositionMain +=
          child[mainAxisProps.sizeName].value / 2 + gapBetweenElements;
      } else {
        currentPositionMain -= child[mainAxisProps.sizeName].value / 2;
        child.position[crossAxisProps.name] = currentPositionMain;
        currentPositionMain -=
          child[mainAxisProps.sizeName].value / 2 + gapBetweenElements;
      }
    });

    this.children.forEach((child) => {
      switch (this.props.alignElements) {
        case AlignElements.Start:
          child.position[crossAxisProps.name] =
            (this[crossAxisProps.sizeName].value -
              child[crossAxisProps.sizeName].value) /
            2;
          break;
        case AlignElements.End:
          child.position[crossAxisProps.name] =
            -(
              this[crossAxisProps.sizeName].value -
              child[crossAxisProps.sizeName].value
            ) / 2;
          break;
        case AlignElements.Center:
          child.position[crossAxisProps.name] = 0;
          break;
        case AlignElements.Stretch:
          child[crossAxisProps.sizeName] = Size.Unit(
            this[crossAxisProps.sizeName].value
          );
          child.position[crossAxisProps.name] = 0;
          break;
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
          child.depth.value,
          1,
          1,
          1
        );
        cube.geometry.dispose();
        cube.geometry = newGeometry;
      }

      child.sceneObject.position.setX(child.position.x);
      child.sceneObject.position.setY(child.position.y);
      child.sceneObject.position.setZ(child.position.z);
      child.sceneObject.parent = this.sceneObject;

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
  type PlaneAxes,
  type Axis,
  LayoutDirection,
  JustifyElements,
  AlignElements,
  LayoutElement,
  type LayoutProps,
};
