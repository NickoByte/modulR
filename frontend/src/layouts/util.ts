import { Axis, LayoutElement, PlaneAxes } from "./AutoLayout";

export function getDepthAxis(plane: PlaneAxes) {
  switch (plane) {
    case "xy":
      return "z";
    case "zy":
      return "x";
  }
}

type SizePropNames = "width" | "height" | "depth";
const nameof = <T>(name: keyof T) => name;

export function axisToSizePropName(axis: Axis): SizePropNames {
  switch (axis) {
    case "x":
      return "width";
    case "y":
      return "height";
    case "z":
      return "depth";
  }
}
