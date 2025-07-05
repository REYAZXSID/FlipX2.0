import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex justify-center items-center py-4 sm:py-6">
      <Link href="/" className="flex items-center gap-3 text-primary transition-transform hover:scale-105">
        <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce-slow" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-wider">
          Card Matcher
        </h1>
      </Link>
    </header>
  );
}
