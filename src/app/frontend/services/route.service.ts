import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService implements OnDestroy {
  url: string = '';
  routes: string[] = [];
  routeConfig: any = { route: undefined };
  private routerEventsSubscription!: Subscription;
  private routeSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.routeConfig
  );
  route$: Observable<any> = this.routeSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerEventsSubscription = this.router.events.subscribe(
      (event: any) => {
        if (
          event instanceof NavigationEnd ||
          event.routerEvent instanceof NavigationEnd
        ) {
          this.extractRoute();
        }
      }
    );
    this.extractRoute();
  }
  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
  setRouteConfig(route: any) {
    this.routeSubject.next(route);
  }
  extractRoute() {
    this.routes = this.router.url.replace('/', '').split('/');
    if (this.routes?.length == 1) {
      this.routes = this.routes.map((r: string) => (r.includes('?') ? r.split('?')[0] : r));
    }
    this.url = this.routes[this.routes.length - 1];
    this.setRouteConfig({ route: this.url ? `${this.url}` : null });
  }
}
