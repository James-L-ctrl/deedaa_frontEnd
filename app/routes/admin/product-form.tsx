import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams, useActionData } from "react-router";
import { productsApi, formatPrice } from "../../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";

export async function loader({ params }: { params: { id?: string } }) {
  if (params.id) {
    const product = await productsApi.getBySlug(params.id);
    return { product, isEdit: true };
  }
  return { product: null, isEdit: false };
}

const categories = ["lips", "cheeks", "skincare", "body", "eyes", "tools"];

export default function ProductForm() {
  const { product, isEdit } = useLoaderData() as { product: any; isEdit: boolean };
  const actionData = useActionData() as { success: boolean; slug: string; name: string; [key: string]: any } | undefined;
  const navigate = useNavigate();
  const params = useParams();

  const [formState, setFormState] = useState({
    slug: "",
    name: "",
    description: "",
    priceCents: "",
    imageUrl: "",
    category: "lips",
    rating: 5,
    stock: 0,
    featured: false,
    bestseller: false,
    badge: "",
    isPreorder: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormState({
        slug: product.slug,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents.toString(),
        imageUrl: product.imageUrl,
        category: product.category,
        rating: product.rating,
        stock: product.stock,
        featured: product.featured,
        bestseller: product.bestseller,
        badge: product.badge || "",
        isPreorder: product.isPreorder,
      });
    }
  }, [product]);

  useEffect(() => {
    if (actionData?.success) {
      navigate("/admin/products");
    }
  }, [actionData, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormState(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "number") {
      setFormState(prev => ({ ...prev, [name]: value }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.slug.trim()) newErrors.slug = "Slug is required";
    if (!formState.name.trim()) newErrors.name = "Name is required";
    if (!formState.description.trim()) newErrors.description = "Description is required";
    if (!formState.priceCents || parseInt(formState.priceCents) < 1) newErrors.priceCents = "Price must be at least 1 cent";
    if (!formState.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    if (!formState.category.trim()) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      if (isEdit) {
        // TODO: Implement update endpoint
        alert("Update functionality to be implemented - backend needs PUT /products/:id endpoint");
      } else {
        await productsApi.create(formState as any);
        navigate("/admin/products");
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to save product" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isEdit ? "Update product details" : "Fill in the details to create a new product"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formState.slug}
              onChange={handleChange}
              placeholder="nude-glow-lip-balm"
              disabled={isEdit}
              className="mt-1"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">URL-friendly identifier (unique, cannot be changed)</p>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Nude Glow Lip Balm"
              className="mt-1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="A nourishing lip balm with subtle nude tint and natural shine"
            rows={3}
            className="mt-1"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="priceCents">Price (cents)</Label>
            <Input
              id="priceCents"
              name="priceCents"
              type="number"
              value={formState.priceCents}
              onChange={handleChange}
              placeholder="2600"
              className="mt-1"
            />
            {errors.priceCents && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priceCents}</p>}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Price in cents (e.g., 2600 = $26.00)</p>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="mt-1"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imageUrl}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formState.category} onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              value={formState.rating}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formState.stock}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="badge">Badge (optional)</Label>
            <Input
              id="badge"
              name="badge"
              value={formState.badge}
              onChange={handleChange}
              placeholder="Bestseller, New, Limited"
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="featured"
              name="featured"
              checked={formState.featured}
              onCheckedChange={(checked) => setFormState(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</Label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="bestseller"
              name="bestseller"
              checked={formState.bestseller}
              onCheckedChange={(checked) => setFormState(prev => ({ ...prev, bestseller: checked }))}
            />
            <Label htmlFor="bestseller" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bestseller</Label>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="isPreorder"
            name="isPreorder"
            checked={formState.isPreorder}
            onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isPreorder: checked }))}
          />
          <Label htmlFor="isPreorder" className="text-sm font-medium text-gray-700 dark:text-gray-300">Pre-order</Label>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" className="px-4 py-2">
            {isEdit ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}