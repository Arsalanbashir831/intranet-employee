"use client";

import React from "react";
import AnnouncementDetailCard from "@/components/company-hub/announcement-details";
import { PageHeader } from "@/components/common/page-header";
import CommentsSection from "@/components/common/comments-section";
import { ROUTES } from "@/constants/routes";
import { useAnnouncement } from "@/hooks/queries/use-announcements";
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from "@/hooks/queries/use-comments";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { ApiComment } from "@/services/comments";
import type { Comment } from "@/types/comments-sections";

export default function CompanySlug() {
	const params = useParams();
	const id = params.id as string;
	const { user } = useAuth();
	
	const { data: announcementData, isLoading, isError, error } = useAnnouncement(id);
	
	// Fetch comments from API
	const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useComments(id);
	
	// Comment mutations
	const createCommentMutation = useCreateComment();
	const updateCommentMutation = useUpdateComment();
	const deleteCommentMutation = useDeleteComment();
	
	// Transform API comments to component format
	const transformComment = (apiComment: ApiComment): Comment => {
		const authorDetails = apiComment.author_details;
		return {
			id: apiComment.id.toString(),
			author: {
				name: authorDetails?.emp_name || "Unknown",
				avatar: authorDetails?.profile_picture || undefined,
				role: authorDetails?.role || undefined,
				department: undefined, // Not available in API response
			},
			content: apiComment.content,
			createdAt: apiComment.created_at,
			isEdited: apiComment.is_edited,
			replies: apiComment.replies?.map(transformComment) || [],
			canEdit: apiComment.can_edit,
			canDelete: apiComment.can_delete,
			replyCount: apiComment.reply_count,
		};
	};
	
	const comments: Comment[] = commentsData?.comments?.results?.map(transformComment) || [];

	// Comment handlers
	const handleAddComment = (content: string, parentId?: string) => {
		createCommentMutation.mutate({
			announcement: parseInt(id),
			content,
			parent: parentId ? parseInt(parentId) : null
		});
	};

	const handleDeleteComment = (commentId: string) => {
		deleteCommentMutation.mutate(parseInt(commentId));
	};

	const handleEditComment = (commentId: string, newContent: string) => {
		updateCommentMutation.mutate({
			id: parseInt(commentId),
			payload: { content: newContent }
		});
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
					
					{commentsLoading ? (
						<div className="text-center py-8">
							<div className="text-gray-500">Loading comments...</div>
						</div>
					) : commentsError ? (
						<div className="text-center py-8">
							<div className="text-red-500">Error loading comments</div>
						</div>
					) : (
						<CommentsSection
							comments={comments}
							onAddComment={handleAddComment}
							onDeleteComment={handleDeleteComment}
							onEditComment={handleEditComment}
							currentUser={{
								name: user?.name || "Anonymous User",
								avatar: user?.profilePicture,
								role: user?.role
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
}