import React, { useMemo } from "react";
import { MarkerType, ReactFlowProvider } from "reactflow";
import GraphAutoLayout from "../GraphAutoLayout/GraphAutoLayout";

const GraphResponse = React.memo(({ response }) => {
  const graphData = useMemo(() => {
    // if no results means no return data
    if (!response?.response?.result) {
      return undefined;
    }

    // if not an array, means data structure not fit
    if (!Array.isArray(response.response?.result)) {
      return undefined;
    }

    // if the length is 0 means no data
    if (response.response.result.length === 0) {
      return undefined;
    }

    const allNodes = response.response.result
      .filter((val) => val.type === "node")
      .map((val) => ({
        ...val,
        id: val.id,
        type: val.label,
        position: {
          x: 100,
          y: 100,
        },
        data: {
          title: val.label,
          timestamp: 1714482843274,
          blockHeight: val.block_height,
        },
      }));

    return {
      nodes: allNodes,
      edges: response.response.result
        .filter((val) => val.type === "edge")
        .map((val) => ({
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
        })),
    };
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
