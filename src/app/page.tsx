import { Header } from '@/components/header';
import { PhotoAnalysis } from '@/components/photo-analysis';
import { Leaderboard } from '@/components/leaderboard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <PhotoAnalysis />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Built with Next.js and ❤️</p>
      </footer>
    </div>
  );
}
