import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth routes
  route("auth/login", "routes/auth/login.tsx"),

  // Admin routes (protected)
  layout("routes/admin/layout.tsx", [
    route("admin", "routes/admin/dashboard.tsx", { index: true }),
    route("admin/products", "routes/admin/products.tsx"),
    route("admin/products/new", "routes/admin/product-form.tsx"),
    route("admin/products/:id/edit", "routes/admin/product-form.tsx"),
  ]),
] satisfies RouteConfig;
