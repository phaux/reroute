# Reroute

[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/reroute)

Simple router for `Deno.serve`.

Works great with [serve_spa](https://deno.land/x/serve_spa) and
[t_rest](https://deno.land/x/t_rest) for creating full-stack web applications.

## Usage

```ts
import { route } from "https://deno.land/x/reroute/mod.ts";
import { Api, Endpoint } from "https://deno.land/x/t_rest/server/mod.ts";
import { serveSpa } from "https://deno.land/x/serve_spa/mod.ts";

const api = new Api({
  "hello": {
    GET: new Endpoint(
      { query: null, body: null },
      async () => ({ status: 200, type: "text/plain", body: "Hello, world!" }),
    ),
  },
});

Deno.serve((request) =>
  route(request, {
    "/api/*": (request) => api.serve(request),
    "/*": async (request) =>
      serveSpa(request, {
        fsRoot: new URL("./web/", import.meta.url).pathname,
        indexFallback: true,
        importMapFile: "../deno.json",
      }),
  })
);
```
