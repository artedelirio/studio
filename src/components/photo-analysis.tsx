'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Loader2,
  AlertTriangle,
  Lightbulb,
  Camera,
  RotateCcw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyzePhoto } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScoreDisplay } from '@/components/score-display';

type AnalysisResult = {
  score: number;
  reason?: string | null;
  suggestions: string[];
};

export function PhotoAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzePhoto(preview);
      setResult(analysisResult);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: 'Analisi Fallita',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setResult(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-lg font-semibold">Analisi della foto in corso...</h3>
          <p className="text-muted-foreground">
            La nostra IA sta valutando l'ordine del tuo spazio. Attendere prego.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 flex flex-col items-center gap-4 text-destructive">
          <AlertTriangle className="h-12 w-12" />
          <h3 className="text-lg font-semibold">Si è verificato un errore</h3>
          <p className="max-w-md">{error}</p>
          <Button onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Riprova
          </Button>
        </div>
      );
    }

    if (result) {
      return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center gap-4">
            <ScoreDisplay score={result.score} />
            {result.reason && (
              <p className="text-center text-muted-foreground italic">
                "{result.reason}"
              </p>
            )}
            <Button onClick={handleReset} variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Analizza un'altra foto
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-headline font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              Suggerimenti di miglioramento
            </h3>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (preview && file) {
      return (
        <div className="p-4 flex flex-col items-center gap-4">
          <Image
            src={preview}
            alt="Anteprima foto"
            width={400}
            height={400}
            className="rounded-lg object-contain max-h-[400px] w-auto"
            data-ai-hint="interior room"
          />
          <div className="flex gap-4">
            <Button onClick={handleSubmit}>
              <Camera className="mr-2 h-4 w-4" />
              Analizza la mia foto
            </Button>
            <Button onClick={handleReset} variant="outline">
              Scegline un'altra
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Carica o scatta una foto</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Tocca qui per selezionare un'immagine dalla tua libreria o usare la fotocamera.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
        />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Controllo Quotidiano dell'Ordine
        </CardTitle>
        <CardDescription>
          Carica la foto di una stanza per ottenere il suo punteggio di ordine basato sull'IA.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
