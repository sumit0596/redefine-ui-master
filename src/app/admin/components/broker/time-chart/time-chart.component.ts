import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { formatDate } from '@angular/common';

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-time-chart',
  templateUrl: './time-chart.component.html',
  styleUrls: ['./time-chart.component.scss'],
})
export class TimeChartComponent implements OnInit,  OnDestroy {
  loading: boolean = false;
  @Input() chartData$!: Observable<any>;
  @Input() datasetType!: string ;
  chart: any;
  @ViewChild('timeChartDiv') timeChartDiv!: ElementRef;
  @ViewChild('timeChartDivSession') timeChartDivSession!: ElementRef;
 
  root: any;
  chartdata: any;

  // result: any =[];

  constructor() {}

  formatMonth(date: Date) {
    return formatDate(date, 'MMMM', 'en-US');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData$'] && !changes['chartData$'].firstChange) {
      this.loading = true;
      this.disposeRoot();
      this.timeChart();
    }
  }

  ngOnInit(): void {
    this.disposeRoot();
    this.loading = true;
    this.timeChart();
  }

  // ngAfterViewInit(): void {
  //   // Check if timeChartDiv exists in the DOM
  //   if (this.timeChartDiv && this.timeChartDiv.nativeElement) {
  //     this.timeChart();
  //   } else {
      
  //   }
  // }

  timeChart() {
    this.chartData$.subscribe((result) => {
        this.chartdata = result?.data.res;
      this.loading = false;
      if (this.chart) {
        this.chart.dispose();
        this.root.dispose();
      }
       if (this.chartdata?.length) {
         setTimeout(() => {
		 let getRootElementId = this.datasetType === 'sessionType' ? 'timeChartDivSession' : 'timeChartDiv';
		  let chk = document.getElementById(getRootElementId);
          if(chk != null){//malik update
           this.initChart(result?.data?.res);
		   }
         }, 100);
       }
    });
  }
  sortDataByMonth(data: any[]) {
    return data.sort((a, b) => a.Month - b.Month);
  }
  initChart(data: any) {
    // Set themes
    const rootElementId = this.datasetType === 'sessionType' ? 'timeChartDivSession' : 'timeChartDiv';
    this.root = am5.Root.new(rootElementId);
    // this.root = am5.Root.new('timeChartDiv');
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        pinchZoomX: true,
        layout: this.root.verticalLayout,
        maxTooltipDistance: 0,
      })
    );

    chart.get('colors')?.set('colors', [
      // am5.color('#aa0015'),
      am5.color('#E6001C'),
      am5.color('#8D83A6'),
      am5.color('#999999'),
      am5.color('#333333'),
      am5.color('#555d8b'),
      am5.color('#289889'),
      am5.color('#68c9d0'),
      am5.color('#004b6a'),
    ]);

    // Add cursor
    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {}));
    cursor.lineY.set('visible', false);

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        baseInterval: { timeUnit: 'month', count: 1 },
        renderer: am5xy.AxisRendererX.new(this.root, { minGridDistance: 10,}),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    const createSeries = (name: any, field: any) => {
      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: field,
          valueXField: 'Month',
          calculateAggregates: true,
          tooltip: am5.Tooltip.new(this.root, {}),
          // legendLabelText: '[bold {stroke}]{name}:[/]',
          // legendRangeLabelText: '[{stroke}]{name}:[/]',
          legendValueText: '[bold {stroke}]{valueY}[/]',
          legendRangeValueText: '[bold {stroke}]{valueYClose}[/]',
        })
      );

      series
        .get('tooltip')
        .label.set(
          'text',
          '[bold]{name}[/]{this.formatMonth(valueX)}: {valueY}'
        );
      series.data.setAll(
        data.map((item: any) => ({
          ...item,
          Month: new Date(2024, item.Month - 1).getTime(),
        }))
      );
    };
    
    const sortedData = this.sortDataByMonth(data);
    // Function to ensure all objects have consistent keys with default values
    const normalizeData = (data: any[]) => {
      // Extract all unique keys from the data
      const allKeys = data.reduce((keys, obj) => {
        Object.keys(obj).forEach((key) => {
          if (!keys.includes(key)) {
            keys.push(key);
          }
        });
        return keys;
      }, []);

      // Fill missing keys in each object with default value 0
      data.forEach((obj: { [key: string]: any }) => {
        allKeys.forEach((key: string) => {
          if (!(key in obj)) {
            obj[key] = 0;
          }
        });
      });

      return data;
    };

    // Normalize the data
    const normalizedData = normalizeData(sortedData);

    // Create series with normalized data
    Object.keys(normalizedData[0]).forEach((key) => {
      if (key !== 'Month') {
        createSeries(key, key);
      }
    });
    // Set data

    chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
        xAxis: xAxis,
      })
    );

    xAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, {
        themeTags: ['axis'],
      })
    );

    yAxis.set(
      'tooltip',
      am5.Tooltip.new(this.root, {
        themeTags: ['axis'],
      })
    );
    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeWidth: 0,
      visible: false,
    });
    yAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeWidth: 1,
      strokeDasharray: [10, 5],
    });
    let label = chart.children.push(
      am5.Label.new(this.root, {
        fontSize: 10,
        populateText: false,
        fontWeight: '500',
      })
    );

    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        useDefaultMarker: true,
        clickTarget: "none",
        layout: am5.GridLayout.new(this.root, {
          maxColumns: 3,
          fixedWidthGrid: true,
        }),
      })
    );
    legend.labels.template.setAll({
      fontSize: 16,
      fontWeight: '500',
      fill: am5.color('#58595b'),
    });

    legend.valueLabels.template.setAll({
      fontSize: 16,
      fontWeight: '400',
      fill: am5.color('#58595b'),
    });
    legend.data.setAll(chart.series.values);
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusBR: 10,
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.root.dispose();
    }
  }

  disposeRoot() {
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root) {
        if (root && (root.dom.id === 'timeChartDiv' && root.dom.id === 'timeChartDivSession')) {
          root.dispose();
        }
        // if (root.dom.id == 'timeChartDiv') {
        //   root.dispose();
        // }
      }
    });
  }
}
