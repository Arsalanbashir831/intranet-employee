"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Vote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  userVoted?: boolean;
  userVoteOptionId?: string;
  badgeLines: [string, string, string];
}

interface PollCardProps {
  poll: Poll;
  className?: string;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, className }) => {
  const isExpired = new Date(poll.expiresAt) < new Date();
  const isActive = poll.isActive && !isExpired;
  
  // Format expiration date
  const formatExpiration = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return "Expired";
    if (diffInDays === 0) return "Expires today";
    if (diffInDays === 1) return "Expires tomorrow";
    return `Expires in ${diffInDays} days`;
  };

  // Get the leading option
  const leadingOption = poll.options.length > 0 
    ? poll.options.reduce((prev, current) => 
        (prev.votes > current.votes) ? prev : current
      )
    : null;

  return (
    <Link href={`/company-hub/poll/${poll.id}`} className="h-full block">
      <Card className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-1 border-transparent hover:border-[#E5004E]/20 bg-white h-full min-h-[300px]",
        className
      )}>
        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
          {/* Header with status and date */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              {isActive ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : isExpired ? (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <XCircle className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              
              {poll.userVoted && (
                <Badge className="bg-[#E5004E]/10 text-[#E5004E] border-[#E5004E]/20">
                  <Vote className="h-3 w-3 mr-1" />
                  Voted
                </Badge>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">
                {formatExpiration(poll.expiresAt)}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  {poll.badgeLines.map((line, index) => (
                    <span key={index} className="font-medium">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content area - flexible */}
          <div className="flex-1">
            {/* Title and description */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {poll.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {poll.description}
              </p>
            </div>

            {/* Question */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {poll.question}
              </p>
            </div>

            {/* Poll options preview */}
            <div className="space-y-2">
            {poll.options.slice(0, 2).map((option) => (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 truncate flex-1 mr-2">
                    {option.text}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {option.percentage}%
                  </span>
                </div>
                <Progress 
                  value={option.percentage} 
                  className="h-1.5"
                />
              </div>
            ))}
            
            {poll.options.length > 2 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{poll.options.length - 2} more options
              </div>
            )}
            </div>
          </div>

          {/* Footer with stats - pushed to bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{poll.totalVotes} votes</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-3 w-3" />
                <span>{poll.options.length} options</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              {leadingOption ? `${leadingOption.percentage}% leading` : 'No votes yet'}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PollCard;
