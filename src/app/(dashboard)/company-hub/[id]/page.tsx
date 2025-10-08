"use client";

import React, { useState } from "react";
import AnnouncementDetailCard from "@/components/company-hub/announcement-details";
import { PageHeader } from "@/components/common/page-header";
import CommentsSection, { Comment } from "@/components/common/comments-section";
import { ROUTES } from "@/constants/routes";
import { useAnnouncement } from "@/hooks/queries/use-announcements";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function CompanySlug() {
	const params = useParams();
	const id = params.id as string;
	const { user } = useAuth();
	
	const { data: announcementData, isLoading, isError, error } = useAnnouncement(id);
	
	// Mock comments data - in a real app, this would come from an API
	const [comments, setComments] = useState<Comment[]>([
		{
			id: "1",
			author: {
				name: "Sarah Johnson",
				avatar: "/images/team-member-1.png",
				role: "Senior Associate",
				department: "Corporate Law"
			},
			content: "This is a great initiative! Looking forward to seeing how this develops.",
			createdAt: "2024-01-15T10:30:00Z",
			likes: 5,
			dislikes: 0,
			isLiked: false,
			replies: [
				{
					id: "1-1",
					author: {
						name: "Mike Chen",
						avatar: "/images/team-member-2.png",
						role: "Partner",
						department: "Corporate Law"
					},
					content: "I agree! This will definitely improve our workflow.",
					createdAt: "2024-01-15T11:15:00Z",
					likes: 2,
					dislikes: 0,
					isLiked: true,
					replies: [
						{
							id: "1-1-1",
							author: {
								name: "David Wilson",
								avatar: "/images/team-member-4.png",
								role: "Senior Partner",
								department: "Corporate Law"
							},
							content: "Absolutely! The team has been working hard on this project.",
							createdAt: "2024-01-15T12:00:00Z",
							likes: 1,
							dislikes: 0,
							replies: [
								{
									id: "1-1-1-1",
									author: {
										name: "Lisa Thompson",
										avatar: "/images/team-member-5.png",
										role: "Associate",
										department: "Corporate Law"
									},
									content: "Thanks for the update, David! Looking forward to the rollout.",
									createdAt: "2024-01-15T12:30:00Z",
									likes: 0,
									dislikes: 0,
									replies: []
								}
							]
						}
					]
				}
			]
		},
		{
			id: "2",
			author: {
				name: "Emily Rodriguez",
				avatar: "/images/team-member-3.png",
				role: "Associate",
				department: "Litigation"
			},
			content: "Could we get more details about the implementation timeline?",
			createdAt: "2024-01-15T14:20:00Z",
			likes: 3,
			dislikes: 1,
			isDisliked: false,
			replies: [
				{
					id: "2-1",
					author: {
						name: "Alex Martinez",
						avatar: "/images/team-member-1.png",
						role: "Project Manager",
						department: "IT"
					},
					content: "Great question! We're targeting Q2 for the initial rollout.",
					createdAt: "2024-01-15T15:00:00Z",
					likes: 2,
					dislikes: 0,
					replies: []
				},
				{
					id: "2-2",
					author: {
						name: "Jennifer Lee",
						avatar: "/images/team-member-2.png",
						role: "Senior Associate",
						department: "Litigation"
					},
					content: "That's helpful, Alex. Will there be training sessions for the team?",
					createdAt: "2024-01-15T15:30:00Z",
					likes: 1,
					dislikes: 0,
					replies: []
				},
				{
					id: "2-3",
					author: {
						name: "Robert Kim",
						avatar: "/images/team-member-4.png",
						role: "Partner",
						department: "Corporate Law"
					},
					content: "I'm also interested in the training timeline. This will be crucial for adoption.",
					createdAt: "2024-01-15T16:00:00Z",
					likes: 3,
					dislikes: 0,
					replies: []
				},
				{
					id: "2-4",
					author: {
						name: "Maria Garcia",
						avatar: "/images/team-member-5.png",
						role: "Associate",
						department: "Litigation"
					},
					content: "Same here! Looking forward to the training sessions.",
					createdAt: "2024-01-15T16:15:00Z",
					likes: 1,
					dislikes: 0,
					replies: [
						{
							id: "2-4-1",
							author: {
								name: "Tom Wilson",
								avatar: "/images/team-member-1.png",
								role: "Senior Associate",
								department: "Litigation"
							},
							content: "I'll make sure to attend all the training sessions.",
							createdAt: "2024-01-15T16:30:00Z",
							likes: 0,
							dislikes: 0,
							replies: []
						}
					]
				}
			]
		}
	]);

	// Recursive function to add nested replies
	const addNestedReply = (comments: Comment[], parentId: string, newComment: Comment): Comment[] => {
		return comments.map(comment => {
			if (comment.id === parentId) {
				return { ...comment, replies: [...(comment.replies || []), newComment] };
			} else if (comment.replies && comment.replies.length > 0) {
				return { ...comment, replies: addNestedReply(comment.replies, parentId, newComment) };
			}
			return comment;
		});
	};

	// Comment handlers
	const handleAddComment = (content: string, parentId?: string) => {
		const newComment: Comment = {
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
			author: {
				name: user?.name || "Anonymous User",
				avatar: user?.profilePicture,
				role: user?.role,
				department: user?.departmentName
			},
			content,
			createdAt: new Date().toISOString(),
			likes: 0,
			dislikes: 0,
			replies: []
		};

		if (parentId) {
			// Add as nested reply using recursive function
			setComments(prev => addNestedReply(prev, parentId, newComment));
		} else {
			// Add as top-level comment
			setComments(prev => [...prev, newComment]);
		}
	};

	// Recursive function to update nested comments (like/dislike/edit)
	const updateNestedComment = (comments: Comment[], commentId: string, updateFn: (comment: Comment) => Comment): Comment[] => {
		return comments.map(comment => {
			if (comment.id === commentId) {
				return updateFn(comment);
			} else if (comment.replies && comment.replies.length > 0) {
				return { ...comment, replies: updateNestedComment(comment.replies, commentId, updateFn) };
			}
			return comment;
		});
	};

	// Recursive function to delete nested comments
	const deleteNestedComment = (comments: Comment[], commentId: string): Comment[] => {
		return comments.filter(comment => {
			if (comment.id === commentId) {
				return false;
			} else if (comment.replies && comment.replies.length > 0) {
				return { ...comment, replies: deleteNestedComment(comment.replies, commentId) };
			}
			return true;
		});
	};

	const handleLikeComment = (commentId: string) => {
		setComments(prev => 
			updateNestedComment(prev, commentId, comment => ({
				...comment, 
				likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
				isLiked: !comment.isLiked,
				isDisliked: false,
				dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
			}))
		);
	};

	const handleDislikeComment = (commentId: string) => {
		setComments(prev => 
			updateNestedComment(prev, commentId, comment => ({
				...comment, 
				dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
				isDisliked: !comment.isDisliked,
				isLiked: false,
				likes: comment.isLiked ? comment.likes - 1 : comment.likes
			}))
		);
	};

	const handleDeleteComment = (commentId: string) => {
		setComments(prev => deleteNestedComment(prev, commentId));
	};

	const handleEditComment = (commentId: string, newContent: string) => {
		setComments(prev => 
			updateNestedComment(prev, commentId, comment => ({ ...comment, content: newContent }))
		);
	};

	// Function to count all comments including nested replies
	const countAllComments = (comments: Comment[]): number => {
		return comments.reduce((total, comment) => {
			const repliesCount = comment.replies ? countAllComments(comment.replies) : 0;
			return total + 1 + repliesCount; // +1 for the comment itself
		}, 0);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Loading announcement...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Error loading announcement: {error?.message || 'Unknown error'}</div>
			</div>
		);
	}

	if (!announcementData) {
		return (
			<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
				<div>Announcement not found.</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F8F8]">
			<PageHeader
				title="Company Hub"
				crumbs={[
					{ label: "Pages", href:'#' },
					{ label: "Company Hub", href: ROUTES.DASHBOARD.COMPANY_HUB },
					{ label: announcementData.title }
				]}
			/>

			<AnnouncementDetailCard announcement={announcementData} />
			
			{/* Comments Section */}
			<div className="mx-auto w-full px-3 sm:px-6 md:px-8 py-4 sm:py-6 lg:py-8">
				<div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
					<div className="mb-4 sm:mb-6">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
							Comments ({countAllComments(comments)})
						</h2>
						<p className="text-sm text-gray-600">
							Share your thoughts and engage with the community
						</p>
					</div>
					
					<CommentsSection
						comments={comments}
						onAddComment={handleAddComment}
						onLikeComment={handleLikeComment}
						onDislikeComment={handleDislikeComment}
						onDeleteComment={handleDeleteComment}
						onEditComment={handleEditComment}
						currentUser={{
							name: user?.name || "Anonymous User",
							avatar: user?.profilePicture,
							role: user?.role
						}}
					/>
				</div>
			</div>
		</div>
	);
}