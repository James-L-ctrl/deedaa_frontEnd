import { formatPrice } from '../../lib/api';

interface PriceDisplayProps {
  priceCents: number;
  originalPriceCents?: number;
  className?: string;
  showCurrency?: boolean;
}

export function PriceDisplay({ priceCents, originalPriceCents, className, showCurrency = true }: PriceDisplayProps) {
  const formattedPrice = formatPrice(priceCents);

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {showCurrency ? formattedPrice : (priceCents / 100).toFixed(2)}
      </span>
      {originalPriceCents && originalPriceCents > priceCents && (
        <span className="text-lg text-gray-400 line-through">
          {formatPrice(originalPriceCents)}
        </span>
      )}
    </div>
  );
}

export function PriceRangeDisplay({ minPriceCents, maxPriceCents }: { minPriceCents: number; maxPriceCents: number }) {
  if (minPriceCents === maxPriceCents) {
    return <PriceDisplay priceCents={minPriceCents} />;
  }
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {formatPrice(minPriceCents)} - {formatPrice(maxPriceCents)}
      </span>
    </div>
  );
}