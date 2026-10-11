import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shop", "routes/shop.tsx"),
  route("product/:slug", "routes/product.$slug.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("orders/:id", "routes/order.$id.tsx"),

  // Auth routes
  route("auth/login", "routes/auth/login.tsx"),

  // Admin routes (protected)
  layout("routes/admin/layout.tsx", [
    route("admin", "routes/admin/dashboard.tsx", { index: true }),
    route("admin/products", "routes/admin/products.tsx"),
    // The create and edit screens share one component, so each needs an
    // explicit id — otherwise both resolve to `routes/admin/product-form`.
    route("admin/products/new", "routes/admin/product-form.tsx", {
      id: "admin-product-new",
    }),
    route("admin/products/:id/edit", "routes/admin/product-form.tsx", {
      id: "admin-product-edit",
    }),
  ]),
] satisfies RouteConfig;
