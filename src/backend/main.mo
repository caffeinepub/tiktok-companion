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

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// apply migration via with-clause

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
};
