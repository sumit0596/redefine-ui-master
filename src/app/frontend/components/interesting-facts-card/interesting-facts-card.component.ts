import {
  OnInit,
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { FrontendService } from '../../services/frontend.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5percent from '@amcharts/amcharts5/percent';
import { map } from 'rxjs';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';

interface HTMLElementWithAm5RootInstance extends HTMLElement {
  am5_root_instance?: any;
}
@Component({
  selector: 'app-interesting-facts-card',
  standalone: true,
  templateUrl: './interesting-facts-card.component.html',
  styleUrls: ['./interesting-facts-card.component.scss'],
  imports: [CommonModule, DatePipe],
})
export class InterestingFactsCardComponent implements AfterViewInit, OnInit {
  private chartRoot!: am5.Root;
  buildingList: string[] = [];
  graphList: any[] = [];
  public updatedDate: Date = new Date();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone,
    private frontendService: FrontendService,
    private cdr: ChangeDetectorRef
  ) {
    this.updatedDate = new Date();
  }

  ngOnInit(): void {
    this.getHomeGraphData();
  }

  private browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  getHomeGraphData(): void {
    this.frontendService
      .getHomeGraphData()
      .pipe(
        map((res: any) => {
          return res.map((graph: any) => {
            return {
              ...graph,
              Sector: graph.Sector.map((sector: any) => {
                return {
                  category: sector.Name,
                  value: sector.Value,
                  label: sector.Lebel,
                };
              }),
              chartDivId: `chartDiv-${graph.Id}`,
            };
          });
        })
      )
      .subscribe({
        next: (result: any) => {
          this.graphList = result;

          const graphWithId5 = this.graphList.find((graph) => graph.Id === 6);
          if (graphWithId5) {
            // Extract building names from objects where graph.Id is 5
            this.buildingList = graphWithId5.Sector.map(
              (sector: any) => sector.category
            );
            // Manually trigger change detection after updating buildingList
            this.cdr.detectChanges();
          }

          setTimeout(() => {
            this.initGraph();
          }, 3000);
        },
        error: (error: any) => {},
      });
  }
  getUpdatedDate(): Date {
    return this.updatedDate;
  }
  initGraph(): void {
    this.browserOnly(() => {
      for (let graph of this.graphList) {
        const chartDiv = document.getElementById(
          graph.chartDivId
        ) as HTMLElementWithAm5RootInstance;
        if (chartDiv && graph.Sector.length > 0) {
          if (!chartDiv.am5_root_instance) {
            // Create a new Root instance only if one does not exist
            const chartRoot = am5.Root.new(chartDiv);
            chartDiv.am5_root_instance = chartRoot; // Store the Root instance on the chartDiv

            chartRoot.setThemes([am5themes_Animated.new(chartRoot)]);

            // chartRoot.setThemes([am5themes_Responsive.new(chartRoot)]);
            if (graph.Id === 4) {
              const barChart: any = chartRoot.container.children.push(
                am5xy.XYChart.new(chartRoot, {
                  panX: false,
                  panY: false,
                  wheelX: 'panX',
                  wheelY: 'zoomX',
                  pinchZoomX: true,

                  layout: chartRoot.verticalLayout,
                })
              );
              let renderX = am5xy.AxisRendererX.new(chartRoot, {
                minGridDistance: 50,

                strokeOpacity: 0,
              });
              if (graph.Id === 4) {
                renderX.labels.template.setAll({
                  rotation: -80,
                  centerY: am5.p50,
                  centerX: am5.p100,
                  paddingRight: 15,
                });
              }
              const barXAxis = barChart.xAxes.push(
                am5xy.CategoryAxis.new(chartRoot, {
                  renderer: renderX,
                  categoryField: 'category',

                  maxDeviation: 0,
                  tooltip: am5.Tooltip.new(chartRoot, {}),
                })
              );

              barXAxis.data.setAll(graph.Sector);

              const barYAxis = barChart.yAxes.push(
                am5xy.ValueAxis.new(chartRoot, {
                  renderer: am5xy.AxisRendererY.new(chartRoot, {
                    strokeOpacity: 0.1,
                  }),
                  min: 0, // Set an appropriate minimum value based on your data
                  max: 100, //
                  maxDeviation: 0,
                })
              );
              const barSeries = barChart.series.push(
                am5xy.ColumnSeries.new(chartRoot, {
                  name: 'Bar Series',
                  xAxis: barXAxis,
                  yAxis: barYAxis,
                  valueYField: 'value',
                  categoryXField: 'category',
                  sequencedInterpolation: true,
                  tooltip: am5.Tooltip.new(chartRoot, {
                    labelText: '{label}',
                  }),
                })
              );

              barSeries.columns.template.setAll({
                cornerRadiusTL: 0,
                cornerRadiusTR: 0,
              });
              barSeries.columns.template.adapters.add(
                'fill',
                function (fill: any, target: any) {
                  return barChart
                    .get('colors')
                    .getIndex(barSeries.columns.indexOf(target));
                }
              );

              barSeries.columns.template.adapters.add(
                'stroke',
                function (stroke: any, target: any) {
                  return barChart
                    .get('colors')
                    .getIndex(barSeries.columns.indexOf(target));
                }
              );
              barSeries.columns.template.setAll({
                width: am5.percent(30),
              });

              let cursor = barChart.set(
                'cursor',
                am5xy.XYCursor.new(chartRoot, {})
              );
              cursor.lineY.set('visible', true);

              barChart
                .get('colors')
                .set('colors', [
                  am5.color(0x004b6a),
                  am5.color(0x017d67),
                  am5.color(0x5c676d),
                ]);

              barXAxis.get('renderer').grid.template.setAll({
                strokeWidth: 0,
                visible: false,
              });
              barYAxis.get('renderer').grid.template.setAll({
                strokeWidth: 0,
                visible: false,
              });

              barSeries.data.setAll(graph.Sector);
            } else if (graph.Id === 6) {
              // When graph.Id is 5, display building names in a list
              this.buildingList = graph.Sector.map(
                (sector: any) => sector.category
              );
              // Manually trigger change detection after updating buildingList
              this.cdr.detectChanges();
            } else {
              const pieChart = chartRoot.container.children.push(
                am5percent.PieChart.new(chartRoot, {
                  layout: chartRoot.verticalLayout,
                  innerRadius: am5.percent(40),
                  radius: am5.percent(60),
                  x: am5.percent(20),
                })
              );

              const pieChartData = graph.Sector.map(
                (sector: any, index: number) => {
                  return {
                    category: sector.Name,
                    value: sector.Value,
                    label: sector.Lebel,
                    // Assign a color from the predefined colors array
                  };
                }
              );

              const pieSeries = pieChart.series.push(
                am5percent.PieSeries.new(chartRoot, {
                  name: 'Pie Series',
                  valueField: 'value',
                  categoryField: 'category',
                  alignLabels: false,
                  legendLabelText: '[{color}]{category}{label}[/]',
                  legendValueText: '[bold {color}]{label}[/]',
                })
              );

              pieSeries.data.setAll(pieChartData);

              pieSeries.set(
                'colors',
                am5.ColorSet.new(chartRoot, {
                  colors: [
                    am5.color(0x004b6a),
                    am5.color(0x017d67),
                    am5.color(0x58595b),
                  ],
                })
              );

              pieSeries.labels.template.setAll({
                fontSize: 15,
                text: '{value}',
                textType: 'radial',
                radius: 3,
                centerX: am5.percent(100),
                fill: am5.color(0xffffff),
              });
              pieSeries.data.setAll(graph.Sector);

              const legend = chartRoot.container.children.push(
                am5.Legend.new(chartRoot, {
                  centerX: am5.percent(50),
                  x: am5.percent(33),
                  y: am5.percent(35),

                  layout: am5.GridLayout.new(chartRoot, {
                    maxColumns: 1,
                    fixedWidthGrid: true,
                  }),
                })
              );
              legend.data.setAll(pieSeries.dataItems);
            }
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.browserOnly(() => {
      if (this.chartRoot) {
        this.chartRoot.dispose();
      }
    });
  }
}
