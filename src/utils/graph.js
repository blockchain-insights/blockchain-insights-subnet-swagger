import dagre from "@dagrejs/dagre";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from "d3-force";
import { Position } from "reactflow";
import collide from "./collide";
import { produce } from "immer";

const simulation = forceSimulation()
  .force("charge", forceManyBody().strength(-1000))
  .force("x", forceX().x(0).strength(0.05))
  .force("y", forceY().y(0).strength(0.05))
  .force("collide", collide())
  .alphaTarget(0.05)
  .stop();

export const getForceLayoutedElements = (nodes, edges) => {
  const nodesDatum = nodes.map((node) => ({
    ...node,
    id: node.id,
    x: node.position.x,
    y: node.position.y,
  }));
  const edgesDatum = edges.map((edge) => ({ ...edge }));

  simulation.nodes(nodesDatum).force(
    "link",
    forceLink(edgesDatum)
      .id((d) => d.id)
      .strength(0.05)
      .distance(400),
  );

  simulation.tick(1200);

  const layoutedNodes = produce(nodes, (draft) => {
    draft.forEach((node, index) => {
      node.position.x = nodesDatum[index].x;
      node.position.y = nodesDatum[index].y;
    });
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 320;
const nodeHeight = 80;

export const getTreeLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: "left",
      sourcePosition: "right",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2 + 40,
        y: nodeWithPosition.y - nodeHeight / 2 + 40,
      },
    };
  });

  return { nodes: newNodes, edges };
};

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.width / 2;
  const y1 = targetPosition.y + targetNode.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
