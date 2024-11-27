import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'rd-recent-updates',
  templateUrl: './recent-updates.component.html',
  styleUrls: ['./recent-updates.component.scss'],
})
export class RecentUpdatesComponent {
  @Input('unitUpdates') unitUpdates$!: Observable<any>;
  @Input('recentEnquiries') recentEnquiries$!: Observable<any>;
  @Input('recentJobs') recentJobs$!: Observable<any>;
  @Input('recentEvents') recentEvents$!: Observable<any>;
  @Input('recentUnits') recentUnits$!: Observable<any>;
  @Output() viewMoreEnquiries: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewMoreJobs: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewMoreEvents: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewMoreUnits: EventEmitter<any> = new EventEmitter<any>();

  @Input('type') type!: any;
  @Input('refresh') refresh: boolean = false;
  // @Input('PageNo') PageNo! : any;
  available: string = 'Available';
  underOffer: string = 'Under Offer';
  underNegotiation: string = 'Under Negotiation';
  let: string = 'Let';
  unavailable: string = 'Unavailable';
  recentEnquiriesList: any = [];
  moreEnquiries: boolean = false;
  recentUnitsList: any = [];
  moreUnits: boolean = false;
  moreJobs: boolean = false;
  jobList: any = [];
  eventsList: any = [];
  moreEvents: boolean = false;
  // tabLabel: boolean = false;
  
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['recentEnquiries$'] ||
      changes['recentJobs$'] ||
      changes['recentEvents$'] ||
      changes['recentUnits$']
    ) {
      switch (this.type) {
        case 'enquiries':
          if (this.recentEnquiries$) {
            this.recentEnquiries$.subscribe((data) => {
              if (data.length == 0) {
                //malik
                this.toScroll('recentEnquiries-id');
                this.moreEnquiries = true;
              } else if (this.refresh) {
                this.recentEnquiriesList = [];
                this.recentEnquiriesList = data;
                this.moreEnquiries = false;
              } else if (this.recentEnquiriesList.length == 0) {
                this.recentEnquiriesList = data;
              } else if (this.recentEnquiriesList.length > 0 && !this.refresh) {
                this.recentEnquiriesList.push(...data);
                //malik
                this.toScroll('recentEnquiries-id');
              }
              this.recentEnquiries$ = of(this.recentEnquiriesList);
            });
          }
          break;

        case 'recentUnits':
          if (this.recentUnits$) {
            this.recentUnits$.subscribe((data) => {
              if (data.length == 0) {
                //malik
                this.toScroll('recentUnits-id');
                this.moreUnits = true;
              } else if (this.refresh) {
                this.recentUnitsList = [];
                this.recentUnitsList = data;
                this.moreUnits = false;
              } else if (this.recentUnitsList.length == 0) {
                this.recentUnitsList = data;

              } else if (this.recentUnitsList.length > 0 && !this.refresh) {
                this.recentUnitsList.push(...data);
                //malik
                this.toScroll('recentUnits-id');
              }
              this.recentUnits$ = of(this.recentUnitsList);

            });
          }
          break;

        case 'jobs':
          if (this.recentJobs$) {
            this.recentJobs$.subscribe((data) => {
              if (data.length == 0) {
                this.moreJobs = true;
              } else if (this.refresh) {
                this.jobList = [];
                this.jobList = data;
                this.moreJobs = false;
              } else if (this.jobList.length == 0) {
                this.jobList = data;
              } else if (this.jobList.length > 0 && !this.refresh) {
                this.jobList.push(...data);
              }
              this.recentJobs$ = of(this.jobList);
            });
          }
          break;

        case 'events':
          if (this.recentEvents$) {
            this.recentEvents$.subscribe((data) => {
              if (data.length == 0) {
                //malik
                this.toScroll('recentEvents-id');
                this.moreEvents = true;
              } else if (this.refresh) {
                this.eventsList = [];
                this.eventsList = data;
                this.moreEvents = false;
              } else if (this.eventsList.length == 0) {
                this.eventsList = data;
              } else if (this.eventsList.length > 0 && !this.refresh) {
                this.eventsList.push(...data);
                //malik
                this.toScroll('recentEvents-id');
              }
              this.recentEvents$ = of(this.eventsList);
            });
          }
          break;
      }
    }
  }
  //malik
  toScroll(id: any) {
    setTimeout(() => {
      // document.getElementById(id)?.lastElementChild?.scrollIntoView({
      /*document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth', block: 'end',inline: 'nearest',
      });*/
      let scrollableDiv =
        document.getElementById(id);
      if (scrollableDiv != undefined || scrollableDiv != null) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, 10);
  }
  formatMessage(update: any): string {
    let formattedMessage: string;
    if (update && update.Message) {
      if (update.Message.includes(this.available)) {
        formattedMessage = update.Message.replace(
          this.available,
          `<strong class="rd-text-bright-green">${this.available}</strong>`
        );
      } else if (update.Message.includes(this.underOffer)) {
        formattedMessage = update.Message.replace(
          this.underOffer,
          `<strong class="rd-text-bright-green">${this.underOffer}</strong>`
        );
      } else if (update.Message.includes(this.underNegotiation)) {
        formattedMessage = update.Message.replace(
          this.underNegotiation,
          `<strong class="rd-text-bright-green">${this.underNegotiation}</strong>`
        );
      } else if (update.Message.includes(this.let)) {
        formattedMessage = update.Message.replace(
          this.let,
          `<strong class="rd-text-bright-green">${this.let}</strong>`
        );
      } else if (update.Message.includes(this.unavailable)) {
        
        formattedMessage = update.Message?.replace(
          this.unavailable,
          `<strong class="rd-text-red">${this.unavailable}</strong>`
        );
        
      } else {
        return `${update.Message} <strong>${update.UnitName}</strong>`;
      }
      formattedMessage = `<strong>${update.UnitName}</strong> ${formattedMessage}`;
    } else {
      return `${update.Message} <strong>${update.UnitName}</strong>`;
    }
    
    return formattedMessage;
  }


  formatUnit(unit: any): string {
    let formattedMessage: string;
    if (unit && unit.Message) {
      if (unit.Message.includes(this.available)) {
        formattedMessage = unit.Message.replace(
          this.available,
          `<strong class="rd-text-bright-green">${this.available}</strong>`
        );
      } else if (unit.Message.includes(this.underOffer)) {
        formattedMessage = unit.Message.replace(
          this.underOffer,
          `<strong class="rd-text-bright-green">${this.underOffer}</strong>`
        );
      } else if (unit.Message.includes(this.underNegotiation)) {
        formattedMessage = unit.Message.replace(
          this.underNegotiation,
          `<strong class="rd-text-bright-green">${this.underNegotiation}</strong>`
        );
      } else if (unit.Message.includes(this.let)) {
        formattedMessage = unit.Message.replace(
          this.let,
          `<strong class="rd-text-bright-green">${this.let}</strong>`
        );
      } else if (unit && unit.Message?.includes(this.unavailable)) {
        formattedMessage = unit.Message?.replace(
          this.unavailable,
          `<strong class="rd-text-red">${this.unavailable}</strong>`
        );
      } else {
        return `<span class="d-block">${unit.PropertyName}</span> ${unit.Message} <strong>${unit.UnitName}</strong>`;
      }
      formattedMessage = `<span class="d-block">${unit.PropertyName}</span> <strong>${unit.UnitName}</strong> ${formattedMessage}`;
    } else {
      return `<span class="d-block">${unit.PropertyName}</span> <strong>${unit.UnitName}</strong> ${unit.Message}`;
    }
    return formattedMessage;
  }


  loadEnquiries() {
    this.viewMoreEnquiries.emit();
  }

  loadJobs() {
    this.viewMoreJobs.emit();
  }

  loadEvents() {
    this.viewMoreEvents.emit();
  }

  loadUnits() {
    this.viewMoreUnits.emit();
  }
}
