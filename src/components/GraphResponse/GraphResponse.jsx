import React, { useMemo } from "react";
import { MarkerType, ReactFlowProvider } from "reactflow";
import GraphAutoLayout from "../GraphAutoLayout/GraphAutoLayout";

const GraphResponse = React.memo(({ response }) => {
  const graphData = useMemo(() => {
    const data = response?.response?.result?.data;
    const network = response?.network;

    // Early returns for invalid data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return undefined;
    }

    if (network === "bitcoin") {
      const allNodes = Object.values(
        data
          .filter((val) => val.type === "node")
          .reduce(
            (acc, val) => ({
              ...acc,
              [val.id]: {
                ...val,
                id: val.id,
                type: val.label,
                position: {
                  x: 100,
                  y: 100,
                },
                data: {
                  title: val.label,
                  timestamp: val.timestamp,
                  blockHeight: val.block_height,
                },
              },
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
                ...val,
                type: "smoothstep",
                id: val.id,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "#FFC29A",
                },
                style: {
                  stroke: "#FFC29A",
                },
                label: val.label,
                source: val.from_id,
                target: val.to_id,
              },
            }),
            {}
          )
      );
      return {
        nodes: allNodes,
        edges: allEdges,
      };
    }
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
