/**
 * Poll Card component types
 */

export type PollCardOption = {
  id: string;
  text: string;
  votes: number;
  percentage: number;
};

export type PollCardData = {
  id: string;
  title: string;
  description: string;
  question: string;
  options: PollCardOption[];
  totalVotes: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  userVoted?: boolean;
  userVoteOptionId?: string;
  badgeLines: [string, string, string];
};

export type PollCardProps = {
  poll: PollCardData;
  className?: string;
};
