from enum import Enum
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse

app = FastAPI(
    title="My API",
    version="1.0.0",
    description="API Documentation",
    servers=[
        {"url": "http://localhost:8000"}  # Tell Swagger UI the correct base URL
    ]
)

# Define an Enum for response types
class ResponseType(str, Enum):
    json = "json"
    text = "text"
    graph = "graph"


# Allow requests from React frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/items", responses={
    200: {
        "content": {
            "application/json": {},
            "text/plain": {},
            "application/vnd.graph+json": {}  # Custom media type for graph
        },
        "description": "Returns a list of items in different formats",
    }
})
async def get_items(response_type: ResponseType = Query(ResponseType.json)):
    items = {
        'message_variation_id': 'fd042b33-cb92-4e6b-990c-ceb1a79c44f6',
        'reply': [
            {
                'type': 'graph',
                'result': [
                    {'id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r', 'type': 'node', 'label': 'address'},
                    {'id': 'bc1qt64756h9aylujm9tpk826zndegpxtngmr6eqad', 'type': 'node', 'label': 'address'},
                    {'id': '72817836237a2f2d092a74eb92a7de40f51299cecbdb65cbd3c39e8d24e3e72b', 'type': 'node', 'label': 'transaction', 'balance': 4.64123559, 'timestamp': 1717498134, 'block_height': 846480},
                    {'id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r-72817836237a2f2d092a74eb92a7de40f51299cecbdb65cbd3c39e8d24e3e72b', 'type': 'edge', 'label': '4.64135588 BTC', 'from_id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r', 'to_id': '72817836237a2f2d092a74eb92a7de40f51299cecbdb65cbd3c39e8d24e3e72b'},
                    {'id': '72817836237a2f2d092a74eb92a7de40f51299cecbdb65cbd3c39e8d24e3e72b-bc1qt64756h9aylujm9tpk826zndegpxtngmr6eqad', 'type': 'edge', 'label': '4.64123559 BTC', 'from_id': '72817836237a2f2d092a74eb92a7de40f51299cecbdb65cbd3c39e8d24e3e72b', 'to_id': 'bc1qt64756h9aylujm9tpk826zndegpxtngmr6eqad'},
                    {'id': 'ac63dd04edcc256108bb8a052d748adbc3d8d0a7022c2aa19636059add2de94a', 'type': 'node', 'label': 'transaction', 'balance': 0.96618373, 'timestamp': 1717486552, 'block_height': 846462},
                    {'id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r-ac63dd04edcc256108bb8a052d748adbc3d8d0a7022c2aa19636059add2de94a', 'type': 'edge', 'label': '0.96662572 BTC', 'from_id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r', 'to_id': 'ac63dd04edcc256108bb8a052d748adbc3d8d0a7022c2aa19636059add2de94a'},
                    {'id': 'ac63dd04edcc256108bb8a052d748adbc3d8d0a7022c2aa19636059add2de94a-bc1qt64756h9aylujm9tpk826zndegpxtngmr6eqad', 'type': 'edge', 'label': '0.96618373 BTC', 'from_id': 'ac63dd04edcc256108bb8a052d748adbc3d8d0a7022c2aa19636059add2de94a', 'to_id': 'bc1qt64756h9aylujm9tpk826zndegpxtngmr6eqad'},
                    {'id': '32S2kMKfE4MaTqLvtsPavX3qQA7FyXS6pC', 'type': 'node', 'label': 'address'},
                    {'id': '1e5755f5bfb5c13e9e312b4d1fffaeaf09138bf71432dad2f2f8c55697067eee', 'type': 'node', 'label': 'transaction', 'balance': 0.03304556, 'timestamp': 1717407303, 'block_height': 846329},
                    {'id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r-1e5755f5bfb5c13e9e312b4d1fffaeaf09138bf71432dad2f2f8c55697067eee', 'type': 'edge', 'label': '0.03314152 BTC', 'from_id': 'bc1q4s8yps9my6hun2tpd5ke5xmvgdnxcm2qspnp9r', 'to_id': '1e5755f5bfb5c13e9e312b4d1fffaeaf09138bf71432dad2f2f8c55697067eee'},
                    {'id': '1e5755f5bfb5c13e9e312b4d1fffaeaf09138bf71432dad2f2f8c55697067eee-32S2kMKfE4MaTqLvtsPavX3qQA7FyXS6pC', 'type': 'edge', 'label': '0.03304556 BTC', 'from_id': '1e5755f5bfb5c13e9e312b4d1fffaeaf09138bf71432dad2f2f8c55697067eee', 'to_id': '32S2kMKfE4MaTqLvtsPavX3qQA7FyXS6pC'}
                ],
                'error': None
            },
            {
                'type': 'text',
                'result': 'You have 3 transactions, total incoming: 5.64112312 BTC, total outgoing: 5.64046488 BTC.',
                'error': None
            }
        ]
    }
    
    if response_type == ResponseType.text:
        return PlainTextResponse(str(items))
    
    if response_type == ResponseType.graph:
        return JSONResponse(content=items, media_type="application/vnd.graph+json")
    
    return JSONResponse(content=items)
