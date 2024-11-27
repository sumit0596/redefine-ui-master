import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { MsalService } from '@azure/msal-angular';
import { Router, NavigationEnd, } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  sideNavStatus: boolean = false;

  constructor(
    private themeService: ThemeService,
    private authService: MsalService,
    private renderer: Renderer2,
    private router: Router,
  ) {
    themeService.setAdminTheme();
  }

  ngOnDestroy(): void {
    // this.authService.logoutRedirect({
    //   postLogoutRedirectUri: 'login',
    //   logoutHint: 'User logged out',
    // });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            const collection = document.getElementsByClassName("rd-fixed");
            if (collection.length > 0) {
              collection[0].scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 500);
        }
      })
  }

  onScroll(e: any) {
    const scrollPosition = e.target.scrollTop;
    const headers = document.querySelectorAll('#stickyHeader');

    headers.forEach(header => {
      if (scrollPosition > 188) {
        this.renderer.addClass(header, 'scroll-fixed');
      } else {
        this.renderer.removeClass(header, 'scroll-fixed');
      }
    });
  }
}
