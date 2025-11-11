import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  listAttachmentStatus,
  updateAttachmentStatus,
  listExecutiveTrainingChecklists,
  getExecutiveTrainingChecklist
} from "@/services/new-hire";
import { AttachmentStatusUpdateRequest } from "@/types/services/new-hire";

// Attachment Status hooks
export function useAttachmentStatus(
  employeeId: number | string,
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: ["attachment-status", employeeId, params, pagination],
    queryFn: () => listAttachmentStatus(employeeId, params, pagination),
    staleTime: 60_000,
    enabled: !!employeeId,
  });
}

export function useUpdateAttachmentStatus(id: number | string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: AttachmentStatusUpdateRequest) => updateAttachmentStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachment-status"] });
      queryClient.invalidateQueries({ queryKey: ["attachment-status", id] });
      queryClient.invalidateQueries({ queryKey: ["attachment-status", String(id)] });
    },
  });
}

// Hook to track attachments to be deleted
export function useAttachmentDeletions() {
  const [deletedAttachmentIds, setDeletedAttachmentIds] = React.useState<number[]>([]);
  
  const markForDeletion = (id: number) => {
    setDeletedAttachmentIds(prev => [...prev, id]);
  };
  
  const unmarkForDeletion = (id: number) => {
    setDeletedAttachmentIds(prev => prev.filter(deletedId => deletedId !== id));
  };
  
  const clearDeletions = () => {
    setDeletedAttachmentIds([]);
  };
  
  return {
    deletedAttachmentIds,
    markForDeletion,
    unmarkForDeletion,
    clearDeletions
  };
}

// Hook to track attachment files to be deleted
export function useAttachmentFileDeletions() {
  const [deletedFileIds, setDeletedFileIds] = React.useState<number[]>([]);
  
  const markForDeletion = (id: number) => {
    setDeletedFileIds(prev => [...prev, id]);
  };
  
  const unmarkForDeletion = (id: number) => {
    setDeletedFileIds(prev => prev.filter(deletedId => deletedId !== id));
  };
  
  const clearDeletions = () => {
    setDeletedFileIds([]);
  };
  
  return {
    deletedFileIds,
    markForDeletion,
    unmarkForDeletion,
    clearDeletions
  };
}

// Executive Training Checklist hooks
export function useExecutiveTrainingChecklists(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: ["executive-training-checklists", params, pagination],
    queryFn: () => listExecutiveTrainingChecklists(params, pagination),
    staleTime: 60_000, // Cache for 1 minute
  });
}

export function useExecutiveTrainingChecklist(id: number | string) {
  return useQuery({
    queryKey: ["executive-training-checklist", String(id)],
    queryFn: () => getExecutiveTrainingChecklist(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}