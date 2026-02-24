import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    var userProfiles : Map.Map<Principal, { name : Text; bio : ?Text; createdAt : Int }>;
    var videoIdeas : Map.Map<Principal, List.List<{
      title : Text;
      description : Text;
      hashtags : [Text];
      status : {
        #draft;
        #scheduled;
        #published;
      };
      scheduledDate : ?Int;
      createdAt : Int;
      lastModified : Int;
    }>>;
    var hashtags : Map.Map<Principal, List.List<{
      name : Text;
      usageCount : Nat;
      createdAt : Int;
    }>>;
    var publicationState : {
      #published;
      #unpublished;
    };
  };

  type NewActor = {
    var userProfiles : Map.Map<Principal, { name : Text; bio : ?Text; createdAt : Int }>;
    var videoIdeas : Map.Map<Principal, List.List<{
      title : Text;
      description : Text;
      hashtags : [Text];
      status : {
        #draft;
        #scheduled;
        #published;
      };
      scheduledDate : ?Int;
      createdAt : Int;
      lastModified : Int;
    }>>;
    var hashtags : Map.Map<Principal, List.List<{
      name : Text;
      usageCount : Nat;
      createdAt : Int;
    }>>;
    var publicationState : {
      #published;
      #unpublished;
    };
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
