import * as THREE from "three";

enum FlexDirection {
  Column,
  Row,
}

type FlexProps = {
  direction?: FlexDirection;
};

enum FlexGrow {}

type FlexLayoutElement = {
  width: number;
  height: number;
  group: THREE.Group;
};

class FlexLayout {
  constructor(
    private props: FlexProps,
    private width: number,
    private height: number,
    private children: FlexLayoutElement[]
  ) {}

  recalculate() {
    if (this.props.direction == FlexDirection.Row) {
      let startPositionX = 0;
      this.children.forEach((child) => {
        startPositionX += child.width / 2;
        child.group.position.setX(startPositionX);
        startPositionX += child.width / 2;
      });
    } else {
    }
  }
}

export { FlexLayout, FlexDirection, type FlexLayoutElement };
