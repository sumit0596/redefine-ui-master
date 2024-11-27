import { AdminService } from './../../services/admin.service';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { SESSION } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnDestroy {
  menuId: number = 0;
  menuItems!: any[];
  menuItems$!: Observable<any>;
  @Input() sideNavStatus!: boolean;
  @Output() sidenavEvent = new EventEmitter<boolean>();

  constructor(
    private adminService: AdminService,
    private loaderService: LoaderService
  ) {}

  async ngOnInit() {
    this.menuId = JSON.parse(localStorage.getItem(SESSION.MENU_ID) || '0');
    await this.getLeftMenu();
  }
  ngOnDestroy(): void {}
  async getLeftMenu() {
    this.loaderService.show();
    let menu = sessionStorage.getItem(SESSION.USER_MENU);
    if (menu) {
      this.menuItems$ = of(JSON.parse(menu));
    } else {
      this.menuItems$ = await this.adminService.loadMenu();
    }
    this.menuItems$.subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.menuItems = res;
        sessionStorage.setItem(SESSION.USER_MENU, JSON.stringify(res));
      },
      error: (error) => {
        this.loaderService.hide();
      },
    });
  }
  toggleSidenav(id: number) {
    this.menuId = id;
    localStorage.setItem(SESSION.MENU_ID, JSON.stringify(this.menuId));
  }
}
