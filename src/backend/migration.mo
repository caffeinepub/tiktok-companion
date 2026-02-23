import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Types from old actor
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      bio : ?Text;
      createdAt : Time.Time;
    }>;
    videoIdeas : Map.Map<Principal, List.List<{
      title : Text;
      description : Text;
      hashtags : [Text];
      status : {
        #draft;
        #scheduled;
        #published;
      };
      scheduledDate : ?Time.Time;
      createdAt : Time.Time;
      lastModified : Time.Time;
    }>>;
    hashtags : Map.Map<Principal, List.List<{
      name : Text;
      usageCount : Nat;
      createdAt : Time.Time;
    }>>;
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      bio : ?Text;
      createdAt : Time.Time;
    }>;
    videoIdeas : Map.Map<Principal, List.List<{
      title : Text;
      description : Text;
      hashtags : [Text];
      status : {
        #draft;
        #scheduled;
        #published;
      };
      scheduledDate : ?Time.Time;
      createdAt : Time.Time;
      lastModified : Time.Time;
    }>>;
    hashtags : Map.Map<Principal, List.List<{
      name : Text;
      usageCount : Nat;
      createdAt : Time.Time;
    }>>;
    publicationState : {
      #published;
      #unpublished;
    };
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    { old with publicationState = #published };
  };
};
