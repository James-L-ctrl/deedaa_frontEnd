import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`${rating} out of ${maxRating} stars`}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={cn(
            'p-0.5 transition-colors',
            interactive && 'hover:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
            !interactive && 'pointer-events-none'
          )}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}