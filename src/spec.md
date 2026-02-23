# Specification

## Summary
**Goal:** Fix unpublish functionality to actually restrict app access and enforce staff code entry on every Settings page visit.

**Planned changes:**
- Remove sessionStorage persistence for staff code verification so staff must enter code '2807' every time they access moderation controls
- Implement backend enforcement that blocks all non-admin API calls (except getPublicationState) when app is unpublished
- Update frontend to check publication state before rendering content and display UnpublishedOverlay on all pages except Settings when unpublished
- Fix the republish button to successfully change backend state from unpublished back to published

**User-visible outcome:** When staff unpublishes the app, all users will see the unpublished overlay and cannot access any content until the app is republished. Staff must enter the code each time they visit Settings to access moderation controls.
