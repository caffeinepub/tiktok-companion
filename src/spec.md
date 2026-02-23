# Specification

## Summary
**Goal:** Add staff code verification system and app publish/unpublish toggle control in moderation settings.

**Planned changes:**
- Add a "Staff Access" button in the Moderation section of Settings that opens a dialog prompting for a staff code
- Implement staff code verification that unlocks a publish/unpublish toggle when code '2807' is entered correctly
- Create backend publication state management that persists across canister upgrades, defaulting to published
- Add a toggle button in the unlocked staff control that switches app between published and unpublished states
- Display a prominent maintenance notice on all pages (except Settings) when app is unpublished

**User-visible outcome:** Staff can enter a code to access an app publication toggle. When unpublished, users see a maintenance notice on all pages except Settings, where staff can republish the app.
