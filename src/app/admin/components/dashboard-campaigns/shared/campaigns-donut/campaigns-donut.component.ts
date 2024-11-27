import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-campaigns-donut',
  templateUrl: './campaigns-donut.component.html',
  styleUrls: ['./campaigns-donut.component.scss']
})
export class CampaignsDonutComponent {

  isLoading: boolean = false;
  chart: any;
  root: any;

  @Input() chartdata!: any;
  @Input() label!: string;
  @Input() id!: string;
  @Input() chartSetting: any;

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    if (this.chart) {
      this.chart.dispose();
      this.root.dispose();
    }
  setTimeout(() => {
      let chk = document.getElementById(this.id);
      if(chk != null){
        this.createChart(this.chartdata, this.label);
      }
    }, 100);
  }


  createChart(data: any, label: string) {

    let id = this.id;
    am5.array.each(am5.registry.rootElements, function (root: any) {
      if (root && root.dom.id == id) {
        root.dispose();
      }
    });
    let radius = window.innerWidth <= 1366 ? am5.percent(40) : am5.percent(45);

    let piePosition;

    if (data.length >= 7) {
      if(this.id === 'chartDivAllLeadsBySource'){
        piePosition = am5.percent(5);
      }else{
        piePosition = am5.percent(5);
      }
    } else {
      piePosition = am5.percent(5);
    }

    // let piePosition = (this.id == 'chartDivAllLeadsBySource') ? am5.percent(5) : am5.percent(5)

    this.root = am5.Root.new(this.id);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    this.chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
            x: am5.percent(-20),
            centerX: 5,
            centerY: am5.percent(50),
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
        valueField: 'value',
        legendLabelText: getLegendLabelText(screenWidth),
        legendValueText: '',
        alignLabels: false,
      })
    );

    window.addEventListener('resize', function () {
      const newScreenWidth = window.innerWidth;
      series.set('legendLabelText', getLegendLabelText(newScreenWidth));
    });

    series.get('colors').set('colors', [
      // am5.color('#aa0015'),
      am5.color('#E6001C'),
      am5.color('#8D83A6'),
      am5.color('#999999'),
      am5.color('#333333'),
      am5.color('#555d8b'),
      am5.color('#289889'),
      am5.color('#68c9d0'),
      am5.color('#004b6a')
    ]);

    series.slices.template.states.create('active', {
      shiftRadius: 10,
      stroke: am5.color('#FFFFFF'),
      strokeWidth: 0,
    });

    series.children.push(
      am5.Label.new(this.root, {
        text: `[#58595b]${label}[/]\n[fontSize: 24px;fontWeight: 500;#58595b]${this.getCount(data)
          }[/]`,
        fontSize: 16,
        textAlign: 'center',
        centerX: am5.percent(50),
        centerY: am5.percent(50),
      })
    );

    series.labels.template.setAll({
        fontSize: 12,
        fontWeight: '400',
        text: '{value}',
        tooltipText: '{label}',
        fill: am5.color('#FFFFFF'),
        radius: 15,
        inside: true,
        ticks: false,
    });

    series.ticks.template.set('visible', false);
    series.data.setAll(data);

    let legendYPosition;

    if (data.length >= 7) {
      if(this.id === 'chartDivAllLeadsBySource'){
        legendYPosition = am5.percent(95);
      }else{
       legendYPosition = am5.percent(95);
      }
    } else if (data.length >= 5) {
      legendYPosition = am5.percent(95);
    } else {
      legendYPosition = am5.percent(85);
    }
    // let legendYPositionT = data.length > 5 ? am5.percent(95) : am5.percent(85);
    // Add Legend
    let legend = this.chart.children.push(
      am5.Legend.new(this.root, {
            x: am5.percent(75),
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
      // centerY: 0, // if we want labels to be top-aligned
      // oversizedBehavior:  "wrap"
    })

    legend.data.setAll(series.dataItems);
  }

  getCount(data: any) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
      total = total + data[i].value;
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
