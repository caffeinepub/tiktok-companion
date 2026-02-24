import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Migrate old state to new state at deployment time
(with migration = Migration.run)
actor {
  // Include authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Publication state type
  public type PublicationState = {
    #published;
    #unpublished;
  };

  // Initialize publication state (migrated old deployments)
  var publicationState : PublicationState = #published;

  // Helper function to check publication state authorization
  private func requirePublished(caller : Principal) {
    if (publicationState == #unpublished and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Service is currently unpublished");
    };
  };

  // Republish (admin only)
  public shared ({ caller }) func republish() : async PublicationState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    publicationState := #published;
    publicationState; // return the current state
  };

  // Unpublish (admin only)
  public shared ({ caller }) func unpublish() : async PublicationState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    publicationState := #unpublished;
    publicationState; // return the current state
  };

  // Query current publication state (all actors)
  public query ({ caller }) func getPublicationState() : async PublicationState {
    publicationState;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
    bio : ?Text;
    createdAt : Time.Time;
  };

  // Video Types
  public type VideoIdea = {
    title : Text;
    description : Text;
    hashtags : [Text];
    status : VideoStatus;
    scheduledDate : ?Time.Time;
    createdAt : Time.Time;
    lastModified : Time.Time;
  };

  public type VideoStatus = {
    #draft;
    #scheduled;
    #published;
  };

  module VideoIdea {
    public func compare(v1 : VideoIdea, v2 : VideoIdea) : Order.Order {
      Text.compare(v1.title, v2.title);
    };

    public func compareByDate(v1 : VideoIdea, v2 : VideoIdea) : Order.Order {
      switch (v1.scheduledDate, v2.scheduledDate) {
        case (null, null) { #equal };
        case (null, ?_) { #greater };
        case (?_, null) { #less };
        case (?date1, ?date2) { Int.compare(date1, date2) };
      };
    };
  };

  public type Hashtag = {
    name : Text;
    usageCount : Nat;
    createdAt : Time.Time;
  };

  // Staff Dashboard Types
  public type UserStatistics = {
    totalUsers : Nat;
    totalVideos : Nat;
    draftVideos : Nat;
    scheduledVideos : Nat;
    publishedVideos : Nat;
    totalHashtags : Nat;
    averageVideosPerUser : Float;
    mostUsedHashtags : [Hashtag];
    recentUserActivity : [UserProfile];
  };

  public type UserActivity = {
    user : Principal;
    videoCount : Nat;
    hashtagCount : Nat;
    lastActivity : ?Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let videoIdeas = Map.empty<Principal, List.List<VideoIdea>>();
  let hashtags = Map.empty<Principal, List.List<Hashtag>>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    requirePublished(caller);

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Idea Management
  public shared ({ caller }) func addVideoIdea(title : Text, description : Text, hashtagsList : [Text]) : async () {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add video ideas");
    };

    let idea : VideoIdea = {
      title;
      description;
      hashtags = hashtagsList;
      status = #draft;
      scheduledDate = null;
      createdAt = Time.now();
      lastModified = Time.now();
    };

    let userIdeas = switch (videoIdeas.get(caller)) {
      case (null) { List.empty<VideoIdea>() };
      case (?ideas) { ideas };
    };

    userIdeas.add(idea);
    videoIdeas.add(caller, userIdeas);
  };

  public shared ({ caller }) func scheduleVideoIdea(title : Text, scheduledDate : Time.Time) : async () {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can schedule video ideas");
    };

    let userIdeas = switch (videoIdeas.get(caller)) {
      case (null) { List.empty<VideoIdea>() };
      case (?ideas) { ideas };
    };

    let updatedIdeas = userIdeas.map<VideoIdea, VideoIdea>(
      func(idea) {
        if (idea.title == title) {
          {
            title = idea.title;
            description = idea.description;
            hashtags = idea.hashtags;
            status = #scheduled;
            scheduledDate = ?scheduledDate;
            createdAt = idea.createdAt;
            lastModified = Time.now();
          };
        } else {
          idea;
        };
      }
    );
    videoIdeas.add(caller, updatedIdeas);
  };

  public query ({ caller }) func getVideoIdeas() : async [VideoIdea] {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view video ideas");
    };

    switch (videoIdeas.get(caller)) {
      case (null) { [] };
      case (?ideas) { ideas.toArray().sort() };
    };
  };

  public query ({ caller }) func getVideosByDateRange(startDate : Time.Time, endDate : Time.Time) : async [VideoIdea] {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view video ideas");
    };

    switch (videoIdeas.get(caller)) {
      case (null) { [] };
      case (?ideas) {
        let filtered = ideas.filter(
          func(idea) {
            switch (idea.scheduledDate) {
              case (null) { false };
              case (?date) { date >= startDate and date <= endDate };
            };
          }
        );
        filtered.toArray().sort(VideoIdea.compareByDate);
      };
    };
  };

  public shared ({ caller }) func deleteDraft(title : Text) : async () {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete drafts");
    };

    let userIdeas = switch (videoIdeas.get(caller)) {
      case (null) { List.empty<VideoIdea>() };
      case (?ideas) { ideas };
    };

    let filteredIdeas = userIdeas.filter(
      func(idea) {
        not (idea.title == title and idea.status == #draft);
      }
    );

    videoIdeas.add(caller, filteredIdeas);
  };

  // Hashtag Management
  public shared ({ caller }) func addHashtag(name : Text) : async () {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add hashtags");
    };

    let tag : Hashtag = {
      name;
      usageCount = 1;
      createdAt = Time.now();
    };

    let userTags = switch (hashtags.get(caller)) {
      case (null) { List.empty<Hashtag>() };
      case (?tags) { tags };
    };

    userTags.add(tag);
    hashtags.add(caller, userTags);
  };

  public query ({ caller }) func getHashtags() : async [Hashtag] {
    requirePublished(caller);

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view hashtags");
    };

    switch (hashtags.get(caller)) {
      case (null) { [] };
      case (?tags) { tags.toArray() };
    };
  };

  // Staff/Admin Dashboard Functions
  // Get overall platform statistics (admin only)
  public query ({ caller }) func getStatistics() : async UserStatistics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };

    var totalVideos = 0;
    var draftVideos = 0;
    var scheduledVideos = 0;
    var publishedVideos = 0;
    var totalHashtags = 0;

    for ((_, ideas) in videoIdeas.entries()) {
      for (idea in ideas.values()) {
        totalVideos += 1;
        switch (idea.status) {
          case (#draft) { draftVideos += 1 };
          case (#scheduled) { scheduledVideos += 1 };
          case (#published) { publishedVideos += 1 };
        };
      };
    };

    for ((_, tags) in hashtags.entries()) {
      totalHashtags += tags.size();
    };

    let userCount = userProfiles.size();

    // Calculate average videos per user
    let averageVideosPerUser : Float = if (userCount == 0) {
      0.0;
    } else {
      totalVideos.toFloat() / userCount.toFloat();
    };

    // Find most used hashtags across all users
    let allTags = List.empty<Hashtag>();
    for ((_, userTags) in hashtags.entries()) {
      allTags.addAll(userTags.values());
    };

    let sortedTags = allTags.toArray().sort(
      func(a, b) {
        Int.compare(b.usageCount, a.usageCount);
      }
    );

    // Get top 5 most used hashtags
    let mostUsedHashtags = if (sortedTags.size() <= 5) {
      sortedTags;
    } else {
      Array.tabulate(5, func(i) { sortedTags[i] });
    };

    // Get 10 most recent user profile creations
    let sortedProfiles = userProfiles.values().toArray().sort(
      func(a, b) {
        Int.compare(b.createdAt, a.createdAt);
      }
    );

    let recentUserActivity = if (sortedProfiles.size() <= 10) {
      sortedProfiles;
    } else {
      Array.tabulate(10, func(i) { sortedProfiles[i] });
    };

    {
      totalUsers = userCount;
      totalVideos;
      draftVideos;
      scheduledVideos;
      publishedVideos;
      totalHashtags;
      averageVideosPerUser;
      mostUsedHashtags;
      recentUserActivity;
    };
  };

  // Get all user activity (admin only)
  public query ({ caller }) func getAllUserActivity() : async [UserActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user activity");
    };

    let activities = Map.empty<Principal, UserActivity>();

    // Collect video counts and last activity
    for ((user, ideas) in videoIdeas.entries()) {
      var lastActivity : ?Time.Time = null;
      for (idea in ideas.values()) {
        switch (lastActivity) {
          case (null) { lastActivity := ?idea.lastModified };
          case (?current) {
            if (idea.lastModified > current) {
              lastActivity := ?idea.lastModified;
            };
          };
        };
      };

      let hashtagCount = switch (hashtags.get(user)) {
        case (null) { 0 };
        case (?tags) { tags.size() };
      };

      activities.add(
        user,
        {
          user;
          videoCount = ideas.size();
          hashtagCount;
          lastActivity;
        },
      );
    };

    // Add users with only hashtags
    for ((user, tags) in hashtags.entries()) {
      switch (activities.get(user)) {
        case (null) {
          activities.add(
            user,
            {
              user;
              videoCount = 0;
              hashtagCount = tags.size();
              lastActivity = null;
            },
          );
        };
        case (?_) {}; // Already added
      };
    };

    activities.values().toArray();
  };

  // Get specific user's videos (admin only)
  public query ({ caller }) func getUserVideos(user : Principal) : async [VideoIdea] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view other users' videos");
    };

    switch (videoIdeas.get(user)) {
      case (null) { [] };
      case (?ideas) { ideas.toArray().sort() };
    };
  };

  // Get specific user's hashtags (admin only)
  public query ({ caller }) func getUserHashtags(user : Principal) : async [Hashtag] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view other users' hashtags");
    };

    switch (hashtags.get(user)) {
      case (null) { [] };
      case (?tags) { tags.toArray() };
    };
  };

  // Get all users count (admin only)
  public query ({ caller }) func getUserCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user count");
    };

    userProfiles.size();
  };
};
