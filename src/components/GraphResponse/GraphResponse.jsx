import React, { useMemo } from "react";
import { MarkerType, ReactFlowProvider } from "reactflow";
import GraphAutoLayout from "../GraphAutoLayout/GraphAutoLayout";

// Utility functions
const createBaseNode = (val) => ({
  ...val,
  id: val.id,
  type: val.label,
  position: { x: 100, y: 100 },
  data: {
    title: val.label,
    timestamp: val.timestamp,
    blockHeight: val.block_height,
  },
});

const createBaseEdge = (val) => ({
  ...val,
  type: "smoothstep",
  id: val.id,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#FFC29A",
  },
  style: { stroke: "#FFC29A" },
  source: val.from_id,
  target: val.to_id,
});

// Network-specific edge label creators
const createBitcoinEdgeLabel = (val) => val.label;

const createCommuneEdgeLabel = (val) => (
  <div className="flex flex-col">
    <div className="flex gap-1 w-full text-center justify-center mb-1 capitalize">
      {val.transaction_type}
    </div>
    <div className="flex gap-1 justify-center">
      <strong>tx_id:</strong>
      {val.id}
    </div>
    <div className="flex gap-1 justify-center">
      <strong>amount:</strong>
      {val.label}
    </div>
  </div>
);

const processGraphData = (data, network) => {
  const allNodes = Object.values(
    data
      .filter((val) => val.type === "node")
      .reduce(
        (acc, val) => ({
          ...acc,
          [val.id]: createBaseNode(val),
        }),
        {}
      )
  );

  const allEdges = Object.values(
    data
      .filter((val) => val.type === "edge")
      .reduce(
        (acc, val) => ({
          ...acc,
          [val.id]: {
            ...createBaseEdge(val),
            label:
              network === "bitcoin"
                ? createBitcoinEdgeLabel(val)
                : createCommuneEdgeLabel(val),
          },
        }),
        {}
      )
  );

  return { nodes: allNodes, edges: allEdges };
};

const GraphResponse = React.memo(({ response }) => {
  const graphData = useMemo(() => {
    const data = response?.response?.result?.data;
    const network = response?.network;

    if (!data?.length || !Array.isArray(data)) return undefined;
    if (!["bitcoin", "commune"].includes(network)) return undefined;

    return processGraphData(data, network);
  }, [response]);

  return (
    <div
      style={{
        height: !graphData ? "fit-content" : "500px",
        border: "1px solid #000000",
        borderRadius: "4px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h3 style={{ margin: 0 }}>Graph View:</h3>
      {!graphData && <p style={{ margin: 0 }}>No data</p>}
      {graphData && (
        <ReactFlowProvider>
          <GraphAutoLayout graphData={graphData} />
        </ReactFlowProvider>
      )}
    </div>
  );
});

export default GraphResponse;
