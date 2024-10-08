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
      >
        <div className="flex flex-col gap-1">
          <div className="z-50 flex h-20 w-80 flex-col gap-1 text-wrap break-all rounded-lg border bg-white p-3 text-base font-semibold leading-none text-text-dark dark:border-[#171718] dark:bg-[#171718] dark:text-white">
            <p>{data.title}</p>
            <p className="text-sm font-normal text-text-dark/60 dark:text-white/60">
              {id}
            </p>
          </div>
        </div>
      </a>
    </>
  );
}
