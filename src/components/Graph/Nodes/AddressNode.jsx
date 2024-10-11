import { Handle, Position } from "reactflow";

export function AddressNode({ id, data }) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        style={{ display: "none" }}
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ display: "none" }}
        isConnectable={true}
      />
      <a
        href={`https://blockchain.com/explorer/addresses/btc/${id}`}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "100%" }}>
          <div
            style={{
              zIndex: 50,
              display: "flex",
              width: "20rem",
              flexDirection: "column",
              gap: "0.75rem",
              wordBreak: "break-all",
              borderRadius: "0.5rem",
              border: "1px solid",
              backgroundColor: "white",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: "1",
              color: "#000000"
            }}
          >
            <p style={{ margin: 0 }}>{data.title}</p>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 400,
                margin: 0,
                color: "rgba(0, 0, 0, 0.6)",
              }}
            >
              {id}
            </p>
          </div>
        </div>
      </a>
    </>
  );
}
