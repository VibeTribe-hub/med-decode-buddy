import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">MediClear</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/report-analysis">
              Report Analysis
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/interaction-checker">
              Interaction Checker
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
