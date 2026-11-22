# Bun HTTP Framework Benchmark Microservices

Compare throughput benchmarks between microservices and monolith in Bun, using Elysia as the framework.

Test method: Average throughput

1. Ping
    - Request to [GET] `/`
    - Return `hi`
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
2. Query
    - Request to [GET] `/id/:id`
    - Extract path parameter, query string and setting headers.
    - For this benchmark, the request URL will be send as: `/id/1?name=bun`
    - Headers must contains `x-powered-by` to `benchmark`
    - Expected response: **"1 bun"** (`${id} ${query}`)
        - You **MUST NOT use hardcode string or index** to extract querystring.
        - In a real-world situation, there's no enforcement that the request will follow the specification, using hardcode index to extract `name=bun` querystring will be prone to error.
        - To test if it pass the requirement, the implementation should be able to extract querystring **dynamically** (please treat the value of 'name=bun' can be any value beside 'bun', for example 'alice', 'hina'), which means that the same code should be able to extract querystring, for example:
        - `/id/1?name=bun&id=1` -> should return `1 bun` not `1 bun&id=1`
        - `/id/1?id=1` -> should return `1 `
        - Query beside `name` maybe not need to be extracted and is optional
    - Headers must contains text `Content-Type: text/plain`, additional context is acceptable eg. `Content-Type: text/plain; charset=utf-8`
3. Body
    - [POST] `/json`
    - Mirror body to response
    - Server **MUST parse body to JSON and serialize back to string**
    - For the benchmark, the request body will be sent as: `{ "hello": "world" }`
    - Expected response: `{ "hello": "world" }`
    - Headers must contains text `Content-Type: application/json`, additional context is acceptable eg. `Content-Type: application/json; charset=utf-8`.

## requirement

# Prerequistes

-   [bombardier](https://github.com/codesenberg/bombardier)
-   Bun

# Run Test

```typescript
bun benchmark
```

Dump result will be available at `results/[benchmark-name].txt`

## Benchmark Condition

This benchmark is tested under the following condition:

-   4 vCPU / 16 GB cloud VM (load generator and servers on the same machine)
-   Ubuntu 24.04 x86_64
-   Bun 1.4.4

Tested on 11/22/2026

## Results

These results are measured in req/s:

| Framework                               | Runtime | Average     | Ping       | Query     | Body      |
| --------------------------------------- | ------- | ----------- | ---------- | --------- | --------- |
| bun-1-single-instance                   | bun     | 105,467.037 | 118,464.58 | 108,180.5 | 89,756.03 |
| elysia-1-monorepo-functions             | bun     | 104,592.523 | 118,332.58 | 106,000.8 | 89,444.19 |
| bun-1-web-standard-single-instance      | bun     | 102,067.463 | 115,154.27 | 99,228.57 | 91,819.55 |
| elysia-5-single-instance                | bun     | 90,626.29   | 105,891.29 | 92,874.56 | 73,113.02 |
| elysia-6-monorepo-functions-async-bound | bun     | 82,465.177  | 87,832.43  | 86,190.91 | 73,372.19 |
| elysia-2-monorepo-instances             | bun     | 72,130.443  | 90,101.77  | 77,594.46 | 48,695.1  |
| fastify-1-single-instance               | bun     | 68,276.647  | 80,489.75  | 77,793.69 | 46,546.5  |
| elysia-3-microservices-in-process       | bun     | 50,643.553  | 64,931.41  | 47,328.85 | 39,670.4  |
| express-1-single-instance               | bun     | 48,798.193  | 51,452.13  | 46,801.99 | 48,140.46 |
| elysia-4-microservices-network          | bun     | 11,256.347  | 11,479.67  | 11,048.42 | 11,240.95 |

## Notice

The `fastify-1-single-instance` Body result is not valid: every request to `/json` returned a 4xx response, so its Body and Average figures should be ignored until that is fixed.

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
