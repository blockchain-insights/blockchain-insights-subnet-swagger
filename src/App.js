import React, { useState, useEffect, useMemo } from "react";
import SwaggerUI from "swagger-ui-react";
import GraphResponse from "./components/GraphResponse/GraphResponse";
import Title from "./components/Sections/Title";
import TimeSeries from "./components/Graph/TimeSeries/TimeSeries";
import "reactflow/dist/style.css";
import "swagger-ui-react/swagger-ui.css";
import "./App.css";

const parseResponse = (body) => {
  try {
    return typeof body === "string" ? JSON.parse(body) : body;
  } catch (error) {
    console.error("Error parsing response data:", error);
    return null;
  }
};

const renderChart = (data, dataKey) => {
  if (!data?.response?.result?.data) {
    throw new Error("Invalid or empty response data.");
  }
  return <TimeSeries data={data} dataKey={dataKey} />;
};

const createResponsePlugin = (regex, dataKey) => () => ({
  wrapComponents: {
    responseBody: (Original) => (props) => {
      const { content: body, url, contentType } = props;
      if (regex.test(url) && contentType === "application/vnd.chart+json") {
        const parsedData = parseResponse(body);
        if (!parsedData) return <p>Error rendering data</p>;
        try {
          return renderChart(parsedData, dataKey);
        } catch (error) {
          return (
            <p style={{ color: "red" }}>
              Error rendering {dataKey} data: {error.message}
            </p>
          );
        }
      }
      return <Original {...props} />;
    },
  },
});

const plugins = [
  createResponsePlugin(
    /\/v1\/balance-tracking\/[^/]+\/deltas/,
    "balance_delta"
  ),
  createResponsePlugin(/\/v1\/balance-tracking\/[^/]+$/, "balance"),
  createResponsePlugin(
    /\/v1\/balance-tracking\/[^/]+\/timestamps/,
    "timestamps"
  ),
  () => ({
    wrapComponents: {
      responseBody: (Original) => (props) => {
        const { contentType, content: body } = props;
        if (contentType === "application/vnd.graph+json") {
          const parsedData = parseResponse(body);
          return parsedData ? (
            <GraphResponse response={parsedData} />
          ) : (
            <p>Error rendering graph data</p>
          );
        }
        return <Original {...props} />;
      },
    },
  }),
];

function App() {
  const [swaggerData, setSwaggerData] = useState(null);
  const [error, setError] = useState(null);
  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const { pathname } = new URL(window.location.href);
  const [completed, setCompleted] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!BASE_URL) {
      setError(
        "Unable to connect to the API. Please check your network connection or contact support."
      );
      return;
    }
    fetch(`${BASE_URL}/openapi.json`)
      .then((response) => response.json())
      .then((data) => {
        data.servers = [{ url: BASE_URL }];
        const [operations, endpointDetails] = pathname.split("/").slice(1, 3);
        Object.values(data.paths).forEach((path) => {
          const operation = path.get;
          if (operation.operationId === endpointDetails) {
            operation.parameters?.forEach((param) => {
              if (urlParams.has(param.name)) {
                param.schema.default = urlParams.get(param.name);
              }
            });
          }
        });
        setSwaggerData(data);
      })
      .catch(() =>
        setError("Failed to fetch API documentation. Please try again later.")
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BASE_URL, pathname]);

  useEffect(() => {
    if (completed) {
      const [operations, endpointDetails] = pathname.split("/").slice(1, 3);
      if (!operations) return;

      const endpointAccor = document.getElementById(
        `operations-${operations}-${endpointDetails}`
      );
      if (!endpointAccor) return;

      const [arrowButton] = endpointAccor.getElementsByClassName(
        "opblock-control-arrow"
      );
      arrowButton?.click();

      if (urlParams.size === 0) return;
      setTimeout(() => {
        const [executeButton] = endpointAccor.getElementsByClassName(
          "btn execute opblock-control__btn"
        );
        executeButton?.click();
      }, 1000);
    }
  }, [completed, pathname, urlParams]);

  return (
    <div className="App">
      <header className="App-header">
        <Title />
      </header>
      <main>
        <div className="font-trap">
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : swaggerData ? (
            <SwaggerUI
              spec={swaggerData}
              plugins={plugins}
              docExpansion="list"
              tryItOutEnabled
              onComplete={() => {
                setCompleted(true);
                const serverLabel = document.querySelector(
                  ".swagger-ui .servers-title"
                );
                if (serverLabel) {
                  serverLabel.textContent =
                    "API Documentation with Custom Graph View";
                }
              }}
            />
          ) : (
            <p>Loading API documentation...</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
