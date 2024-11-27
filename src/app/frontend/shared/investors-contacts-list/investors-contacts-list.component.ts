import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/models/constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { FrontendService } from '../../services/frontend.service';

@Component({
  selector: 'app-investors-contacts-list',
  standalone: true,
  templateUrl: './investors-contacts-list.component.html',
  styleUrls: ['./investors-contacts-list.component.scss'],
  imports: [CommonModule]
})
  export class InvestorsContactsListComponent {
    quickLinks: any[] = [];
    routeUrl: string = '';
    routeId: any;
    menuId: string = '';
    splittedRoutes: any[] = [];
    // constructor(
    //   private router: Router,
    //   private route: ActivatedRoute,
    //   private commonService: CommonService
    // ) {}
  
    // ngOnInit() {
    //   // this.route.paramMap.subscribe((params: ParamMap) => {
    //   //   this.routeId = params.get(CONSTANTS.ROUTE_ID);
    //   // });
    //   console.log("this.route.snapshot.params[CONSTANTS.ROUTE_ID]:::", this.route.snapshot.params[CONSTANTS.ROUTE_ID])
    //   this.routeId = this.route.snapshot.params[CONSTANTS.ROUTE_ID] ||
    //     this.route.firstChild?.snapshot.params[CONSTANTS.ROUTE_ID];
    //   this.routeUrl = this.router.url
    //     ?.replace('/', '')
    //     .replace(`/${this.routeId}`, '')
    //     .replace('/investor-information', '').split('?')[0];
    //   this.splittedRoutes = this.routeUrl.split('/');
    //   if (this.routeId) {
    //     this.menuId = this.splittedRoutes[this.splittedRoutes.length - 1];
    //   } else {
    //     this.menuId = this.splittedRoutes?.length
    //       ? this.splittedRoutes[this.splittedRoutes.length - 1]
    //       : this.routeUrl;
    //   }
    //   if (this.menuId) {
    //     this.commonService.getQuickLinks(this.menuId).subscribe((res: any[]) => {
    //       this.quickLinks = res.map((route: any) => {
    //         if (
    //           this.splittedRoutes?.length &&
    //           res.some((link: any) => link.Route === this.menuId)
    //         ) {
    //           return {
    //             ...route,
    //             Route: `/${this.routeUrl.replace(
    //               `/${this.splittedRoutes[this.splittedRoutes.length - 1]}`,
    //               ''
    //             )}/${route.Route}`,
    //           };
    //         } else {
    //           return {
    //             ...route,
    //             Route: `${this.routeUrl}/${route.Route}`,
    //           };
    //         }
    //       });
    //     });
    //   }
    // }
    goToPage(menu: any) {
      if(menu.Route?.includes('https')){
       //window.open(menu.Route.replace('/investors/','').replace('investors/',''), "_blank"); 
       let res = menu.Route.match(/https?:\/\/[^\s]+/)[0]; 
       window.open(res, "_blank"); 
      } else {
      // this.router.navigate([menu.Route]);
      }
    }
    
    teamMembers: any[] = [];

    constructor(private frontendService: FrontendService) {}
  
    ngOnInit(): void {
      this.frontendService.getTeamMembers().subscribe({
        next: (data) => {
          this.teamMembers = data;
          console.log("teammembers:", data)
        },
        error: (error) => {
          console.error('Error fetching team members', error);
        },
        complete: () => {
          console.log('Fetch team members completed');
        }
      });
    }
}
