'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { LeaderboardEntry } from '@/lib/mock-data';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { Trophy, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDbConfigured, setIsDbConfigured] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setIsDbConfigured(false);
      return;
    }
    setIsDbConfigured(true);

    try {
      const q = query(
        collection(db, 'leaderboard'),
        orderBy('score', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const leaderboardData: Omit<LeaderboardEntry, 'rank'>[] = [];
          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            leaderboardData.push({
              id: doc.id,
              name: docData.name,
              score: docData.score,
            });
          });
          setData(
            leaderboardData.map((entry, index) => ({
              ...entry,
              rank: index + 1,
            }))
          );
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching leaderboard:', error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error(
        'Failed to connect to Firestore. Did you set up your .env file?',
        error
      );
      setLoading(false);
    }
  }, []);

  if (!isDbConfigured) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <CardTitle className="font-headline text-destructive">
            Classifica non disponibile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-destructive">
            Per abilitare la classifica, per favore imposta le tue credenziali Firebase nel file `.env`.
            Assicurati che il tuo progetto Firebase abbia Firestore abilitato.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        <CardTitle className="font-headline">Daily Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4 ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.rank}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {entry.score.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
