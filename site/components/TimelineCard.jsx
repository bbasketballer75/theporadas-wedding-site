// Timeline card component for "Our Story" section
export default function TimelineCard({ title, date, bgColor = 'mint' }) {
  const borders = {
    mint: 'border-mint',
    cream: 'border-cream',
    sage: 'border-sage',
    blush: 'border-blush',
  };
  
  return (
    <div
      className={`
      bg-white rounded-3xl shadow-2xl
      border-4 ${borders[bgColor]}
      p-6 min-w-[220px] 
      transition-all duration-300 
      hover:scale-105 hover:shadow-xl
    `}
    >
      <span className="font-body text-sage font-semibold text-lg block mb-1">{title}</span>
      <span className="text-gray-600 text-sm">{date}</span>
    </div>
  );
}
