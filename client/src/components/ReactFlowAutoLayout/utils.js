import { Position } from "reactflow";

export function getSourceHandlePosition(direction) {
  switch (direction) {
    case "TB":
      return Position.Bottom;
    case "BT":
      return Position.Top;
    case "LR":
      return Position.Right;
    case "RL":
      return Position.Left;
    default:
      break;
  }
}

export function getTargetHandlePosition(direction) {
  switch (direction) {
    case "TB":
      return Position.Top;
    case "BT":
      return Position.Bottom;
    case "LR":
      return Position.Left;
    case "RL":
      return Position.Right;
    default:
      break;
  }
}

export function getId() {
  return `${Date.now()}`;
}
