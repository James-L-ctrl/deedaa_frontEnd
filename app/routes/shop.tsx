import { useState } from "react";
import { useLoaderData, Link, Form, useSearchParams } from "react-router";
import { productsApi, formatPrice } from "../lib/api";
import type { ProductQuery } from "../lib/api";
import { ProductCard } from "../components/ui/product-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const query: ProductQuery = {};

  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const bestseller = url.searchParams.get("bestseller");
  const preorder = url.searchParams.get("preorder");
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  const sort = url.searchParams.get("sort");

  if (search) query.search = search;
  if (category) query.category = category;
  if (featured) query.featured = featured === "true";
  if (bestseller) query.bestseller = bestseller === "true";
  if (preorder) query.preorder = preorder === "true";
  if (page) query.page = parseInt(page, 10);
  if (limit) query.limit = parseInt(limit, 10);
  if (sort) query.sort = sort as ProductQuery["sort"];

  const products = await productsApi.list(query);
  return { products, query };
}

export default function Shop() {
  const { products, query } = useLoaderData() as { products: any[]; query: ProductQuery };
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) params.set(key, value.toString());
    }
    setSearchParams(params, { replace: true });
  };

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">DeeaWeb</Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Home</Link>
              <Link to="/shop" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-medium">Shop</Link>
              <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Admin Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Shop</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover our premium beauty products</p>
        </div>

        {/* Filters Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Form onSubmit={handleSearch} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Search</h2>
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={query.search || ""}
                  className="w-full"
                />
              </div>

              <Separator className="border-gray-200 dark:border-gray-700" />

              <div>
                <Label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</Label>
                <Select name="category" value={query.category || ""} onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  if (value) params.set("category", value); else params.delete("category");
                  params.delete("page");
                  setSearchParams(params, { replace: true });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filters</Label>
                <div className="space-y-2">
                  {[
                    { key: "featured", label: "Featured" },
                    { key: "bestseller", label: "Bestsellers" },
                    { key: "preorder", label: "Pre-order" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={key}
                        checked={query[key as keyof ProductQuery] === true}
                        onChange={(e) => {
                          const params = new URLSearchParams(searchParams);
                          if (e.target.checked) params.set(key, "true"); else params.delete(key);
                          params.delete("page");
                          setSearchParams(params, { replace: true });
                        }}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator className="border-gray-200 dark:border-gray-700" />

              <div>
                <Label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</Label>
                <Select name="sort" value={query.sort || ""} onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  if (value) params.set("sort", value); else params.delete("sort");
                  params.delete("page");
                  setSearchParams(params, { replace: true });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Form>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {products.length > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={!query.page || query.page <= 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", String((query.page || 1) - 1));
                        setSearchParams(params, { replace: true });
                      }}
                    >
                      Previous
                    </Button>
                    <span className="px-4 text-gray-700 dark:text-gray-300">
                      Page {query.page || 1}
                    </span>
                    <Button
                      variant="outline"
                      disabled={products.length < (query.limit || 20)}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", String((query.page || 1) + 1));
                        setSearchParams(params, { replace: true });
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">DeeaWeb</h3>
              <p className="text-gray-600 dark:text-gray-400">Premium beauty products crafted with care. Your skin deserves the best.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link to="/" className="hover:text-pink-600 dark:hover:text-pink-400">Home</Link></li>
                <li><Link to="/shop" className="hover:text-pink-600 dark:hover:text-pink-400">Shop</Link></li>
                <li><Link to="/auth/login" className="hover:text-pink-600 dark:hover:text-pink-400">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Lips</li>
                <li>Cheeks</li>
                <li>Skincare</li>
                <li>Body</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>hello@deedaa.com</li>
                <li>123 Beauty Lane</li>
                <li>New York, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 DeeaWeb. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}