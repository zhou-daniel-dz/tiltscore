import { Injectable } from '@angular/core';
import { IMatchData, IMatchListData, IMatchReferenceData } from './models/matches';
import { forIn, forEach } from 'lodash';
import { IChartDetailsData } from './home/graph.component';

export interface ITiltData {
  metricData: IMetricData;
  tiltscore: number;
}

export interface IMetricData {
  lossPercentage: number;
  lossStreak: number;
  timeSinceLoss: number;
  counterpartGoldDifference: number;
}

@Injectable()
export class TiltscoreCalculationsService {

  private readonly LOSS_STREAK_BASE = 2;
  private readonly NUMBER_OF_METRICS = 4;
  private readonly METRIC_WEIGHT: IMetricData = {
    lossPercentage: 20,
    lossStreak: 30, // exponential increase with base 2 up to max of 30
    timeSinceLoss: 25,
    counterpartGoldDifference: 25,
  };
  private _metricValues: IMetricData = {
    lossPercentage: 0,
    lossStreak: 0,
    timeSinceLoss: 0,
    counterpartGoldDifference: 0,
  };
  private _matchData: IMatchData[];
  private _gamesAnalyzed: number;
  private _accountId: number;
  private _currentMatchMetricsScore: number;
  private _matchWinStatuses: boolean[];

  private _detailsChartData: IChartDetailsData = {
    lpData: [0, 0],
    lsData: [],
    xLsLabels: [],
    tslData: [],
    xTslLabels: [],
    gdDataSelf: [],
    gdDataOpponent: [],
  } as IChartDetailsData;

  private _lossPercentageMetric() {
    this._matchData.forEach(match => {
      match.participantIdentities.forEach(pId => {
        if (pId.player.accountId === this._accountId) {
          match.participants.forEach(participant => {
            if (participant.participantId === pId.participantId) {
              if (participant.stats.win) {
                this._matchWinStatuses.push(true);
                this._detailsChartData.lpData[0] += 1;
              } else {
                this._currentMatchMetricsScore += this.METRIC_WEIGHT.lossPercentage / this._gamesAnalyzed;
                this._metricValues.lossPercentage += this.METRIC_WEIGHT.lossPercentage / this._gamesAnalyzed;
                this._detailsChartData.lpData[1] += 1;
                this._matchWinStatuses.push(false);
              }
              return;
            }
          });
        }
      });
    });
  }

  private _currentLossStreakMetric() {
    let matchStatusIndex = 0;
    let lossStreakExponent = 0;
    while (!this._matchWinStatuses[matchStatusIndex]) { // Cap exponential increase at power of 4
      matchStatusIndex += 1;
      if (matchStatusIndex > 3) {
        this._detailsChartData.xLsLabels.push(matchStatusIndex.toString());
        this._detailsChartData.lsData.push(this.LOSS_STREAK_BASE ** lossStreakExponent);
      } else {
        lossStreakExponent += 1;
        this._currentMatchMetricsScore += this.LOSS_STREAK_BASE ** lossStreakExponent;
        this._metricValues.lossStreak += this.LOSS_STREAK_BASE ** lossStreakExponent;
        this._detailsChartData.lsData.push(this._metricValues.lossStreak);
        this._detailsChartData.xLsLabels.push(matchStatusIndex.toString());
      }
    }
  }

  private _timeSinceLastLossMetric() {
    let matchStatusIndex = 0;
    while (true) {
      if (!this._matchWinStatuses[matchStatusIndex]) {
        const secondsSinceLoss = (Date.now() -
          (this._matchData[matchStatusIndex].gameCreation + (this._matchData[matchStatusIndex].gameDuration * 1000))) / 1000;
        let timeBreakMultiplier = 1;

        while (timeBreakMultiplier * 5 <= 25) {
          this._detailsChartData.xTslLabels.push(((300 * (2 ** timeBreakMultiplier)) / 60).toString());
          this._detailsChartData.tslData.unshift(timeBreakMultiplier * 5);
          if (secondsSinceLoss < 300 * (2 ** timeBreakMultiplier)) {
            this._currentMatchMetricsScore += 30 - timeBreakMultiplier * 5;
            this._metricValues.timeSinceLoss += 30 - timeBreakMultiplier * 5;
            break;
          }
          timeBreakMultiplier += 1;
        }
        return;
      }
      matchStatusIndex += 1;
    }
  }

  private _counterpartGoldDifference() {
    let goldEarned: number;
    let role: string;
    this._matchData.forEach(match => {
      match.participantIdentities.forEach(pId => {
        if (pId.player.accountId === this._accountId) {
          match.participants.forEach(participant => {
            if (participant.participantId === pId.participantId) {
              goldEarned = participant.stats.goldEarned;
              this._detailsChartData.gdDataSelf.push(goldEarned);
              role = participant.timeline.role;
            }
          });
          match.participants.forEach(participant2 => {
            if (participant2.timeline.role === role && participant2.participantId !== pId.participantId) {
              const goldDifference = participant2.stats.goldEarned - goldEarned;
              this._detailsChartData.gdDataOpponent.push(participant2.stats.goldEarned);
              if (goldDifference > 2000) {
                this._currentMatchMetricsScore += this.METRIC_WEIGHT.counterpartGoldDifference / this._gamesAnalyzed;
                this._metricValues.counterpartGoldDifference += this.METRIC_WEIGHT.counterpartGoldDifference / this._gamesAnalyzed;
                return;
              }
            }
          });
        }
      });
    });
  }

  private _resetMetricValues() {
    this._metricValues.counterpartGoldDifference = 0;
    this._metricValues.lossPercentage = 0;
    this._metricValues.lossStreak = 0;
    this._metricValues.timeSinceLoss = 0;
  }

  public getMatchMetricsScore(matchData: IMatchData[], gamesAnalyzed: number, accountId: number): ITiltData {
    this._matchData = matchData;
    this._matchData.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      return 1;
    });
    this._resetMetricValues();
    this._matchWinStatuses = [];
    this._gamesAnalyzed = gamesAnalyzed;
    this._accountId = accountId;
    this._currentMatchMetricsScore = 0;
    this._detailsChartData = {
      lpData: [0, 0],
      lsData: [],
      xLsLabels: [],
      tslData: [],
      xTslLabels: [],
      gdDataSelf: [],
      gdDataOpponent: [],
    } as IChartDetailsData;

    this._lossPercentageMetric();
    this._currentLossStreakMetric();
    this._timeSinceLastLossMetric();
    this._counterpartGoldDifference();
    return {
      metricData: this._metricValues,
      tiltscore: this._currentMatchMetricsScore,
    } as ITiltData;
  }

  public getChartData(): IChartDetailsData {
    return this._detailsChartData;
  }
}
