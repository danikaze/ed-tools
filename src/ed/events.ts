/**
 * List of supported Elite Dangerous events
 */

import {
  StarPos,
  StarType,
  AllegianceType,
  EconomyType,
  GovernmentType,
  SystemSecurity,
  BodyType,
  PowerType,
  PowerplayState,
  Faction,
  SystemFaction,
  StationType,
  StationService,
  StationEconomy,
  BountyReward,
  ShipType,
  CombatRank,
  LegalStateType as LegalStatusType,
  ScanType,
  AsteroidMaterialContent,
  MaterialCategory,
  DroneType,
  MineralType,
  MaterialName,
  MissionFactionEffect,
  MissionType,
  CommodityType,
  InfluenceReward,
  ReputationReward,
} from './definitions';

export interface EdEvent<E extends string = string> {
  timestamp: Date; // transformed to date when parsed
  event: E;
}

export interface EdNavRouteEvent extends EdEvent<'NavRoute'> {
  Route: Array<{
    StarSystem: string;
    SystemAddress: number;
    StarPos: StarPos;
    StarClass: StarType;
  }>;
}

export interface EdFSDJumpEvent extends EdEvent<'FSDJump'> {
  StarSystem: string;
  SystemAddress: number;
  StarPos: StarPos;
  SystemAllegiance: AllegianceType;
  SystemEconomy: EconomyType;
  SystemEconomy_Localised: string;
  SystemSecondEconomy: EconomyType;
  SystemSecondEconomy_Localised: string;
  SystemGovernment: GovernmentType;
  SystemGovernment_Localised: string;
  SystemSecurity: SystemSecurity;
  SystemSecurity_Localised: string;
  Population: number;
  Body: string;
  BodyID: number;
  BodyType: BodyType;
  Powers: PowerType[];
  PowerplayState: PowerplayState;
  JumpDist: number;
  FuelUsed: number;
  FuelLevel: number;
  Factions: Faction[];
  SystemFaction: SystemFaction;
}

export interface EdDockedEvent extends EdEvent<'Docked'> {
  StationName: string;
  StationType: StationType;
  StarSystem: string;
  SystemAddress: number;
  MarketID: number;
  StationFaction: Partial<Faction>;
  StationGovernment: GovernmentType;
  StationGovernment_Localised: string;
  StationAllegiance: AllegianceType;
  StationServices: StationService[];
  StationEconomy: EconomyType;
  StationEconomy_Localised: string;
  StationEconomies: StationEconomy[];
  DistFromStarLS: number;
}

export interface EdUnDockedEvent extends EdEvent<'Undocked'> {
  StationName: string;
  StationType: StationType;
  MarketID: number;
}

export interface EdApproachBodyEvent extends EdEvent<'ApproachBody'> {
  StarSystem: string;
  SystemAddress: number;
  Body: string;
  BodyID: number;
}

export interface EdLeaveBodyEvent extends EdEvent<'LeaveBody'> {
  StarSystem: string;
  SystemAddress: number;
  Body: string;
  BodyID: number;
}

export interface EdBountyEvent extends EdEvent<'Bounty'> {
  Rewards: BountyReward[];
  Target: ShipType;
  Target_Localised: string;
  TotalReward: number;
  VictimFaction: string;
}

export interface EdShipTargetedEvent extends EdEvent<'ShipTargeted'> {
  TargetLocked: boolean;
  Ship: ShipType;
  ScanStage: 0 | 1 | 2 | 3; // tslint:disable-line:no-magic-numbers
  PilotName: string;
  PilotName_Localised: string;
  PilotRank: CombatRank;
  ShieldHealth: number;
  HullHealth: number;
  Faction: string;
  LegalStatus: LegalStatusType;
  Bounty: number;
}

export interface EdScannedEvent extends EdEvent<'Scanned'> {
  ScanType: ScanType;
}

export interface EdLaunchDroneEvent extends EdEvent<'LaunchDrone'> {
  Type: DroneType;
}

export interface EdProspectedAsteroidEvent
  extends EdEvent<'ProspectedAsteroid'> {
  Materials: {
    Name: string;
    Proportion: number;
  }[];
  Content: AsteroidMaterialContent;
  Content_Localised: string;
  Remaining: number;
}

export interface EdMaterialCollectedEvent extends EdEvent<'MaterialCollected'> {
  Category: MaterialCategory;
  Name: MaterialName;
  Count: number;
}

export interface EdMiningRefinedEvent extends EdEvent<'MiningRefined'> {
  Type: MineralType;
  Type_Localised: string;
}

export interface EdEscapeInterdictionEvent
  extends EdEvent<'EscapeInterdiction'> {
  Interdictor: string;
  IsPlayer: boolean;
}

export interface EdInterdictedEvent extends EdEvent<'Interdicted'> {
  Submitted: boolean;
  Interdictor: string;
  IsPlayer: boolean;
  Faction: string;
}

export interface EdMissionAcceptedEvent extends EdEvent<'MissionAccepted'> {
  Faction: string;
  Name: MissionType;
  LocalisedName: string;
  Commodity: CommodityType;
  Commodity_Localised: string;
  Count: number;
  TargetFaction: string;
  DestinationSystem: string;
  DestinationStation: string;
  Expiry: string; // date
  Wing: boolean;
  Influence: InfluenceReward;
  Reputation: ReputationReward;
  Reward: number;
  MissionID: number;
}

export interface EdMissionCompletedEvent extends EdEvent<'MissionCompleted'> {
  Faction: string;
  Name: MissionType;
  MissionID: number;
  DestinationSystem: string;
  DestinationStation: string;
  Reward: number;
  FactionEffects: MissionFactionEffect[];
}

export interface EdMissionFailedEvent extends EdEvent<'MissionFailed'> {
  Name: MissionType;
  MissionID: number;
}

export interface EdMissionAbandonedEvent extends EdEvent<'MissionAbandoned'> {
  Name: MissionType;
  MissionID: number;
}
