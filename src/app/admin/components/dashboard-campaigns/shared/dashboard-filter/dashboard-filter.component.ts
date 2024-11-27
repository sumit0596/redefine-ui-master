import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, ElementRef, ViewChild } from '@angular/core';



@Component({
  selector: 'app-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent implements OnInit {
  @Input() filter: any;
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
  constructor(private datePipe: DatePipe) {
    this.selectedDay = this.days[3];
    this.selectedYear = 'Select Year'
  }

  ngOnInit(): void {
    this.generateYearRange();
    if (this.filter) {
      this.applyDefaultFilter();
    }
  }

  ngOnChanges(): void {
    if (this.filter) {
      this.applyDefaultFilter();
    }
  }

  applyDefaultFilter() {
    this.filter.Days = 0;
    this.emitFilteredData();
  }

  generateYearRange() {
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

  emitFilteredData() {
    this.filteredData.emit(this.filter);
  }

  onYearChange(event: any) {
    this.optionSelected = true;
    this.filter.Type = 2;
    this.filter.Days = 0;
    const selectedYear = parseInt(event.id);
    this.filter.StartDate = `${selectedYear}-01-01`;
    this.filter.EndDate = `${selectedYear}-12-31`;
    this.filter.Year = `${selectedYear}`;
    this.filteredData.emit(this.filter);
    this.filterApplied.emit(true);
    this.selectedEventFilter.emit(event.year);
  }

  handleMouseDown(event: MouseEvent) {
    this.optionSelected = false;
  }

  handleClick(event: MouseEvent) {
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
    } else if (event.id == 2) {
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

    if (event.id != 3) {
      this.filter.Type = 1;
      this.filteredData.emit(this.filter);
    }

    this.selectedEventFilter.emit(event.day);
    this.filterApplied.emit(true);
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
    this.calender = false;
    this.errorMessage = ''
  }
}
