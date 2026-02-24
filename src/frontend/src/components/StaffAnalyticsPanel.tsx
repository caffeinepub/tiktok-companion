import { Users, Video, Hash, TrendingUp, Activity, Clock, BarChart3, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useGetStatistics, useGetUserCount, useGetAllUserActivity } from '@/hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';

export default function StaffAnalyticsPanel() {
  const { data: statistics, isLoading: isLoadingStats } = useGetStatistics();
  const { data: userCount, isLoading: isLoadingUserCount } = useGetUserCount();
  const { data: userActivity, isLoading: isLoadingActivity } = useGetAllUserActivity();

  const isLoading = isLoadingStats || isLoadingUserCount || isLoadingActivity;

  // Calculate active users (users with activity in last 7 days)
  const activeUsers = userActivity?.filter((activity) => {
    if (!activity.lastActivity) return false;
    const lastActivityDate = new Date(Number(activity.lastActivity) / 1000000); // Convert nanoseconds to milliseconds
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return lastActivityDate >= sevenDaysAgo;
  }).length || 0;

  // Get most active users (top 5)
  const topUsers = userActivity
    ?.sort((a, b) => Number(b.videoCount) - Number(a.videoCount))
    .slice(0, 5) || [];

  return (
    <div className="space-y-6 mt-8 pt-8 border-t">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-display font-bold">Staff Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Comprehensive platform insights and user activity metrics</p>
        </div>
      </div>

      {/* Platform Overview Section */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Platform Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card className="border-primary/20 shadow-glow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{Number(userCount || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Videos */}
          <Card className="border-secondary/20 shadow-glow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-secondary">{Number(statistics?.totalVideos || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-secondary/10">
                  <Video className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Hashtags */}
          <Card className="border-accent/20 shadow-glow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Hashtags</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-accent">{Number(statistics?.totalHashtags || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-accent/10">
                  <Hash className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Videos per User */}
          <Card className="border-muted shadow-glow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Avg Videos/User</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{(statistics?.averageVideosPerUser || 0).toFixed(1)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <BarChart3 className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Status Breakdown Section */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Video Status Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Draft Videos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{Number(statistics?.draftVideos || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Videos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{Number(statistics?.scheduledVideos || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Published Videos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold">{Number(statistics?.publishedVideos || 0)}</p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-muted">
                  <Video className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Engagement Section */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">User Engagement</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Active Users Card */}
          <Card className="border-accent/20 shadow-glow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Users (7d)</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-accent">{activeUsers}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Users with recent activity</p>
                </div>
                <div className="p-3 rounded-full bg-accent/10">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Most Used Hashtags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-4 h-4 text-primary" />
                Top 5 Hashtags
              </CardTitle>
              <CardDescription className="text-xs">Most frequently used hashtags</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : !statistics?.mostUsedHashtags || statistics.mostUsedHashtags.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No hashtags yet</p>
              ) : (
                <div className="space-y-2">
                  {statistics.mostUsedHashtags.map((hashtag, index) => (
                    <div
                      key={hashtag.name}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{hashtag.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-primary">{Number(hashtag.usageCount)}</span>
                        <span className="text-xs text-muted-foreground">uses</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Most Active Users Section */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Most Active Users</h4>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Top 5 Contributors
            </CardTitle>
            <CardDescription>Users ranked by total video count</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : topUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No user activity yet</p>
            ) : (
              <div className="space-y-3">
                {topUsers.map((activity, index) => (
                  <div
                    key={activity.user.toString()}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-mono text-muted-foreground truncate max-w-[200px] md:max-w-[400px]">
                          {activity.user.toString()}
                        </p>
                        {activity.lastActivity && (
                          <p className="text-xs text-muted-foreground">
                            Last active {formatDistanceToNow(new Date(Number(activity.lastActivity) / 1000000), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{Number(activity.videoCount)}</p>
                        <p className="text-xs text-muted-foreground">videos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Number(activity.hashtagCount)}</p>
                        <p className="text-xs text-muted-foreground">hashtags</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent User Activity Section */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent User Activity</h4>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Latest User Registrations
            </CardTitle>
            <CardDescription>10 most recent users to join the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !statistics?.recentUserActivity || statistics.recentUserActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No users registered yet</p>
            ) : (
              <div className="space-y-2">
                {statistics.recentUserActivity.map((user, index) => (
                  <div
                    key={`${user.name}-${index}`}
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10">
                        <Users className="w-4 h-4 text-accent" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        {user.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(Number(user.createdAt) / 1000000), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
