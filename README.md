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

-   AMD Ryzen Threadripper PRO 9995WX s (3) @ 2.500GHz
-   12 GB DDR5
-   Ubuntu 22.04.5 LTS x86_64
-   Bun 1.3.13

Tested on 4/26/2026

## Results

These results are measured in req/s:

| Framework                          | Runtime | Average     | Ping       | Query      | Body      |
| ---------------------------------- | ------- | ----------- | ---------- | ---------- | --------- |
| elysia-5-single-instance           | bun     | 122,691.147 | 169,849.61 | 113,102.37 | 85,121.46 |
| elysia-1-monorepo-functions        | bun     | 115,398.22  | 176,625.29 | 96,758.69  | 72,810.68 |
| bun-1-single-instance              | bun     | 111,254.237 | 143,359.73 | 108,103.59 | 82,299.39 |
| bun-1-web-standard-single-instance | bun     | 93,584.12   | 107,275.99 | 92,836.73  | 80,639.64 |
| fastify-1-single-instance          | bun     | 62,865.347  | 75,381.52  | 70,677.66  | 42,536.86 |
| elysia-2-monorepo-instances        | bun     | 58,434.02   | 74,519.66  | 58,607.28  | 42,175.12 |
| elysia-3-microservices-in-process  | bun     | 42,286.44   | 55,825.42  | 39,636.31  | 31,397.59 |
| express-1-single-instance          | bun     | 39,130.66   | 36,033.27  | 38,090.11  | 43,268.6  |
| elysia-4-microservices-network     | bun     | 13,277.577  | 16,043.09  | 11,788.47  | 12,001.17 |

## Notice

I highly recommended testing this benchmark on your machine yourself as performance in likely to vary between machine.
