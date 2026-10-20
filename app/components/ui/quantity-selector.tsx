import { Button } from './button';
import { cn } from '../../lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon';
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  className,
  disabled,
  size = 'default',
}: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-16 text-xs',
    default: 'h-10 w-20 text-sm',
    lg: 'h-12 w-24 text-base',
    xl: 'h-14 w-28 text-lg',
    icon: 'h-10 w-10',
  };

  const buttonSize = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
    icon: 'h-10 w-10',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="outline"
        size={size}
        className={cn(buttonSize[size])}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={(e) => {
          const val = parseInt(e.target.value, 10);
          if (isNaN(val) || val < min) onChange(min);
          else if (val > max) onChange(max);
        }}
        min={min}
        max={max}
        className={cn(
          'text-center border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          sizeClasses[size],
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        disabled={disabled}
        aria-label="Quantity"
      />
      <Button
        variant="outline"
        size={size}
        className={cn(buttonSize[size])}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
}