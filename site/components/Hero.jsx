// Hero component for landing pages
export default function Hero({ 
  title, 
  subtitle, 
  backgroundStyle = "gradient",
  children 
}) {
  const backgrounds = {
    gradient: "bg-gradient-to-br from-mint via-blush to-cream",
    sage: "bg-sage",
    blush: "bg-blush",
    mint: "bg-mint",
    cream: "bg-cream"
  };

  return (
    <section className={`
      min-h-screen flex flex-col items-center justify-center
      ${backgrounds[backgroundStyle]}
      px-8 py-16
    `}>
      <div className="max-w-5xl mx-auto text-center">
        {title && (
          <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="font-body text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="animate-fade-in">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
