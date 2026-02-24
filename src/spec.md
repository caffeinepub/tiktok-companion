# Specification

## Summary
**Goal:** Expand the staff analytics dashboard with additional metrics including hashtag statistics, user activity, and video averages.

**Planned changes:**
- Add backend query methods to retrieve total hashtags count, average videos per user, top 5 most used hashtags, and recent user activity (last 10 profile creations)
- Expand StaffAnalyticsPanel component to display new metrics in visually distinct card sections
- Create React Query hooks for fetching the new staff analytics data with proper authorization checks

**User-visible outcome:** Staff members can view expanded analytics including hashtag statistics, average videos per user, top 5 hashtags with usage counts, and a timeline of the 10 most recent user profiles with creation timestamps.
