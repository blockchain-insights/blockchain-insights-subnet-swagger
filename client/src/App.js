import React, { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "reactflow/dist/style.css";
import { MarkerType, ReactFlowProvider } from "reactflow";
import GraphAutoLayout from "./components/GraphAutoLayout/GraphAutoLayout";

// Custom plugin to render a graph for 'application/vnd.graph+json' responses
const graphPlugin = (system) => ({
  wrapComponents: {
    responseBody: (Original, system) => (props) => {
      const contentType = props.contentType;
      const { content: body } = props;

      // Check if the response type is graph (custom media type)
      if (contentType === "application/vnd.graph+json") {
        let res;

        // If it's a string, parse it; otherwise, use it directly
        try {
          res = typeof body === "string" ? JSON.parse(body) : body;
        } catch (error) {
          console.error("Error parsing graph data", error);
          return <p>Error rendering graph data</p>;
        }

        console.log("Response:", res);
        let graphData;
        const replyFormatted = res.reply;

        for (let i = 0; i < replyFormatted.length; i++) {
          const el = replyFormatted[i];

          if (el.type === "graph") {
            const allNodes = el.result
              .filter((val) => val.type === "node")
              .map((val) => {
                return {
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
                };
              });

            const currentGraph = {
              nodes: allNodes,
              edges: el.result
                .filter((val) => val.type === "edge")
                .map((val) => {
                  return {
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
                  };
                }),
            };

            graphData = currentGraph;
          }
        }

        return (
          <div style={{ height: graphData?.nodes.length === 0 ? "fit-content" : "640px", width: "100%", border: "1px solid #000000", borderRadius: "4px", padding: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ margin: 0 }}>Graph View:</h3>
            {(!graphData || graphData?.nodes.length === 0) && <p style={{ margin: 0 }}>No Graph Data for this id</p>}
            <div style={{ height: "100%", width: "100%" }}>
              {graphData && graphData.nodes.length > 0 && (
                <ReactFlowProvider>
                  <GraphAutoLayout graphData={graphData} />
                </ReactFlowProvider>
              )}
            </div>
          </div>
        );
      }

      // For all other content types, render the default response body
      return <Original {...props} />;
    },
  },
});

function App() {
  const [swaggerData, setSwaggerData] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const responseType = urlParams.get("response_type");

  useEffect(() => {
    // Fetch the OpenAPI schema from FastAPI backend
    fetch("http://localhost:8000/openapi.json")
      .then((response) => response.json())
      .then((data) => {
        // Modify the spec with dynamic query parameters
        Object.keys(data.paths).forEach((path) => {
          data.paths[path].get.parameters.forEach((param) => {
            if (param.name === "id" && id) {
              param.schema.default = id; // Dynamically set the 'id'
            }
            if (param.name === "response_type" && responseType) {
              param.schema.default = responseType; // Dynamically set the 'response_type'
            }
          });
        });

        // Set the modified schema to state
        setSwaggerData(data);
      })
      .catch((error) => console.error("Error fetching OpenAPI schema:", error));
  }, [id, responseType]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>API Documentation with Custom Graph View</h1>
        {swaggerData ? (
          <SwaggerUI
            spec={swaggerData}
            plugins={[graphPlugin]}
            docExpansion="full"
            tryItOutEnabled={true}
            requestInterceptor={(req) => {
              console.log("Request intercepted", req);
              return req;
            }}
            onComplete={() => {
              setTimeout(() => {
                const executeButton = document.getElementsByClassName(
                  "btn execute opblock-control__btn"
                );
                if (executeButton) {
                  executeButton[0].click();
                }
              }, 1000);
            }}
          />
        ) : (
          <p>Loading API documentation...</p>
        )}
      </header>
    </div>
  );
}

export default App;
