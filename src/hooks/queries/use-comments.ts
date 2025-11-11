import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  listComments, 
  getComment, 
  createComment, 
  updateComment, 
  deleteComment,
} from "@/services/comments";
import { CreateCommentPayload, UpdateCommentPayload } from "@/types/services/comments";

// List comments for an announcement
export function useComments(
  announcementId: number | string,
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: ["comments", announcementId, params, pagination],
    queryFn: () => listComments(announcementId, params, pagination),
    placeholderData: keepPreviousData,
    enabled: !!announcementId,
  });
}

// Get single comment details
export function useComment(id: number | string) {
  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => getComment(id),
    enabled: !!id,
  });
}

// Create comment mutation
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(payload),
    onSuccess: (data) => {
      // Invalidate all comments queries for this announcement
      queryClient.invalidateQueries({
        queryKey: ["comments", data.announcement]
      });
      // Also try to invalidate all comments queries
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      });
      toast.success("Comment added successfully!");
    },
    onError: (error: unknown) => {
      console.error("Error creating comment:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to add comment";
      toast.error(errorMessage || "Failed to add comment");
    },
  });
}

// Update comment mutation
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateCommentPayload }) => 
      updateComment(id, payload),
    onSuccess: (data) => {
      // Invalidate all comments queries for this announcement
      queryClient.invalidateQueries({
        queryKey: ["comments", data.announcement]
      });
      // Also try to invalidate all comments queries
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      });
      // Invalidate specific comment
      queryClient.invalidateQueries({
        queryKey: ["comment", data.id]
      });
      toast.success("Comment updated successfully!");
    },
    onError: (error: unknown) => {
      console.error("Error updating comment:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to update comment";
      toast.error(errorMessage || "Failed to update comment");
    },
  });
}

// Delete comment mutation
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteComment(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all comments queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["comments"]
      });
      // Remove specific comment from cache
      queryClient.removeQueries({
        queryKey: ["comment", deletedId]
      });
      toast.success("Comment deleted successfully!");
    },
    onError: (error: unknown) => {
      console.error("Error deleting comment:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : "Failed to delete comment";
      toast.error(errorMessage || "Failed to delete comment");
    },
  });
}
