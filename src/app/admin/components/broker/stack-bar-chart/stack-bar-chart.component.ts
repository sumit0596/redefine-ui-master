import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { DashboardService } from 'src/app/admin/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stack-bar-chart',
  templateUrl: './stack-bar-chart.component.html',
  styleUrls: ['./stack-bar-chart.component.scss'],
})
export class StackBarChartComponent {
  //@Input('filter') filter : any;
  totalProperties: number = 0;
  unPublisedTotal: number = 0;
  publisedTotal: number = 0;
  loading: boolean = false;
  stackBarPanelOpenState: boolean = true;
  @ViewChild('chartdivProperties') chartdivProperties!: ElementRef;

  constructor(
    private dashboardService: DashboardService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getPropertyMedia();
  }

  downloadPropertyData() {
    this.dashboardService.getPropertyExcelExport().subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          this.toasterService.error('No data available to download');
          return;
        }

        // Define a header mapping
        const headerMapping: { [key: string]: string } = {
          BuildingCode: 'Building Code',
          PropertyName:'Property Name',
          SectorName:'Sector Name',
          WithRateCardCount:'With Rate Card Count',
          FloorPlan:'Floor Plan',
          MallMap:'Mall Map',
          FactSheet:'Fact Sheet',

          // Add more mappings as needed
          // Example: OriginalHeader: 'Display Header'
        };

        // Transform data dynamically
        const transformedData = data.map((item: any) => {
          const newItem = { ...item };
          for (const key in newItem) {
            if (newItem[key] === 0) {
              newItem[key] = 'No';
            } else if (newItem[key] === 1) {
              newItem[key] = 'Yes';
            }
          }
          return newItem;
        });

        // Transform headers based on the mapping
        const transformedHeaders = Object.keys(transformedData[0]).reduce((acc, key) => {
          acc[key] = headerMapping[key] || key; // Use mapped header or original key if no mapping found
          return acc;
        }, {} as { [key: string]: string });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData, { header: Object.keys(transformedHeaders) });

        // Ensure !ref is defined
        if (!ws['!ref']) {
          console.error('Worksheet reference is undefined');
          return;
        }

        // Update the header row with mapped headers
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ c: C, r: 0 });
          if (!ws[address]) continue;
          ws[address].v = transformedHeaders[ws[address].v] || ws[address].v;
        }

        // Style the entire table (optional, can be removed if not needed)
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ c: C, r: R });
            if (!ws[address]) continue;
            if (!ws[address].s) ws[address].s = {};
            ws[address].s.border = {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            };
          }
        }

        const wb: XLSX.WorkBook = {
          Sheets: { 'Property Data': ws },
          SheetNames: ['Property Data'],
        };
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          'propertymedia_data.xlsx'
        );
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.toasterService.error('Error fetching data for download');
      },
    });
  }


  downloadPropertyExcel(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { Sheet1: ws },
      SheetNames: ['Sheet1'],
    };
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    try {
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      // Handle error if download fails
    }
  }

  getPropertyMedia() {
    this.loading = true;
    this.dashboardService.getPropertyMedia().subscribe({
      next: (res) => {
        this.loading = false;
        this.totalProperties = res.Total;
        this.publisedTotal = res.PublishTotal;
        this.unPublisedTotal = res.UnPublishTotal;

        setTimeout(() => {
          let chk = document.getElementById('chartdivProperties');
          if(chk != null){//malik update
            this.createChart(res);
          }
        }, 100);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
    });
  }

  stackResetFilter(ev: MouseEvent) {
    ev.stopPropagation();
    this.getPropertyMedia();
  }

  createChart(res: any) {
    let root = am5.Root.new('chartdivProperties');
    let myTheme = am5.Theme.new(root);
    myTheme.rule('Grid', ['base']).setAll({
      strokeOpacity: 0.1,
    });

    myTheme
      .rule('ColorSet')
      .set('colors', [am5.color('#8D83A6'), am5.color('#C00018')]);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    // chart.set(
    //   'scrollbarY',
    //   am5.Scrollbar.new(root, {
    //     orientation: 'vertical',
    //   })
    // );

    let data = [
      {
        type: 'Esg',
        without: res.WithoutEsgCount,
        with: parseInt(res.WithEsgCount),
      },
      {
        type: 'Fact Sheet',
        without: res.WithoutFactSheetCount,
        with: parseInt(res.WithFactSheetCount),
      },
      {
        type: 'Mall Map',
        without: res.WithoutMallMapCount,
        with: parseInt(res.WithMallMapCount),
      },
      {
        type: 'Floor Plan',
        without: res.WithoutFloorPlanCount,
        with: parseInt(res.WithFloorPlanCount),
      },
      {
        type: 'Rate Card',
        without: res.WithoutRateCardCount,
        with: parseInt(res.WithRateCardCount),
      },
      {
        type: 'Brochure',
        without: res.WithoutBrochureCount,
        with: parseInt(res.WithBrochureCount),
      },
      {
        type: 'Video',
        without: res.WithoutVideoCount,
        with: parseInt(res.WithVideoCount),
      },
      {
        type: 'Photos',
        without: res.WithoutImageCount,
        with: parseInt(res.WithImageCount),
      },
    ];

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 5,
    });
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'type',
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    yRenderer.grid.template.setAll({
      location: 1,
      visible: false,
    });

    yAxis.data.setAll(data);

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 35,
          strokeOpacity: 0,
          strokeWidth: 0,
        }),
      })
    );

    xAxis.get('renderer').grid.template.setAll({
      location: 0,
      strokeWidth: 0,
      visible: false,
    });

    xAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#666666'),
    });
    yAxis.get('renderer').labels.template.setAll({
      fill: am5.color('#666666'),
    });

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: 80,
        x: am5.p50,
        clickTarget: 'none',
        // x: am5.p50,
        // centerX: 50,
        // centerY: am5.p100,
        // y: am5.p0,
        // layout: root.horizontalLayout
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name: any, fieldName: any) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: `[fontWeight: 500;#58595b]${name}`,
          stacked: true,
          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          categoryYField: 'type',
        })
      );

      series.columns.template.setAll({
        tooltipText: `[#ffffff]${name} {categoryY}: {valueX}`,
        tooltipY: am5.percent(90),
        width: am5.percent(50),
        height: am5.percent(70),
      });
      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            // text: '{valueX}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
            shadowColor: am5.color(0x50b300),
          }),
        });
      });

      legend.data.push(series);
    }

    makeSeries('With', 'with');
    makeSeries('Without', 'without');
    chart.appear(1000, 100);
  }
}
