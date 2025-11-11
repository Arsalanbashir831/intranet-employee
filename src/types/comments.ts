/**
 * Comments service types
 */

export type CommentAuthor = {
	id: number;
	emp_name: string;
	email: string;
	phone: string;
	role: string;
	profile_picture: string | null;
	branch_department_ids: number[];
};

export type Comment = {
	id: number;
	announcement: number;
	author: number;
	parent: number | null;
	content: string;
	created_at: string;
	updated_at: string;
	is_edited: boolean;
	author_details: CommentAuthor;
	replies: Comment[];
	can_edit: boolean;
	can_delete: boolean;
	reply_count: number;
};

export type CommentListResponse = {
	comments: {
		count: number;
		page: number;
		page_size: number;
		results: Comment[];
	};
};

export type CommentDetailResponse = Comment;

export type CreateCommentPayload = {
	announcement: number;
	content: string;
	parent?: number | null;
};

export type UpdateCommentPayload = {
	content: string;
};


