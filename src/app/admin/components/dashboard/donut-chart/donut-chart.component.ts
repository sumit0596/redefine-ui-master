import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
 
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit, OnChanges {
  loading: boolean = false;
  @Input() chartData$!: Observable<any>;
  @Input() isadmin: boolean = false;
  @Input() chartId: string = '';
  @Input() type : string ='';
  @Input() insideLabel : string = '';
 
  chart: any;
  root: any;
  result: any = [];
  chartdata: any;
 
  private previousClassnameCount: number = 0;
  openPanelLeft: boolean = false;
 
  constructor(private dashboardService: DashboardService) { }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData$'] && !changes['chartData$'].firstChange) {
      this.initChart();
    }
  }
 
  ngDoCheck() {
    const getClassname = document.querySelectorAll('.rd-main-container.dashboard-layout');
    const currentClassnameCount = getClassname.length;
    if (currentClassnameCount !== this.previousClassnameCount) {
      if (getClassname.length) {
        this.openPanelLeft = true;
      } else {
        this.openPanelLeft = false;
      }
      this.previousClassnameCount = currentClassnameCount;
    }
  }
  ngOnInit(): void {
    this.initChart();
  }
  initChart() {
    this.loading = true;
    this.chartData$.subscribe((result) => {
      if (!this.isadmin) {
        this.chartdata = result?.data;
      }else{
        this.chartdata = result?.data?.res;
      }
      this.loading = false;
      if (this.chart) {
        this.chart.dispose();
        this.root.dispose();
      }
      setTimeout(() => {
        let chk = document.getElementById(this.chartId);
        if(chk != null){
          this.createChart(this.chartdata,result.label);
        }
      }, 100);
    });
  }
 
  createChart(data: any,type:any) {
 
      let radius;
      if (window.innerWidth <= 1366) {
        if (this.openPanelLeft) {
          radius = am5.percent(45)
        } else {
          radius = this.isadmin ? am5.percent(68) : am5.percent(55)
        }
      } else {
        radius = am5.percent(68)
      }
 
      const rootElementId = this.chartId;
      this.root = am5.Root.new(rootElementId);
      this.root.setThemes([am5themes_Animated.new(this.root)]);
      this.chart = this.root.container.children.push(
        am5percent.PieChart.new(this.root, {
          x: this.isadmin ? am5.percent(-20) : am5.percent(-25),
          centerX: 5,
          centerY: am5.percent(45),
          y: am5.percent(50),
          radius: radius,
          innerRadius: am5.percent(60),
        })
      );
 
      function getLegendLabelText(screenWidth: any) {
        if (screenWidth < 1366) {
          return '[fontWeight: 500;fontSize: 12px;#58595b]{category} [fontWeight: 400;margin-left: 6px;fontSize: 12px;#58595b]{valuePercentTotal.formatNumber("0.00p")}';
        } else {
          return '[fontWeight: 500;fontSize: 14px;#58595b]{category} [fontWeight: 400;margin-left: 6px;fontSize: 14px;#58595b]{valuePercentTotal.formatNumber("0.00p")}';
        }
      }
 
      const screenWidth = window.innerWidth;
 
      const series = this.chart.series.push(
        am5percent.PieSeries.new(this.root, {
          categoryField: 'label',
          legendLabelText: getLegendLabelText(screenWidth),
          valueField: 'value',
          legendValueText: '',
          alignLabels: false,
        })
      );
 
      window.addEventListener('resize', function () {
        const newScreenWidth = window.innerWidth;
        series.set('legendLabelText', getLegendLabelText(newScreenWidth));
      });
      let filteredData;
 
      if (!this.isadmin) {
        filteredData = [
          { label: 'Available Units', value: data.AvailableUnitCount },
          { label: 'Under Offer Units', value: data.UnderOfferUnitCount },
          { label: 'Under Negotiation Units', value: data.UnderNegotiationUnitCount },
          { label: 'Let Units', value: data.LetUnitCount },
          { label: 'Unavailable Units', value: data.UnavailableUnitCount },
        ].filter(item => item.value > 0);
 
        series.get('colors').set('colors', [
          am5.color('#289889'),
          am5.color('#8D83A6'),
          am5.color('#68c9d0'),
          am5.color('#004b6a'),
          am5.color('#E6001C')
        ]);
 
        series.children.push(
          am5.Label.new(this.root, {
            text: `[#58595b]${type === 1 ? 'All Units' : 'My Units'
            }[/]\n[fontSize: 24px;fontWeight: 500;#58595b]${data.AvailableUnitCount
              + data.UnavailableUnitCount
              + data.UnderOfferUnitCount
              + data.UnderNegotiationUnitCount
              + data.LetUnitCount
              }[/]`,
            fontSize: 16,
            textAlign: 'center',
            centerX: am5.percent(50),
            centerY: am5.percent(50),
          })
        );
      }
     else {
      filteredData = data
        .filter((item:any) => item.Count > 0)
        .map((item:any) => ({
          label: item[this.type],
          value: item.Count
        }));
 
      series.get('colors').set('colors', [
        am5.color('#E6001C'),
        am5.color('#8D83A6'),
        am5.color('#999999'),
        am5.color('#333333'),
        am5.color('#555d8b'),
        am5.color('#289889'),
        am5.color('#68c9d0'),
        am5.color('#004b6a')
      ]);
 
      series.children.push(
        am5.Label.new(this.root, {
          text: `[#58595b]${this.insideLabel}[/]\n[fontSize: 24px;fontWeight: 500;#58595b]${
            filteredData.reduce((sum:any, item:any) => sum + item.value, 0)
          }[/]`,
          fontSize: 16,
          textAlign: 'center',
          centerX: am5.percent(50),
          centerY: am5.percent(50),
        })
      );
    }
    series.data.setAll(filteredData);
 
      //   series.data.setAll([
      //     {
      //       label: 'Available Units',
      //       value: data.AvailableUnitCount,
      //     },
      //     {
      //       label: 'Under Offer Units',
      //       value: data.UnderOfferUnitCount,
      //     },
      //     {
      //       label: 'Under Negotiation Units',
      //       value: data.UnderNegotiationUnitCount,
      //     },
      //     {
      //       label: 'Let Units',
      //       value: data.LetUnitCount,
      //     },
      //     {
      //       label: 'Unavailable Units',
      //       value: data.UnavailableUnitCount,
      //     },
      //   ]);
 
      // } else {
       
      //   series.get('colors').set('colors', [
      //     am5.color('#E6001C'),
      //     am5.color('#8D83A6'),
      //     am5.color('#999999'),
      //     am5.color('#333333'),
      //     am5.color('#555d8b'),
      //     am5.color('#289889'),
      //     am5.color('#68c9d0'),
      //     am5.color('#004b6a')
      //   ]);
   
      //   series.children.push(
      //     am5.Label.new(this.root, {
      //       text: `[#58595b]${this.insideLabel}[/]\n[fontSize: 24px;fontWeight: 500;#58595b]${
      //         this.getCount(data)
      //       }[/]`,
      //       fontSize: 16,
      //       textAlign: 'center',
      //       centerX: am5.percent(50),
      //       centerY: am5.percent(50),
      //     })
      //   );
      //   this.result = [];
      //   for(let i = 0; i < data.length; i++){
      //       this.result.push({
      //         label: data[i][this.type],
      //         value: data[i].Count ? data[i].Count : 0
      //       });
      //   }
       
      //   series.data.setAll(this.result);
      // }
 
      series.slices.template.states.create('active', {
        shiftRadius: 10,
        stroke: am5.color('#FFFFFF'),
        strokeWidth: 0,
      });
 
      series.ticks.template.setAll({
        strokeWidth: 2,
        strokeOpacity: 1
      });
 
      // Add Label
      series.children.push(
        am5.Label.new(this.root, {
          fontSize: 10,
          populateText: false,
          fontWeight: '500',
        })
      );
 
 
      series.labels.template.setAll({
        fontSize: window.innerWidth <= 1366 ? 10 : 13,
        fontWeight: '400',
        text: '{value}',
        tooltipText: '{label}',
        oversizedBehavior: "wrap",
        radius: 20,
        inside: true,
        ticks: false,
        fill: am5.color('#FFFFFF'),
      });
 
      series.ticks.template.set('visible', false);
      // Add Legend
      let legend = this.chart.children.push(
        am5.Legend.new(this.root, {
          x: am5.percent(72),
          centerX: 0,
          centerY: am5.p50,
          y: am5.percent(50),
          layout: this.root.verticalLayout,
          clickTarget: "none"
        })
      );
      legend.labels.template.setAll({
        maxWidth: 130,
        minWidth: 100,
        centerX: 0,
        centerY: am5.percent(50),
      })
      legend.data.setAll(series.dataItems);
  }
 
  getCount(data: any) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total = total + data[i].Count;
    }
    return total;
  }
 
  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.root.dispose();
    }
  }
}