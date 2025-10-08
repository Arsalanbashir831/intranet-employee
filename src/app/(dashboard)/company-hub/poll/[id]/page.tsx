"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/constants/routes";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Vote,
  Calendar,
  TrendingUp
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

export default function PollDetail() {
  const params = useParams();
  const id = params.id as string;
  
  // Mock poll data - in a real app, this would come from an API
  const [poll, setPoll] = useState<Poll>({
    id: "1",
    title: "Office Environment Survey",
    description: "Help us improve our workplace environment by sharing your thoughts on the current office setup. Your feedback is crucial for creating a better work environment for everyone.",
    question: "How satisfied are you with the current office environment?",
    options: [
      { id: "1-1", text: "Very Satisfied", votes: 45, percentage: 35 },
      { id: "1-2", text: "Satisfied", votes: 38, percentage: 30 },
      { id: "1-3", text: "Neutral", votes: 25, percentage: 20 },
      { id: "1-4", text: "Dissatisfied", votes: 15, percentage: 12 },
      { id: "1-5", text: "Very Dissatisfied", votes: 5, percentage: 3 }
    ],
    totalVotes: 128,
    isActive: true,
    expiresAt: "2025-10-15T23:59:59Z",
    createdAt: "2025-01-15T10:00:00Z",
    userVoted: false,
    badgeLines: [
      new Date("2024-01-15T10:00:00Z").getDate().toString(),
      new Date("2024-01-15T10:00:00Z").toLocaleString("default", { month: "short" }),
      new Date("2024-01-15T10:00:00Z").getFullYear().toString()
    ] as [string, string, string]
  });

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update poll state
      setPoll(prev => ({
        ...prev,
        userVoted: true,
        userVoteOptionId: selectedOption,
        totalVotes: prev.totalVotes + 1,
        options: prev.options.map(option => {
          if (option.id === selectedOption) {
            const newVotes = option.votes + 1;
            const newPercentage = Math.round((newVotes / (prev.totalVotes + 1)) * 100);
            return { ...option, votes: newVotes, percentage: newPercentage };
          } else {
            const newPercentage = Math.round((option.votes / (prev.totalVotes + 1)) * 100);
            return { ...option, percentage: newPercentage };
          }
        })
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <PageHeader
        title="Company Hub"
        crumbs={[
          { label: "Pages", href: "#" },
          { label: "Company Hub", href: ROUTES.DASHBOARD.COMPANY_HUB },
          { label: "Polls", href: `${ROUTES.DASHBOARD.COMPANY_HUB}?tab=polls` },
          { label: poll.title }
        ]}
      />

      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 lg:py-10">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-5">
          {/* Meta Row */}
          <div className="border-t border-b border-[#CDD0D5]">
            <div className="flex items-center py-3 gap-3">
              {/* Logo */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#E5004E] rounded-full flex items-center justify-center">
                  <Vote className="h-6 w-6 text-white" />
                </div>
              </div>

              <div>
                <h2 className="font-extrabold text-sm sm:text-base md:text-lg lg:text-xl min-[1920px]:text-2xl text-[#202124]">
                  CARTWRIGHT KING POLL
                </h2>
                <div className="flex items-center gap-1 text-xs sm:text-sm md:text-base font-extralight text-[#202124]">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {poll.badgeLines.map((line, index) => (
                      <span key={index} className="font-medium">
                        {line}{index < poll.badgeLines.length - 1 && " "}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="border-b border-[#CDD0D5] py-3">
            <div className="flex items-center gap-3">
              {isActive ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm md:text-base">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Poll
                </Badge>
              ) : isExpired ? (
                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs sm:text-sm md:text-base">
                  <XCircle className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs sm:text-sm md:text-base">
                  <Clock className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              
              {poll.userVoted && (
                <Badge className="bg-[#E5004E]/10 text-[#E5004E] border-[#E5004E]/20 text-xs sm:text-sm md:text-base">
                  <Vote className="h-3 w-3 mr-1" />
                  You Voted
                </Badge>
              )}
              
              <div className="text-xs sm:text-sm text-gray-500">
                {formatExpiration(poll.expiresAt)}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="border-b border-[#CDD0D5] py-6 mb-6">
            <h1 className="font-medium text-[#202124] text-2xl sm:text-3xl md:text-4xl lg:text-5xl min-[1920px]:text-6xl min-[2560px]:text-7xl">
              {poll.title}
            </h1>
          </div>

          {/* Description */}
          <div className="border-b border-[#CDD0D5] py-6 mb-6">
            <p className="text-[#202124] leading-relaxed space-y-5 text-sm sm:text-base md:text-lg font-extralight">
              {poll.description}
            </p>
          </div>

          {/* Poll Question */}
          <div className="border-b border-[#CDD0D5] py-6 mb-6">
            <h2 className="font-medium text-[#202124] text-xl sm:text-2xl md:text-3xl lg:text-4xl min-[1920px]:text-5xl">
              {poll.question}
            </h2>
          </div>

          {/* Poll Options */}
          <div className="py-6">
            {!poll.userVoted && isActive ? (
              // Voting Interface
              <div className="space-y-4">
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  className="space-y-4"
                >
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-[#E5004E]/30 hover:bg-[#E5004E]/5 transition-all duration-200">
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id}
                        className="border-2 border-gray-300 data-[state=checked]:border-[#E5004E] data-[state=checked]:bg-[#E5004E]"
                      />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <span className="text-sm sm:text-base font-medium text-gray-900">{option.text}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-end pt-6">
                  <Button
                    onClick={handleVote}
                    disabled={!selectedOption || isSubmitting}
                    className="bg-[#E5004E] hover:bg-[#E5004E]/90 text-white px-8 py-3 text-sm sm:text-base font-medium rounded-full"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Vote"}
                  </Button>
                </div>
              </div>
            ) : (
              // Results Interface
              <div className="space-y-6">
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-sm sm:text-base font-medium text-gray-900",
                        poll.userVoted && poll.userVoteOptionId === option.id && "text-[#E5004E] font-semibold"
                      )}>
                        {option.text}
                        {poll.userVoted && poll.userVoteOptionId === option.id && (
                          <span className="ml-2 text-[#E5004E] text-xs">(Your vote)</span>
                        )}
                      </span>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="font-semibold">{option.percentage}%</span>
                        <span>({option.votes} votes)</span>
                      </div>
                    </div>
                    <Progress 
                      value={option.percentage} 
                      className="h-3 bg-gray-200"
                    />
                  </div>
                ))}
                
                {poll.userVoted && (
                  <div className="mt-8 p-6 bg-[#E5004E]/5 border-2 border-[#E5004E]/20 rounded-lg">
                    <div className="flex items-center space-x-3 text-[#E5004E]">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-base font-medium">Thank you for voting!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Poll Stats */}
            <div className="mt-8 pt-6 border-t border-[#CDD0D5]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{poll.totalVotes} total votes</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">{poll.options.length} options</span>
                </div>
                <div className="flex items-center space-x-3 text-sm sm:text-base text-gray-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">
                    {poll.options.reduce((prev, current) => 
                      (prev.votes > current.votes) ? prev : current
                    ).percentage}% leading
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
