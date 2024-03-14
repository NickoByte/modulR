import * as THREE from "three";
import {
  ElementSize,
  FractionSize,
  PercentageSize,
  Size,
  UnitSize,
} from "./Sizes";

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

class LayoutElement {
  constructor(
    public width: ElementSize,
    public height: ElementSize,
    public sceneObject: THREE.Object3D
  ) {}
}

class AutoLayout extends LayoutElement {
  constructor(
    width: ElementSize,
    height: ElementSize,
    sceneObject: THREE.Object3D,
    private props: LayoutProps,
    public children: LayoutElement[]
  ) {
    super(width, height, sceneObject);
  }

  recalculate() {
    let getElementWidth = (element: LayoutElement): ElementSize =>
      element.width;
    let getElementHeight = (element: LayoutElement): ElementSize =>
      element.height;
    let setElementWidth = (element: LayoutElement, size: ElementSize): void => {
      element.width = size;
    };
    let setElementHeight = (
      element: LayoutElement,
      size: ElementSize
    ): void => {
      element.height = size;
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
      let cube =
        child.sceneObject instanceof THREE.Mesh
          ? (child.sceneObject as THREE.Mesh)
          : undefined;

      if (this.props.direction === LayoutDirection.Row) {
        child.sceneObject.position.setX(startPosition);

        if (cube) {
          const newGeometry = new THREE.BoxGeometry(
            getMainSize(child).value,
            getCrossSize(child).value,
            0.1,
            1,
            1,
            1
          );
          cube.geometry.dispose();
          cube.geometry = newGeometry;
        }
      } else {
        child.sceneObject.position.setY(startPosition);

        if (cube) {
          const newGeometry = new THREE.BoxGeometry(
            getCrossSize(child).value,
            getMainSize(child).value,
            0.1,
            1,
            1,
            1
          );
          cube.geometry.dispose();
          cube.geometry = newGeometry;
        }
      }
      startPosition += getMainSize(child).value / 2 + gapBetweenElements;
    });

    this.children.forEach((child) => {
      if (this.props.direction == LayoutDirection.Row) {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.sceneObject.position.setY(child.height.value / 2);
            break;
          case AlignElements.End:
            child.sceneObject.position.setY(
              this.height.value - child.height.value / 2
            );
            break;
          case AlignElements.Center:
            child.sceneObject.position.setY(this.height.value / 2);
            break;
          case AlignElements.Stretch:
            child.height = Size.Unit(10);
            child.sceneObject.position.setY(this.height.value / 2);

            let cube =
              child.sceneObject instanceof THREE.Mesh
                ? (child.sceneObject as THREE.Mesh)
                : undefined;
            if (cube) {
              const newGeometry = new THREE.BoxGeometry(
                child.width.value,
                this.height.value,
                0.1,
                1,
                1,
                1
              );
              cube.geometry.dispose();
              cube.geometry = newGeometry;
            }
            break;
        }
      } else {
        switch (this.props.alignElements) {
          case AlignElements.Start:
            child.sceneObject.position.setX(child.width.value / 2);
            break;
          case AlignElements.End:
            child.sceneObject.position.setX(
              this.width.value - child.width.value / 2
            );
            break;
          case AlignElements.Center:
            child.sceneObject.position.setX(this.width.value / 2);
            break;
          case AlignElements.Stretch:
            child.width = Size.Unit(10);
            child.sceneObject.position.setX(this.width.value / 2);

            let cube =
              child.sceneObject instanceof THREE.Mesh
                ? (child.sceneObject as THREE.Mesh)
                : undefined;
            if (cube) {
              const newGeometry = new THREE.BoxGeometry(
                this.width.value,
                child.height.value,
                0.1,
                1,
                1,
                1
              );
              cube.geometry.dispose();
              cube.geometry = newGeometry;
            }
            break;
        }
      }
    });

    this.children.forEach((child) => {
      if (child.sceneObject.parent) {
        child.sceneObject.position.sub(child.sceneObject.parent.position);
      }
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
  LayoutDirection,
  JustifyElements,
  AlignElements,
  LayoutElement,
  type LayoutProps,
};
