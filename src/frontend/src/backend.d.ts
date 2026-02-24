import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VideoIdea {
    status: VideoStatus;
    title: string;
    hashtags: Array<string>;
    scheduledDate?: Time;
    createdAt: Time;
    description: string;
    lastModified: Time;
}
export interface UserStatistics {
    recentUserActivity: Array<UserProfile>;
    totalHashtags: bigint;
    publishedVideos: bigint;
    mostUsedHashtags: Array<Hashtag>;
    scheduledVideos: bigint;
    draftVideos: bigint;
    totalVideos: bigint;
    totalUsers: bigint;
    averageVideosPerUser: number;
}
export type Time = bigint;
export interface Hashtag {
    name: string;
    createdAt: Time;
    usageCount: bigint;
}
export interface UserProfile {
    bio?: string;
    name: string;
    createdAt: Time;
}
export interface UserActivity {
    videoCount: bigint;
    lastActivity?: Time;
    user: Principal;
    hashtagCount: bigint;
}
export enum PublicationState {
    published = "published",
    unpublished = "unpublished"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoStatus {
    scheduled = "scheduled",
    published = "published",
    draft = "draft"
}
export interface backendInterface {
    addHashtag(name: string): Promise<void>;
    addVideoIdea(title: string, description: string, hashtagsList: Array<string>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDraft(title: string): Promise<void>;
    getAllUserActivity(): Promise<Array<UserActivity>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHashtags(): Promise<Array<Hashtag>>;
    getPublicationState(): Promise<PublicationState>;
    getStatistics(): Promise<UserStatistics>;
    getUserCount(): Promise<bigint>;
    getUserHashtags(user: Principal): Promise<Array<Hashtag>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserVideos(user: Principal): Promise<Array<VideoIdea>>;
    getVideoIdeas(): Promise<Array<VideoIdea>>;
    getVideosByDateRange(startDate: Time, endDate: Time): Promise<Array<VideoIdea>>;
    isCallerAdmin(): Promise<boolean>;
    republish(): Promise<PublicationState>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    scheduleVideoIdea(title: string, scheduledDate: Time): Promise<void>;
    unpublish(): Promise<PublicationState>;
}
