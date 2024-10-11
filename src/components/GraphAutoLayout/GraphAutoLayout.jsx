import { useEffect } from "react";

import ReactFlow, {
  MarkerType,
  useReactFlow,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "reactflow";

import useAutoLayout from "./useAutoLayout";

import nodeTypes from "./graph/nodeTypes";
import edgeTypes from "./graph/edgeTypes";

const proOptions = {
  account: "paid-pro",
  hideAttribution: true,
};

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#FFC29A",
  },
  pathOptions: { offset: 5 },
  style: {
    stroke: "#FFC29A",
  },
};

/**
 * This example shows how you can automatically arrange your nodes after adding child nodes to your graph.
 */
function GraphAutoLayout(props) {
  const { fitView } = useReactFlow();
  const dataGraph = props.graphData;

  const [nodes, , onNodesChange] = useNodesState(dataGraph.nodes);
  const [edges, , onEdgesChange] = useEdgesState(dataGraph.edges);

  // this hook handles the computation of the layout once the elements or the direction changes
  useAutoLayout();

  // every time our nodes change, we want to center the graph again
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={true}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      proOptions={proOptions}
      zoomOnDoubleClick={true}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    />
  );
}

export default GraphAutoLayout;
