import { Component, OnInit, ViewChild } from '@angular/core';
import { TiltscoreService } from '../tiltscore.service';
import { SelectItem } from 'primeng/primeng';
import { TiltscoreCalculationsService, ITiltData, IMetricData } from '../tiltscore-calculations.service';
import { IChartDetailsData, GraphComponent } from './graph.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public graphData: IChartDetailsData = {
    lpData: [0, 0],
    lsData: [0],
    xLsLabels: [''],
    tslData: [0],
    xTslLabels: [''],
    gdDataSelf: [0],
    gdDataOpponent: [0],
  } as IChartDetailsData;
  public displayGraphs = false;
  public awaitingCalculate = true;
  public loadDone = true;
  public loadFailed = false;
  public selectedRegion = 'na1';
  public exit = false;
  public tiltData: ITiltData = {
    metricData: {
      lossPercentage: 0,
      lossStreak: 0,
      timeSinceLoss: 0,
      counterpartGoldDifference: 0,
    } as IMetricData,
    tiltscore: 0,
  };
  public name = '';
  public chartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    showAllTooltips: false,
    tooltips: {
      enabled: false
    },
    scale: {
      ticks: {
        fontSize: 0,
        showLabelBackdrop: false,
      },
    },
  };

  public data;

  @ViewChild(GraphComponent)
  private _graphComponent: GraphComponent;

  public regions: SelectItem[] = [
    {
      label: 'NA', value: 'na1',
    },
    {
      label: 'EUW', value: 'euw1',
    },
    {
      label: 'EUNE', value: 'eun1',
    },
    {
      label: 'OCE', value: 'oc1',
    },
    {
      label: 'KR', value: 'kr',
    },
  ];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _tiltscoreService: TiltscoreService,
    private _calculate: TiltscoreCalculationsService,
  ) { }

  ngOnInit() {
  }

  private _generateGraphs() {
    this.data = {
      labels: ['Loss percentage', 'Loss streak rating', 'Time since loss', 'Counterpart gold differential'],
      datasets: [
        {
          backgroundColor: 'rgba(245, 132, 0, 0.3)',
          borderColor: 'rgba(245, 132, 0, 1)',
          pointBackgroundColor: 'rgba(245, 132, 0, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(245, 132, 0, 1)',
          data: [this.tiltData.metricData.lossPercentage, this.tiltData.metricData.lossStreak,
          this.tiltData.metricData.timeSinceLoss, this.tiltData.metricData.counterpartGoldDifference]
        }
      ],
    };
    this.graphData = this._calculate.getChartData();
    this._graphComponent.constructGraphs(this.graphData);
  }

  public calculate() {
    this.loadFailed = false;
    this.loadDone = false;
    this.awaitingCalculate = false;
    this._tiltscoreService.getTiltScore(this.name, this.selectedRegion)
      .subscribe(
      matches => {
        this.tiltData = this._calculate.getMatchMetricsScore(matches,
          this._tiltscoreService.GAMES_ANALYZED, this._tiltscoreService.accountId);
      },
      err => {
        this.loadFailed = true;
      },
      () => {
        this.loadDone = true;
        this._generateGraphs();
      },
    );
  }

  public messageStyle(): string {
    if (this.tiltData.tiltscore < 20) {
      return 'tilt-none';
    }
    if (this.tiltData.tiltscore < 40) {
      return 'tilt-some';
    }
    if (this.tiltData.tiltscore < 60) {
      return 'tilting';
    }
    if (this.tiltData.tiltscore < 80) {
      return 'tilted';
    }
    if (this.tiltData.tiltscore < 100) {
      return 'hashinshin';
    }
  }

  public tiltscoreMessage(): string {
    if (this.tiltData.tiltscore < 20) {
      return `You are not tilted, you're good for some more games!`;
    }
    if (this.tiltData.tiltscore < 40) {
      return `You're starting to tilt..., proceed with caution`;
    }
    if (this.tiltData.tiltscore < 60) {
      return `You're tilting, now would be a good time for a break`;
    }
    if (this.tiltData.tiltscore < 80) {
      return `Uhh... we should really take a break now before we lose more elo`;
    }
    if (this.tiltData.tiltscore < 100) {
      return `Welcome hashinshin, we've been expecting you :)`;
    }
  }

  public about() {
    this.exit = true;
    setTimeout(() => {
      this._router.navigateByUrl('/about');
    }, 900);
  }

  public determineFadeRotate(): string {
    if (this.exit) {
      return 'outerRotateContainer fade-out';
    }
    return 'outerRotateContainer fade-in';
  }
  public determineFade(): string {
    if (this.exit) {
      return 'fade-out';
    }
    return 'fade-in';
  }

  public toggleGraphs() {
    this.displayGraphs = !this.displayGraphs;
  }

}
