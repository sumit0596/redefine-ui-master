import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CustomPageService } from '../../services/custom-page.service';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-page-container',
  templateUrl: './custom-page-container.component.html',
  styleUrls: ['./custom-page-container.component.scss'],
})
export class CustomPageContainerComponent implements OnInit {
  pageRoute!: string;
  pageDetails: any;
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  destroySubject: Subject<void> = new Subject<void>();

  constructor(
    private customPageService: CustomPageService,
    private router: Router,
    private routeService: RouteService
  ) {}
  ngOnInit(): void {
    this.routeService.route$
      .pipe(
        distinctUntilChanged(
          (prev: any, curr: any) => curr.route === prev.route
        ),
        takeUntil(this.destroySubject)
      )
      .subscribe((res: any) => {
        if (res) {
          this.container?.clear();
          this.pageDetails = undefined;
          this.pageRoute = res.route ? res.route : 'home';
          this.customPageService.getPageDetails(this.pageRoute).subscribe({
            next: (res: any) => {
              this.pageDetails = res.data;
              this.createPage();
            },
            error: (error: any) => {
              this.router.navigate(['/not-found'], {
                skipLocationChange: true,
                replaceUrl: true,
              });
            },
          });
        }
      });
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
  createPage() {
    if (this.container) {
      this.container.clear();
      const containerComponentRef = this.container.createComponent(
        PageContainerComponent
      );
      containerComponentRef.setInput('page', this.pageDetails);
    }
  }
}
