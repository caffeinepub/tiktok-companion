import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, VideoIdea, Hashtag, Time, PublicationState } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
    },
  });
}

// Video Idea Queries
export function useGetVideoIdeas() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoIdea[]>({
    queryKey: ['videoIdeas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideoIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVideoIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      hashtagsList,
    }: {
      title: string;
      description: string;
      hashtagsList: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVideoIdea(title, description, hashtagsList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoIdeas'] });
    },
    onError: (error) => {
      console.error('Error adding video idea:', error);
    },
  });
}

export function useScheduleVideoIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, scheduledDate }: { title: string; scheduledDate: Time }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.scheduleVideoIdea(title, scheduledDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['videosByDateRange'] });
    },
    onError: (error) => {
      console.error('Error scheduling video:', error);
    },
  });
}

export function useDeleteDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDraft(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoIdeas'] });
      toast.success('Draft deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting draft:', error);
      toast.error(error.message || 'Failed to delete draft');
    },
  });
}

export function useGetVideosByDateRange(startDate: Time, endDate: Time) {
  const { actor, isFetching } = useActor();

  return useQuery<VideoIdea[]>({
    queryKey: ['videosByDateRange', startDate.toString(), endDate.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByDateRange(startDate, endDate);
    },
    enabled: !!actor && !isFetching,
  });
}

// Hashtag Queries
export function useGetHashtags() {
  const { actor, isFetching } = useActor();

  return useQuery<Hashtag[]>({
    queryKey: ['hashtags'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHashtags();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHashtag() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHashtag(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtags'] });
    },
    onError: (error) => {
      console.error('Error adding hashtag:', error);
    },
  });
}

// Publication State Queries
export function useGetPublicationState() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicationState>({
    queryKey: ['publicationState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPublicationState();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useTogglePublicationState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.togglePublicationState();
    },
    onSuccess: (newState) => {
      queryClient.invalidateQueries({ queryKey: ['publicationState'] });
      const message = newState === 'unpublished' 
        ? 'App has been unpublished' 
        : 'App has been republished';
      toast.success(message);
    },
    onError: (error: any) => {
      console.error('Error toggling publication state:', error);
      toast.error(error.message || 'Failed to update publication state');
    },
  });
}
