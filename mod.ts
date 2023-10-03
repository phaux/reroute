/**
 * Matches a {@link Request} against a map of paths and calls corresponding handler.
 *
 * If a path ends with `*` then only the path prefix is matched
 * and the handler is called with matched prefix removed from {@link Request.url}.
 * Otherwise, the whole path must match and the handler is called with empty path (`/`).
 *
 * The first route that matches is used.
 * If no route matches, a 404 response is returned.
 * To match any path, use `*` or `/*` as the last route.
 *
 * All paths must begin with `/`, otherwise they won't match.
 */
export async function route(
  request: Request,
  routes: Record<string, (request: Request) => Response | Promise<Response>>,
) {
  const requestPath = new URL(request.url).pathname;

  for (const [routePath, handler] of Object.entries(routes)) {
    if (routePath.endsWith("*")) {
      const prefix = routePath.slice(0, -1);
      if (requestPath.startsWith(prefix)) {
        const routedUrl = new URL(request.url);
        routedUrl.pathname = routedUrl.pathname.slice(prefix.length);
        return await handler(new Request(routedUrl, request));
      }
    } else if (requestPath === routePath) {
      const routedUrl = new URL(request.url);
      routedUrl.pathname = "/";
      return await handler(new Request(routedUrl, request));
    }
  }

  return new Response("Not found", { status: 404 });
}
