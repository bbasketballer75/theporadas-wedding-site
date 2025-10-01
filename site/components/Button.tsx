import type { ButtonProps } from '../types';

/**
 * Button Component
 * Reusable button with variant styles for wedding theme
 *
 * @param props - Button properties
 * @returns Styled button element
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  ariaLabel,
  type = 'button',
  className = '',
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-blush to-sage text-white hover:from-sage hover:to-blush',
    outline: 'border-2 border-sage text-sage hover:bg-sage hover:text-white',
    blush: 'bg-blush text-white hover:bg-opacity-90',
    sage: 'bg-sage text-white hover:bg-opacity-90',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        px-10 py-4 rounded-full 
        font-body font-semibold text-xl 
        transition-all duration-300 
        hover:scale-105 
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-sage/50
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
