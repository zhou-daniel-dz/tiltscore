import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, concatMap, toArray } from 'rxjs/operators';
import { ISummonerData } from './models/summoner';
import { IMatchData, IMatchListData, IMatchReferenceData } from './models/matches';
import { forIn, forEach } from 'lodash';

@Injectable()
export class TiltscoreService {

  public readonly GAMES_ANALYZED = 10;
  public accountId: number;
  private baseURL = '';
  private _staticURL = '.api.riotgames.com/lol/';

  private _apiKey = 'RGAPI-71d8e7b6-5f08-4df9-9f3e-1a5ecce1dcc6';
  private _apiParams = new HttpParams().set('api_key', this._apiKey);

  constructor(
    private _http: HttpClient,
  ) { }

  private _constructBaseURL(region: string) {
    // Riot API doesn't allow CORS, I don't want or currently need to host my own proxy server
    this.baseURL = 'https://cors-anywhere.herokuapp.com/https://' + region + this._staticURL;
  }

  private _getAccountData(name: string): Observable<ISummonerData> {
    return this._http.get<ISummonerData>(`${this.baseURL}summoner/v3/summoners/by-name/${name}`, { params: this._apiParams })
      .pipe(
      map(
        summoner => {
          this.accountId = summoner.accountId;
          return summoner;
        },
        err => {
          alert('error');
        }),
    );
  }

  private _getMatchListData(): Observable<IMatchReferenceData[]> {
    return this._http.get<IMatchListData>(`${this.baseURL}match/v3/matchlists/by-account/${this.accountId}`, { params: this._apiParams })
      .pipe(
      map(
        matchList => {
          return matchList.matches.slice(0, this.GAMES_ANALYZED);
        },
        err => {
          alert('error');
        }),
    );
  }

  private _getMatchData(gameId: number, timestamp: number): Observable<IMatchData> {
    return this._http.get<IMatchData>(`${this.baseURL}match/v3/matches/${gameId}`, { params: this._apiParams })
      .pipe(
      map(
        match => {
          return {...match, timestamp: timestamp};
        },
        err => {
          alert('error');
        }),
    );
  }

  public getTiltScore(name: string, region: string): Observable<IMatchData[]> {
    this._constructBaseURL(region);
    return this._getAccountData(name).pipe(
      mergeMap(summoner => this._getMatchListData()),
      concatMap(matchReferences => matchReferences),
      mergeMap(matchReference => this._getMatchData(matchReference.gameId, matchReference.timestamp)),
      toArray()
    );
  }
}
