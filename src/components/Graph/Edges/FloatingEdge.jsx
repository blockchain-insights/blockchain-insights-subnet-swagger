import { useCallback } from "react";
import {
  useStore,
  getBezierPath,
  EdgeLabelRenderer,
} from "reactflow";
import { getEdgeParams } from "../../../utils/graph";

export function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  label,
}) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path z-50"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              zIndex: 50,
              borderRadius: "0.5rem",
              border: "1px solid rgba(163, 163, 163, 0.2)",
              backgroundColor: "#e1c29a",
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: "#615842",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
