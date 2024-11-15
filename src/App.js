import React, { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import GraphResponse from "./components/GraphResponse/GraphResponse";
import Title from "./components/Sections/Title";

import "reactflow/dist/style.css";
import "swagger-ui-react/swagger-ui.css";
import "./App.css";

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
        res = {
          "request_id": "10514ef3-ee45-466b-b443-230036f906f6",
          "timestamp": "2024-11-14T21:41:09.998553",
          "miner_keys": [
            "5GE8x7wN7hpyEZPWsE9wRpqZ9fyX367aDEzGCfSkqsP6GHqV"
          ],
          "network": "commune",
          "query_hash": "c966d240100d4b604da50f8ae0e519e5842e732c375a9246c5ee59cc95257136",
          "response_hash": "4ab2cf0f76ef5a11eb0e89f76f27c38d38dd42a55ca10fc20b7d1ce4aaf4c703",
          "verified": false,
          "verifying_miners": [],
          "model_kind": "funds_flow",
          "query": "MATCH (a0:Address)-[t:TRANSACTION {block_height: 10000}]->(a1:Address) WITH COLLECT(DISTINCT { id: a0.address, type: 'node', label: 'address', address: a0.address }) AS source_addresses, COLLECT(DISTINCT { id: a1.address, type: 'node', label: 'address', address: a1.address }) AS target_addresses, COLLECT(DISTINCT { id: t.id, type: 'edge', block_height: t.block_height, transaction_type: t.type, timestamp: toString(t.timestamp), label: toString(t.amount/1000000000) + ' COMAI', from_id: a0.address, to_id: a1.address, amount: t.amount/1000000000 }) AS edges WITH source_addresses + target_addresses + edges AS elements UNWIND elements AS element RETURN DISTINCT element.id AS id, element.type AS type, element.label AS label, element.amount AS amount, element.timestamp AS timestamp, element.block_height AS block_height, element.transaction_type as transaction_type, element.address AS address, element.from_id AS from_id, element.to_id AS to_id",
          "response": {
            "result": [
              {
                "id": "5CiEy6vsRXHU64iBwmVaszU2ti16KE1RXo4eHiRLDb8oN72d",
                "type": "node",
                "label": "address",
                "address": "5CiEy6vsRXHU64iBwmVaszU2ti16KE1RXo4eHiRLDb8oN72d"
              },
              {
                "id": "5D7vGhfbhHJL2F4qtXzYQ9TdRVhtEyY2T7eWQRNRQxB3iQRG",
                "type": "node",
                "label": "address",
                "address": "5D7vGhfbhHJL2F4qtXzYQ9TdRVhtEyY2T7eWQRNRQxB3iQRG"
              },
              {
                "id": "10000-14",
                "tx_id": "10000-14",
                "type": "edge",
                "label": "11.0 COMAI",
                "amount": 11,
                "timestamp": "2024-02-15T17:16:00Z",
                "block_height": 10000,
                "transaction_type": "transfer",
                "from_id": "5CiEy6vsRXHU64iBwmVaszU2ti16KE1RXo4eHiRLDb8oN72d",
                "to_id": "5D7vGhfbhHJL2F4qtXzYQ9TdRVhtEyY2T7eWQRNRQxB3iQRG"
              }
            ],
            "result_hash_signature": "0c518402da4d08cb316ab6a905055c7d6343a76a7a24bc58a3ea14c17096d51b10a094782427ad3a1e5b7fa633de5f1f08dce21db84d22e8308f9b64fe877381",
            "result_hash": "113179fb0368a358c05e8b5684dd2ec135a2e95a7ad3cedf0c605b8b3dbe508f"
          }
        }
        return <GraphResponse response={res} />;
      }

      // For all other content types, render the default response body
      return <Original {...props} />;
    },
  },
});

function App() {
  const [swaggerData, setSwaggerData] = useState(null);
  const [error, setError] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);

  const url = window.location.href;
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;

  const operations = pathname.split("/")[1];
  const endpointDetails = pathname.split("/")[2];

  const [completed, setCompleted] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!BASE_URL) {
      setError(
        "Unable to connect to the API. Please check your network connection or contact support if the issue persists."
      );
      return;
    }

    // Fetch the OpenAPI schema from FastAPI backend
    fetch(`${BASE_URL}/openapi.json`)
      .then((response) => response.json())
      .then((data) => {
        // data servers use as BASE URL
        data.servers = [
          {
            url: BASE_URL,
          },
        ];

        Object.keys(data.paths).forEach((path) => {
          if (data.paths[path].get.operationId === endpointDetails) {
            data.paths[path].get.parameters.forEach((param) => {
              if (urlParams.has(param.name)) {
                param.schema.default = urlParams.get(param.name);
              }
            });
          }
        });

        // Set the modified schema to state
        setSwaggerData(data);
      })
      .catch((error) => {
        console.error("Error fetching OpenAPI schema:", error);
        setError("Failed to fetch API documentation. Please try again later.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (completed) {
      if (!operations) {
        return;
      }

      const endpointAccor = document.getElementById(
        `operations-${operations}-${endpointDetails}`
      );

      // Make sure the endpointAccor is found before proceeding
      if (!endpointAccor) {
        return;
      }

      const divChild = endpointAccor.getElementsByClassName(
        "opblock-control-arrow"
      );
      divChild[0].click();

      // prevent execute button clicked when no params
      if (urlParams.size === 0) {
        return;
      }

      // put some delay, to wait execute button rendered
      setTimeout(() => {
        const executeButton = endpointAccor.getElementsByClassName(
          "btn execute opblock-control__btn"
        );

        if (executeButton.length > 0) {
          executeButton[0].click();
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

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
              plugins={[graphPlugin]}
              docExpansion="list"
              tryItOutEnabled={true}
              requestInterceptor={(req) => {
                return req;
              }}
              onComplete={() => {
                setCompleted(true);
                // Locate and change the "Servers" label text
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
