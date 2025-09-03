import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#0c372b] text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/Pickle_for_prostate.png"
              alt="Pickleball for Prostate Cancer Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold">Pickleball for Prostate Cancer</span>
          </Link>
          <div className="space-x-6">
            <Link href="/" className="hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link href="/donate" className="hover:text-green-200 transition-colors">
              Sign Up
            </Link>
            <Link href="/volunteer" className="hover:text-green-200 transition-colors">
              Volunteer
            </Link>
            <Link href="/sponsors" className="hover:text-green-200 transition-colors">
              Sponsors
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}