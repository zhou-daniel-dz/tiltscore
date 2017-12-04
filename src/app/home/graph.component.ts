import { Component, OnInit, Input } from '@angular/core';
import { TiltscoreService } from '../tiltscore.service';
import { SelectItem } from 'primeng/primeng';
import { TiltscoreCalculationsService, ITiltData, IMetricData } from '../tiltscore-calculations.service';

export interface IChartDetailsData {
  // Loss Percent
  lpData: number[];

  // Loss Streak
  lsData: number[];
  xLsLabels: string[];

  // Time Since Loss
  tslData: number[];
  xTslLabels: string[];

  // Gold Differential
  gdDataSelf: number[];
  gdDataOpponent: number[];
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  public detailsChartData: IChartDetailsData = {
    lpData: [0, 0],
    lsData: [0],
    xLsLabels: [''],
    tslData: [0],
    xTslLabels: [''],
    gdDataSelf: [0],
    gdDataOpponent: [0],
  } as IChartDetailsData;
  public optionsLossPercentage;
  public lossPercentData;
  public optionsLossStreak;
  public streakRatingData;
  public timeSinceLossOptions;
  public timeSinceLossData;
  public goldDifferentialOptions;
  public goldDifferentialData;

  ngOnInit() {
    this.constructGraphs(this.detailsChartData);
  }

  public constructGraphs(chartData: IChartDetailsData) {
    this.detailsChartData = chartData;

    this.optionsLossPercentage = {
      title: {
        fontStyle: 'normal',
        display: true,
        fontSize: 20,
        fontFamily: 'Lato',
        fontColor: '#fff',
        text: 'Loss Percentage'
      }
    };
    this.lossPercentData = {
      labels: ['Wins', 'Losses'],
      datasets: [
        {
          backgroundColor: ['rgba(35, 237, 75, 0.5)', 'rgba(237, 61, 35, 0.5)'],
          borderColor: 'rgba(255, 255, 255, 0.8)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: this.detailsChartData.lpData,
        }
      ],
    };

    this.optionsLossStreak = {
      legend: {
        display: false,
      },
      title: {
        fontStyle: 'normal',
        display: true,
        fontSize: 20,
        fontFamily: 'Lato',
        fontColor: '#fff',
        text: 'Loss Streak Rating'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Tiltscore Rating'
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Losses in a row'
          },
        }],
      }
    };

    this.streakRatingData = {
      labels: this.detailsChartData.xLsLabels,
      datasets: [
        {
          backgroundColor: ['rgba(237, 61, 35, 0.8)'],
          borderColor: 'rgba(255, 255, 255, 0.8)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: this.detailsChartData.lsData,
          fill: false,
        }
      ],
    };

    this.timeSinceLossOptions = {
      legend: {
        display: false,
      },
      title: {
        fontStyle: 'normal',
        display: true,
        fontSize: 20,
        fontFamily: 'Lato',
        fontColor: '#fff',
        text: 'Time Since Loss Rating'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Tiltscore Rating'
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Minutes since last loss',
          },
        }],
      }
    };

    this.timeSinceLossData = {
      labels: this.detailsChartData.xTslLabels,
      datasets: [
        {
          backgroundColor: ['rgba(237, 61, 35, 0.8)'],
          borderColor: 'rgba(255, 255, 255, 0.8)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: this.detailsChartData.tslData,
          fill: false,
        }
      ],
    };

    this.goldDifferentialOptions = {
      legend: {
        display: false,
      },
      title: {
        fontStyle: 'normal',
        display: true,
        fontSize: 20,
        fontFamily: 'Lato',
        fontColor: '#fff',
        text: 'Counterpart Gold Differential'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Total Gold Earned'
          },
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Recent games',
          },
        }],
      }
    };

    this.goldDifferentialData = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          backgroundColor: ['rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)'
          , 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)'
          , 'rgba(35, 237, 75, 0.5)', 'rgba(35, 237, 75, 0.5)'],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: this.detailsChartData.gdDataSelf,
          fill: false,
        },
        {
          backgroundColor: ['rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)'
          , 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)'
          , 'rgba(237, 61, 35, 0.5)', 'rgba(237, 61, 35, 0.5)'],
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: this.detailsChartData.gdDataOpponent,
          fill: false,
        },
      ],
    };
  }
}
