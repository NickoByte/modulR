import * as THREE from "three";

enum FlexDirection {
  Column,
  Row,
}

enum FlexGrow {}

type FlexLayoutElement = {
  width: number;
  height: number;
  group: THREE.Group;
};

class FlexLayout {
  constructor(
    private direction: FlexDirection = FlexDirection.Row,
    private width: number,
    private height: number,
    private children: FlexLayoutElement[]
  ) {}

  recalculate() {
    if (this.direction == FlexDirection.Row) {
      let startPositionX = 0;
      this.children.forEach((child) => {
        child.group.position.setX(startPositionX);
        startPositionX += child.width;
      });
    } else {
    }
  }
}

export { FlexLayout, FlexDirection, type FlexLayoutElement };
