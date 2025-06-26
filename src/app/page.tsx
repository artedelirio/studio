import { Header } from '@/components/header';
import { PhotoAnalysis } from '@/components/photo-analysis';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-4xl">
          <PhotoAnalysis />
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Costruito con Next.js e ❤️</p>
      </footer>
    </div>
  );
}
