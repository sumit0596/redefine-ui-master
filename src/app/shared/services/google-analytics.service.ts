import { Injectable } from '@angular/core';

declare var gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor() {}

  trackEvent(eventAction: string, eventCategory: string, eventLabel: string) {
    if (typeof gtag === 'function') {
      gtag('event', eventAction, {
        event_category: eventCategory,
        event_label: eventLabel,
      });
    }
  }
}
