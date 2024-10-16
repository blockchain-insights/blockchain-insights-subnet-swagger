import React, { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";

import "reactflow/dist/style.css";
import "swagger-ui-react/swagger-ui.css";

import GraphResponse from "./components/GraphResponse/GraphResponse";

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


        return (
          <GraphResponse response={res} />
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

  const url = window.location.href;
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;

  const operations = pathname.split("/")[1];
  const endpointDetails = pathname.split("/")[2];

  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    // Fetch the OpenAPI schema from FastAPI backend
    fetch("https://validator-api-prod.azurewebsites.net/openapi.json")
      .then((response) => response.json())
      .then((data) => {
        // data servers use as BASE URL
        data.servers = [
          {
            "url": "http://185.239.209.254:9900"
          }
        ];

        Object.keys(data.paths).forEach((path) => {
          if (data.paths[path].get.operationId === endpointDetails) {
            data.paths[path].get.parameters.forEach((param) => {
              if (urlParams.has(param.name)) {
                param.schema.default = urlParams.get(param.name)
              }
            })
          }
        });

        // Set the modified schema to state
        setSwaggerData(data);
      })
      .catch((error) => console.error("Error fetching OpenAPI schema:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (completed) {
      if (!operations) {
        return;
      }

      const endpointAccor = document.getElementById(`operations-${operations}-${endpointDetails}`)

      // Make sure the endpointAccor is found before proceeding
      if (!endpointAccor) {
        return;
      }

      const divChild = endpointAccor.getElementsByClassName("opblock-control-arrow")
      divChild[0].click();

      // put some delay, to wait execute button rendered
      setTimeout(() => {
        const executeButton = endpointAccor.getElementsByClassName(
          "btn execute opblock-control__btn"
        );

        if (executeButton.length > 0) {
          executeButton[0].click();
        }
      }, 1000)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed])

  return (
    <div className="App">
      <header className="App-header">
        <h1>API Documentation with Custom Graph View</h1>
        {swaggerData ? (
          <SwaggerUI
            spec={swaggerData}
            plugins={[graphPlugin]}
            docExpansion="list"
            tryItOutEnabled={true}
            requestInterceptor={(req) => {
              return req;
            }}
            onComplete={() => {
              setCompleted(true);
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
