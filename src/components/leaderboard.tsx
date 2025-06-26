import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LeaderboardEntry } from '@/lib/mock-data';
import { Trophy } from 'lucide-react';

export function Leaderboard({ data }: { data: LeaderboardEntry[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        <CardTitle className="font-headline">Daily Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
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
              <TableRow key={entry.rank}>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {entry.score.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
