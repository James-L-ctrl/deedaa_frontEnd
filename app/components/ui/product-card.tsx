import { Link } from 'react-router';
import { Cart, Heart, Eye } from 'lucide-react';
import { Product } from '../../lib/api';
import { Button } from './button';
import { Badge } from './badge';
import { PriceDisplay } from './price-display';
import { StarRating } from './star-rating';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  onAddToCart?: (productId: string) => void;
  addingToCart?: string | null;
}

export function ProductCard({ product, variant = 'default', onAddToCart, addingToCart }: ProductCardProps) {
  const isAdding = addingToCart === product.id;

  if (variant === 'compact') {
    return (
      <Link to={`/products/${product.slug}`} className="flex gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-20 w-20 object-cover rounded-md flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{product.name}</h3>
            <PriceDisplay priceCents={product.priceCents} className="text-sm" />
          </div>
          {onAddToCart && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product.id);
              }}
              disabled={isAdding || product.stock === 0 && !product.isPreorder}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <article className={cn('group relative flex flex-col h-full', variant === 'featured' ? 'h-auto' : '')}>
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {(product.featured || product.bestseller || product.isPreorder || product.badge) && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && <Badge variant="default" className="text-xs">Featured</Badge>}
            {product.bestseller && <Badge variant="secondary" className="text-xs">Bestseller</Badge>}
            {product.isPreorder && <Badge variant="warning" className="text-xs">Preorder</Badge>}
            {product.badge && <Badge variant="outline" className="text-xs">{product.badge}</Badge>}
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-gray-800/80" aria-label="Quick view">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-gray-800/80" aria-label="Add to wishlist">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      <div className="flex-1 flex flex-col p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating ?? 0} size="sm" showValue />
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.rating ?? 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <PriceDisplay priceCents={product.priceCents} />
        </div>
        {onAddToCart && (
          <Button
            className="w-full mt-3"
            onClick={() => onAddToCart(product.id)}
            disabled={isAdding || product.stock === 0 && !product.isPreorder}
          >
            {isAdding ? 'Adding...' : product.isPreorder ? 'Preorder' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </article>
  );
}