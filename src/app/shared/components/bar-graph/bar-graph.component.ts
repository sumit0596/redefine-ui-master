import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss'],
})
export class BarGraphComponent implements OnInit, OnChanges {
  loading: boolean = false;
  @Input() chartData$!: Observable<any>;
  @Input() type: any;
  chart: any;
  chartSubscription!: Subscription;
  @ViewChild('chartdivPageViews') chartdivPageViews!: ElementRef;
  @ViewChild('chartdivSessions') chartdivSessions!: ElementRef;
  @ViewChild('chartdivDownloads') chartdivDownloads!: ElementRef;
  @ViewChild('chartdivViewJobs') chartdivViewJobs!: ElementRef;

  root: any;
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData$'] && !changes['chartData$'].firstChange) {
      this.disposeRoot();
      this.initChart();
    }
  }
  ngOnInit(): void {
    this.disposeRoot();
    this.initChart();
  }

  initChart() {
    if (this.chartData$) {
      this.chartSubscription = this.chartData$.subscribe((value) => {
      setTimeout(() => {
          let chk = document.getElementById('chartdiv'+this.type);
          if(chk != null){
            this.createChart(value, this.type);
          }
        }, 100);
      });
    }
  }

  createChart(data: any, type: any) {
    switch (this.type) {
      case 'PageViews':
        this.root = am5.Root.new('chartdivPageViews');
        break;
      case 'Sessions':
        this.root = am5.Root.new('chartdivSessions');
        break;
      case 'Downloads':
        this.root = am5.Root.new('chartdivDownloads');
        break;
      case 'Jobs':
        this.root = am5.Root.new('chartdivViewJobs');
        break;
    }
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    var chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        pinchZoomX: false,
        paddingLeft: 0,
        paddingRight: 1,
      })
    );
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);
    var xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 15,
      //  minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
      rotation: -55,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
      visible: false,
    });

    xRenderer.grid.template.setAll({
      location: 0,
      strokeWidth: 0,
      visible: false,
    });

    var xAxis = chart.xAxes.push(
     this.getXaxisValue(xRenderer)
    );

    var yRenderer = am5xy.AxisRendererY.new(this.root, {
      strokeOpacity: 0.1,
    });

    yRenderer.grid.template.setAll({
      location: 0,
      strokeWidth: 0,
      visible: false,
    });

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0.3,
        renderer: yRenderer,
        visible: false,
      })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(this.getData(xAxis, yAxis, this.root));

    series.columns.template.setAll({
      cornerRadiusTL: 0,
      cornerRadiusTR: 0,
      strokeOpacity: 0,
      width: 30,
      
    });
    series.columns.template.adapters.add(
      'fill',
      function (fill: any, target: any) {
        return chart.get('colors')?.getIndex(series.columns.indexOf(target));
      }
    );

    series.columns.template.adapters.add(
      'stroke',
      function (stroke: any, target: any) {
        return chart.get('colors')?.getIndex(series.columns.indexOf(target));
      }
    );
    // series.columns.template.set('width', 40);

    // let url = 'string';
    // data.forEach((element: any, index: number) => {
    //   element.Url = url + index;
    // });

    // data.forEach((element: any, index: number) => {
    //   let url = element.Url.split('/');
    //   if(url[url.length - 1] == ''){
    //     element.Url = `home`+ index;
    //   }
    //   else{
    //   element.Url = url[url.length - 1] + index;
    //   }
    // });

    xAxis.data.setAll(data);
    series.data.setAll(data);

    chart.get('colors')?.set('colors', this.generateColors(data.length));

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
  }

  ngOnDestroy() {
    this.chartSubscription?.unsubscribe();
    if (this.chart) {
      this.chart.dispose();
      this.root.dispose();
    }
  }

  getData(xAxis: any, yAxis: any, root: any): any {
    switch (this.type) {
      case 'PageViews':
        return am5xy.ColumnSeries.new(root, {
          name: 'Series 1',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'TotalViews',
          sequencedInterpolation: true,
          categoryXField: 'Url',

          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        });

      case 'Sessions':
        return am5xy.ColumnSeries.new(root, {
          name: 'Series 1',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'Session',
          sequencedInterpolation: true,
          categoryXField: 'Title',

          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        });

      case 'Downloads':
        return am5xy.ColumnSeries.new(root, {
          name: 'Series 1',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'Downloads',
          sequencedInterpolation: true,
          categoryXField: 'DUrl',

          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        });

      case 'Jobs':
        return am5xy.ColumnSeries.new(root, {
          name: 'Series 1',
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'TotalViews',
          sequencedInterpolation: true,
          categoryXField: 'Url',

          tooltip: am5.Tooltip.new(root, {
            labelText: '{valueY}',
          }),
        });
    }
  }

  disposeRoot() {
    switch (this.type) {
      case 'PageViews':
        this.removedDomNode('chartdivPageViews');
        break;
      case 'Sessions':
        this.removedDomNode('chartdivSessions');
        break;
      case 'Downloads':
        this.removedDomNode('chartdivDownloads');
        break;
      case 'Jobs':
        this.removedDomNode('chartdivViewJobs');
        break;
    }
  }

  removedDomNode(dom: any) {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root.dom.id == dom) {
          root.dispose();
        }
      }
    });
  }

  getXaxisValue(xRenderer : any) : any{
    if(this.type == 'Sessions'){
    return  am5xy.CategoryAxis.new(this.root, {
        maxDeviation: 0.3,
        categoryField: 'Title',
        renderer: xRenderer,
        // tooltip: am5.Tooltip.new(this.root, {}),
      })
    }
    else if(this.type == 'Downloads'){
      return  am5xy.CategoryAxis.new(this.root, {
          maxDeviation: 0.3,
          categoryField: 'DUrl',
          renderer: xRenderer,
        })
      }
    else{
      return  am5xy.CategoryAxis.new(this.root, {
        maxDeviation: 0.3,
        categoryField: 'Url',
        renderer: xRenderer,
      })
    }
  }

  generateColors(count: number): any[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(am5.color('#c00018'));
    }
    return colors;
  }  

}
