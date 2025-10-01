import Link from 'next/link';
import Button from '../components/Button';
import TimelineCard from '../components/TimelineCard';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="w-full bg-sage/10 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-center gap-8">
          <Link href="/" className="font-body text-lg text-sage hover:text-blush transition-colors">
            Home
          </Link>
          <Link
            href="/map"
            className="font-body text-lg text-sage hover:text-blush transition-colors"
          >
            Map
          </Link>
          <Link
            href="/gallery"
            className="font-body text-lg text-sage hover:text-blush transition-colors"
          >
            Gallery
          </Link>
        </div>
      </nav>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-mint via-blush to-cream animate-fade-in">
        {/* Header with Floral Accents */}
        <div className="w-full max-w-3xl flex justify-center items-center mb-6">
          <img
            src="https://cdn.pixabay.com/photo/2017/01/06/19/15/rose-1956287_1280.png"
            alt="floral accent"
            className="w-20 h-20 mr-6 grayscale-[0.2] opacity-80"
          />
          <h1 className="font-display text-6xl font-bold text-sage tracking-wider drop-shadow-lg">
            Austin & Jordyn&apos;s Wedding
          </h1>
          <img
            src="https://cdn.pixabay.com/photo/2017/01/06/19/15/rose-1956287_1280.png"
            alt="floral accent"
            className="w-20 h-20 ml-6 grayscale-[0.2] opacity-80"
          />
        </div>

        {/* Subtitle Card */}
        <p className="font-body text-2xl text-sage mb-8 text-center max-w-xl bg-blush/15 rounded-2xl px-8 py-4 shadow-lg shadow-blush/10">
          <span className="text-blush font-semibold text-3xl">Sage Green</span> &{' '}
          <span className="text-sage font-semibold text-3xl">Blush</span> Wedding
          <br />
          <span className="text-sage font-medium">
            Celebrating love, family, and new beginnings.
          </span>
        </p>

        {/* CTA Button */}
        <Button variant="primary">Explore Our Story</Button>

        {/* Quote Card */}
        <div className="mt-12 w-full max-w-3xl rounded-3xl bg-white/70 shadow-2xl shadow-blush/25 p-8 text-center">
          <span className="font-body text-lg text-sage italic">
            &ldquo;Two hearts, one love, forever intertwined.&rdquo;
          </span>
        </div>

        {/* Our Story Section */}
        <section className="w-full max-w-4xl mt-16 px-8 py-10 bg-gradient-to-br from-cream to-mint rounded-[32px] shadow-2xl shadow-sage/20 text-center">
          <h2 className="font-display text-5xl text-sage mb-6">Our Story</h2>
          <p className="font-body text-xl text-blush mb-6 leading-relaxed">
            From a serendipitous meeting to a lifetime of love, Austin and Jordyn&apos;s journey has
            been filled with laughter, adventure, and cherished moments. Together, we celebrate the
            beginning of our forever.
          </p>

          {/* Timeline Cards */}
          <div className="flex justify-center gap-8 flex-wrap">
            <TimelineCard title="First Date" date="May 2018" bgColor="mint" />
            <TimelineCard title="Engagement" date="October 2023" bgColor="cream" />
            <TimelineCard title="Wedding Day" date="June 2025" bgColor="mint" />
          </div>
        </section>
      </main>
    </>
  );
}
