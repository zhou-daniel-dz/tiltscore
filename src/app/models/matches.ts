export interface IMatchListData {
  matches: IMatchReferenceData[];
  totalGames: number;
  startIndex: number;
  endIndex: number;
}

export interface IMatchReferenceData {
  lane: string;
  gameId: number;
  champion: number;
  platformId: string;
  season: number;
  queue: number;
  role: string;
  timestamp: number;
}

export interface IMatchData {
  seasonId: number;
  queueId: number;
  gameId: number;
  participantIdentities: IParticipantIdData[];
  gameVersion: string;
  platformId: string;
  gameMode: string;
  mapId: number;
  gameType: string;
  // teams: ITeamStatsData[];
  participants: IParticipantData[];
  gameDuration: number;
  gameCreation: number;
  timestamp: number;
}

export interface IParticipantIdData {
  player: IPlayerData;
  participantId: number;
}

export interface IPlayerData {
  currentPlatformId: string;
  summonerName: string;
  matchHistoryUri: string;
  platformId: string;
  currentAccountId: number;
  profileIcon: number;
  summonerId: number;
  accountId: number;
}

// I may add more property mappings if I decide on more metrics, but atm these are
//  all I need for team and participant data/stats

/* don't need this for now
export interface ITeamStatsData {
  win: string;
} */

export interface IParticipantData {
  stats: IParticipantStats;
  participantId: number;
  teamId: number;
  highestAchievedSeasonTier: string;
  championId: number;
  timeline: IParticipantTimelineData;
}

export interface IParticipantTimelineData {
  role: string;
  participantId: number;
}

export interface IParticipantStats {
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalPlayerScore: number;
  goldEarned: number;
}

// Match timeline data

export interface IMatchTimelineData {
  frames: IMatchFrameData[];
  frameInterval: number;
}

export interface IMatchFrameData {
  timestamp: number;
  participantFrames: Map<number, IMatchParticipantFrameData>;
}

export interface IMatchParticipantFrameData {
  teamScore: number;
  participantId: number;
  currentGold: number;
}
