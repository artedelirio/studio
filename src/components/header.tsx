import { Camera } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <Camera className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-foreground">
          KaosLink Analyzer
        </h1>
      </div>
    </header>
  );
}
