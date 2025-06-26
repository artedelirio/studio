export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
};

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'TidyTina', score: 4.89 },
  { rank: 2, name: 'NeatNick', score: 4.75 },
  { rank: 3, name: 'CleanChris', score: 4.62 },
  { rank: 4, name: 'OrganizedOlivia', score: 4.51 },
  { rank: 5, name: 'MarieKondoFan', score: 4.33 },
  { rank: 6, name: 'MinimalistMike', score: 4.15 },
  { rank: 7, name: 'SparkJoyJess', score: 3.98 },
  { rank: 8, name: 'ClutterBuster', score: 3.82 },
  { rank: 9, name: 'You!', score: 0.00 },
];
