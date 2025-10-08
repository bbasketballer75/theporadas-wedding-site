// Section wrapper component for consistent spacing and styling
export default function Section({
  title,
  subtitle,
  children,
  bgColor = 'transparent',
  containerWidth = 'default',
  spacing = 'default',
}) {
  const backgrounds = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    sage: 'bg-sage/5',
    blush: 'bg-blush/5',
    mint: 'bg-mint/30',
    cream: 'bg-cream/50',
    gradient: 'bg-gradient-to-br from-cream to-mint',
  };

  const widths = {
    sm: 'max-w-2xl',
    default: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const spacings = {
    none: 'py-0',
    sm: 'py-8',
    default: 'py-16',
    lg: 'py-24',
    xl: 'py-32',
  };

  return (
    <section
      className={`
      ${backgrounds[bgColor]}
      ${spacings[spacing]}
      w-full
    `}
    >
      <div className={`${widths[containerWidth]} mx-auto px-8`}>
        {title && (
          <h2 className="font-display text-5xl font-bold text-sage text-center mb-4">{title}</h2>
        )}
        {subtitle && (
          <p className="font-body text-xl text-blush text-center mb-12 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
}
