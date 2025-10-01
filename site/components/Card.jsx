// Generic card component for content sections
export default function Card({ 
  title, 
  children, 
  bgColor = "white",
  shadow = "lg",
  padding = "default"
}) {
  const backgrounds = {
    white: "bg-white",
    sage: "bg-sage/10",
    blush: "bg-blush/10",
    mint: "bg-mint",
    cream: "bg-cream",
    gradient: "bg-gradient-to-br from-sage/5 to-blush/5"
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  return (
    <div className={`
      ${backgrounds[bgColor]}
      ${shadows[shadow]}
      ${paddings[padding]}
      rounded-3xl
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-2xl
    `}>
      {title && (
        <h3 className="font-display text-3xl text-sage font-bold mb-4">
          {title}
        </h3>
      )}
      <div className="font-body text-gray-700">
        {children}
      </div>
    </div>
  );
}
