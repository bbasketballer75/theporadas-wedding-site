import Link from 'next/link';

// Footer component for site-wide footer
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-sage to-blush text-white py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand/Info */}
          <div>
            <h3 className="font-display text-3xl font-bold mb-4">Austin & Jordyn</h3>
            <p className="font-body text-white/90">
              Celebrating love, family, and new beginnings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="font-body text-white/90 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="font-body text-white/90 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/map" className="font-body text-white/90 hover:text-white transition-colors">
                  Viewer Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Social */}
          <div>
            <h4 className="font-display text-xl font-bold mb-4">Connect</h4>
            <p className="font-body text-white/90 mb-4">
              Share in our celebration and stay connected.
            </p>
            {/* Placeholder for social media links */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <span className="text-xl">📧</span>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <span className="text-xl">📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="font-body text-white/70">
            © {currentYear} Austin & Jordyn Poradas. All rights reserved.
          </p>
          <p className="font-body text-white/60 text-sm mt-2">
            Made with 💕 for our special day
          </p>
        </div>
      </div>
    </footer>
  );
}
