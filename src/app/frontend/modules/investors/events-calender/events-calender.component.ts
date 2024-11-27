import { style } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of } from 'rxjs';
import { EventService } from 'src/app/admin/services/event.service';
import { CareerService } from 'src/app/frontend/services/career.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-events-calender',
  templateUrl: './events-calender.component.html',
  styleUrls: ['./events-calender.component.scss'],
})
export class EventsCalenderComponent {
  filterForm!: FormGroup;
  bannerDetails: any;
  categoryList$!: Observable<any>;
  bannerText = 'IR events calendar';
  today : any;
  months$: Observable<any> = of([
    {
      Id: '01',
      Name: 'January',
    },
    {
      Id: '02',
      Name: 'February',
    },
    {
      Id: '03',
      Name: 'March',
    },
    {
      Id: '04',
      Name: 'April',
    },
    {
      Id: '05',
      Name: 'May',
    },
    {
      Id: '06',
      Name: 'June',
    },
    {
      Id: '07',
      Name: 'July',
    },
    {
      Id: '08',
      Name: 'August',
    },
    {
      Id: '09',
      Name: 'September',
    },
    {
      Id: 10,
      Name: 'October',
    },
    {
      Id: 11,
      Name: 'November',
    },
    {
      Id: 12,
      Name: 'December',
    },
  ]);
  events$!: Observable<any>;
  calendarData: string | URL | undefined;
  breadcrumbLinks: any;
  filter: { PageNo: number; PerPage: any; EventCategoryId: any; Month: any } = {
    PageNo: 1,
    PerPage: 'all',
    EventCategoryId: undefined,
    Month: undefined,
  };
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private toasterService: ToastrService,
    private careerService: CareerService,
    private http: HttpClient,
    private commonService: CommonService,
    private router: Router,
    private datePipe : DatePipe
  ) {}

  ngOnInit() {
    this.today = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd'
    );
    this.breadcrumbLinks = this.eventService.getInvestorsRouterLinks('events');
    this.filterForm = this.fb.group({
      EventCategoryId: [null],
      Month: [null],
    });
    this.getBanner();
    this.getCategory();
    this.getAllEvents(this.filter);
  }

  getBanner() {
    this.careerService
      .getBanner('EVENT_PAGE_BANNER')
      .subscribe((res: any) => (this.bannerDetails = res.data.Value));
  }

  getAllEvents(filter: any) {
    if (filter) {
      this.events$ = this.eventService.getAllFrontendEvents(filter).pipe(
        map((events: any) => {
          return events.map((event: any) => {
            return {
              ...event,
              EventStartTime: `${event.EventDate} ${event.EventStartTime}`,
            };
          });
        })
      );
    }
  }

  async getCategory() {
    this.categoryList$ = await this.eventService.getCategories();
  }

  clear() {
    this.filterForm.reset({ EventCategoryId: undefined, Month: undefined });
    this.filter = {
      PageNo: 1,
      PerPage: 'all',
      EventCategoryId: this.filterForm.get('EventCategoryId')?.value,
      Month: this.filterForm.get('Month')?.value,
    };
    this.getAllEvents(this.filter);
  }

  filterData(): void {
    this.filter = {
      ...this.filter,
      EventCategoryId: this.filterForm.get('EventCategoryId')?.value,
      Month: this.filterForm.get('Month')?.value,
    };
    this.getAllEvents(this.filter);
  }
  addToCalendar(event: any): void {
    window.open(event.Ical);
  }
  addToCalendar2(event: any): void {
    //let createdTime = new Date().toISOString();
    this.calendarData = [
      'data:text/calendar;charset=utf8,',
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      // 'DURATION:PT6H30M',
      //'DESCRIPTION:' + event.Title,
      'DTSTART;TZID="India":' +
        event.EventDate.substring(0, 4) +
        event.EventDate.substring(5, 7) +
        event.EventDate.substring(8, 10) +
        'T' +
        event.EventStartTime.substring(0, 2) +
        event.EventStartTime.substring(3, 5) +
        '00',
      'DTEND;TZID="India":' +
        event.EventDate.substring(0, 4) +
        event.EventDate.substring(5, 7) +
        event.EventDate.substring(8, 10) +
        'T' +
        event.EventEndTime.substring(0, 2) +
        event.EventEndTime.substring(3, 5) +
        '00',
      'SUMMARY:' + event.Title,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
      'END:VCALENDAR',
      // 'UID:' + this.id,
      //  'DTSTAMP:' + createdTime,
      'PRODID:website-1.0',
    ].join('\n');
    window.open(this.calendarData);
  }

  navigateTo(event: any) {
    if (event.EventCategoryName.toUpperCase() === 'FINANCIAL RESULTS') {
      this.router.navigate(['/investors/financial-results']);
    } else if (event.EventCategoryName.toUpperCase() === 'OTHER') {
      if (event.Url.includes('https')) {
          window.open(event.Url, '_blank');
        } else {
          window.open('https://' + event.Url, '_blank');
        }
    }
  }
}
