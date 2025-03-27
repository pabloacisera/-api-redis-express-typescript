// utils/expressRoutes.util.ts
import { Router, RequestHandler, IRoute } from 'express';

interface RouteInfo {
  path: string;
  methods: string[];
}

export function getRegisteredRoutes(router: any, prefix: string = ''): RouteInfo[] {
  const routes: RouteInfo[] = [];

  if (!router || !router.stack) return routes;

  router.stack.forEach((layer: any) => {
    // Rutas directas
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods || {})
        .filter(method => method !== '_all')
        .map(method => method.toUpperCase());

      if (methods.length > 0) {
        routes.push({
          path: prefix + layer.route.path,
          methods
        });
      }
    }
    // Sub-routers (cuando usas router.use())
    else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      const nestedPrefix = prefix + (layer.regexp.source.replace('\\/?', '').replace('(?=\\/|$)', '') || '');
      const nestedRoutes = getRegisteredRoutes(layer.handle, nestedPrefix);
      routes.push(...nestedRoutes);
    }
  });

  return routes;
}