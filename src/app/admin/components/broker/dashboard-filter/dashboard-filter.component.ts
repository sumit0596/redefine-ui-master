import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FinancialResultService } from 'src/app/admin/services/financial-result.service';
import { map, of } from 'rxjs';


@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent implements OnInit {
  @Input() filter: any;
  @Input() tabLabel!: string;
  @Input() typeOfBlock!: string;
  @Input() searchfilter: string | undefined;
  @Output() filteredData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('filterPopup') filterPopup!: ElementRef<HTMLElement>;
  @Output() filterApplied: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedEventFilter: EventEmitter<any> = new EventEmitter<any>();
  today = new Date();
  days = [
    { id: 1, day: 'Today' },
    { id: 2, day: 'Yesterday' },
    { id: 7, day: 'Last 7 Days' },
    { id: 30, day: 'Last 30 Days' },
    { id: 90, day: 'Last 90 Days' },
    { id: 180, day: 'Last 180 Days' },
    { id: 365, day: 'Last 1 Year' },
    { id: 3, day: 'Custom Date' },
  ];

  years: { id: string; year: string }[] = [];
  financialMaxYear: any;
  selectedYear: any;
  selectedYearValue: any;
  selectedDay: any;
  calender: boolean = false;
  calenderWidow: boolean = true;
  errorMessage: string = '';
  filterType: any;
  optionSelected: boolean = false;
  maximumYear: any;
  isDisabled: boolean = false;
  isExcludeStaff: boolean = true;
  constructor(private datePipe: DatePipe, private financialService: FinancialResultService) {
    this.selectedDay = this.days[3];
    this.selectedYear = 'Select Year'
  }

  ngOnInit(): void {
    this.generateYearRange();
    
    if (this.filter && this.filter.Type === 2) {
      this.applyDefaultFilter();
    }
    if (this.typeOfBlock === 'stakeholderbrokerpie') {
      // this.selectedDay = 'Select Day';
      //this.selectedYearValue = 'Select Year'
    }
  }

  ngOnChanges(): void {
    if (this.filter && this.filter.Type === 2) {
      this.applyDefaultFilter();
    }
  }

  
  applyDefaultFilter() {

    const currentYear = new Date().getFullYear();
    this.filter.Type = 2;
    if (this.typeOfBlock == 'split') {
      this.filter.Days = 30;
      //this.filter.selectedDay = 30;
    }else{
      this.filter.Days = 0;
    }
    if (this.typeOfBlock == 'stakeholderbrokertime') {
      this.selectedYear = 'Select Year';
    } else if (this.typeOfBlock !== 'financialResults') {
        this.selectedYear = {
          id: currentYear.toString(),
          year: `${currentYear} (current yr)`,
        };
        this.filter.StartDate = `${currentYear}-01-01`;
        this.filter.EndDate = `${currentYear}-12-31`;
    } else{
      this.selectedYear = this.financialMaxYear;
    }
    
    this.emitFilteredData();

  }

  generateYearRange() {
    if (this.typeOfBlock === 'financialResults') {
      this.financialService
        .getFilterYears()
        .pipe(
          map((res: any) => {
            if (res.status == 'success') {
              const currentYear = new Date().getFullYear();
              const minYear = res.data[0].YearStart;
              const maxYear = res.data[0].YearEnd;
              const range = maxYear - minYear;
              this.maximumYear = maxYear;
              this.selectedEventFilter.emit(this.maximumYear);
              const availableYears = Array.from({ length: range + 1 }, (_, index) => {
                const year = maxYear - index;
                let yearLabel = year.toString();
                this.selectedYear = maxYear;
                this.financialMaxYear = maxYear;
                /* if (year === currentYear) {
                   yearLabel += ' (current yr)';
                 }*/
                return { id: year.toString(), year: yearLabel };
              });

              this.years = availableYears;
            }
          })
        )
        .subscribe();

    } else {
      const currentYear = new Date().getFullYear();
      const minYear = 2024;
      const maxYear = currentYear;
      const range = maxYear - minYear;

      const availableYears = Array.from({ length: range + 1 }, (_, index) => {
        const year = maxYear - index;
        let yearLabel = year.toString();
        if (year === currentYear) {
          yearLabel += ' (current yr)';
        }
        return { id: year.toString(), year: yearLabel };
      });

      this.years = availableYears;
    }
  }

  emitFilteredData() {
    this.filteredData.emit(this.filter);
  }

  onYearChange(event: any) {
    this.optionSelected = true;
    this.filter.Type = 2;
    this.filter.Days = 0;
    const selectedYear = parseInt(event.id);
    if (this.typeOfBlock !== 'financialResults') {
      this.filter.StartDate = `${selectedYear}-01-01`;
      this.filter.EndDate = `${selectedYear}-12-31`;
    }
    this.filter.Year = `${selectedYear}`;
    this.filteredData.emit(this.filter);
    this.filterApplied.emit(true);
    this.selectedEventFilter.emit(event.year);
  }

  handleMouseDown(event: MouseEvent) {
    this.optionSelected = false;

  }

  handleClick(event: MouseEvent) {
    // const isCustomDatePickerClick = event.target && (event.target as Element).closest('.mat-date-range-picker-content');

    // if (!isCustomDatePickerClick && !this.optionSelected) {
    //   event.stopPropagation();
    // }

    if (this.calender || !this.optionSelected) {
      event.stopPropagation();
    }
  }



  onDataChange(event: any) {
    this.optionSelected = true;
    this.filterType = event.id;
    this.filter.StartDate = null;
    this.filter.EndDate = null;
    this.errorMessage = '';

    

    if (event.id == 3) {
      this.calender = true;
      this.isDisabled = true;
      this.filter.ExcludeStaff = 0;
    }  else {
      this.calender = false;
      this.isDisabled = false; // Ensure Exclude Staff button is enabled for non-custom date options
      this.filter.Days = event.id;
      
      if (event.id == 2) {
      this.calender = false;
      this.filter.Days = 0;
      let today = new Date();
      let yesterday = new Date(today);
      this.filter.StartDate = this.datePipe.transform(
        yesterday.setDate(today.getDate() - 1),
        'yyyy-MM-dd'
      );
      this.filter.EndDate = this.datePipe.transform(
        yesterday.setDate(today.getDate() - 1),
        'yyyy-MM-dd'
      );
    } else {
      this.calender = false;
      this.filter.Days = event.id;
    }

    if(this.typeOfBlock=='split'){
      this.filteredData.emit(this.filter);
    }else{
      if (event.id != 3) {
        this.filter.Type = 1;
        this.filteredData.emit(this.filter);
      }
    }
    this.selectedEventFilter.emit(event.day);
    this.filterApplied.emit(true);

  }
}




  applyDates() {
    this.errorMessage = '';
    if (this.filter.StartDate && this.filter.EndDate) {
      this.filter.StartDate = this.datePipe.transform(
        this.filter.StartDate,
        'yyyy-MM-dd'
      );
      this.filter.EndDate = this.datePipe.transform(
        this.filter.EndDate,
        'yyyy-MM-dd'
      );
      this.filter.Days = 0;
      let el: HTMLElement = this.filterPopup.nativeElement;
      el.click();
      this.filteredData.emit(this.filter);
      this.isDisabled = false;
    } else if (this.filter.StartDate != null && this.filter.EndDate == null) {
      this.errorMessage = '** Please Select End date also.';
    } else {
      this.calenderWidow = true;
    }
    this.filterApplied.emit(true);
  }

  resetSelectInput() {
    
    this.selectedDay = this.days[3];
 
    if (this.selectedDay) {
      this.calender = false;
      this.isDisabled = false;
    }
    //console.log('typeOfBlock',this.typeOfBlock);
    if (this.typeOfBlock === 'stakeholderbrokertime') {
      // this.selectedDay = 'Select';
      this.selectedYear = 'Select Year'
    }
    this.errorMessage = ''
  }

  toggleSwitch(event: any) {
    //event.stopPropagation();
    if (this.filter.StartDate != null && this.filter.EndDate != null) {
      if (event.target.checked == true) {
        this.filter.ExcludeStaff = 1;
        this.filterApplied.emit(true);
      } else {
        this.filter.ExcludeStaff = 0;
        if (this.searchfilter === undefined) {
          this.filterApplied.emit(false);
        }
      }
      this.filteredData.emit(this.filter);
    } else {
      if (this.filter.StartDate != undefined && this.filter.EndDate != undefined) {
        this.errorMessage = '** Please Select date range also.';
      } else {
        if (event.target.checked == true) {
          this.filter.ExcludeStaff = 1;
          this.filterApplied.emit(true);
        } else {
          this.filter.ExcludeStaff = 0;
          if (this.searchfilter === undefined) {
            this.filterApplied.emit(false);
          }
        }
        this.filteredData.emit(this.filter);

      }
    }
  }
}
