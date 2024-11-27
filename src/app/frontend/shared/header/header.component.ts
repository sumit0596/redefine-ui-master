import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SESSION } from 'src/app/models/constants';
import { HeaderMenuService } from '../../services/header-menu.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterModule, NgOptimizedImage],
})
export class HeaderComponent {
  user$!: Observable<any>;
  @Input() sidenavStatus!: boolean;
  s = '';
  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuItems!: any[];
  menuItems$!: Observable<any>;

  @ViewChild('nav') nav!: ElementRef<HTMLElement>;
  @ViewChild('search') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private headerMenuService: HeaderMenuService,
    private route: ActivatedRoute
  ) {}
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.s = params['s'];
    });
    await this.getHeaderMenu();
  }

  openNav() {
    this.nav.nativeElement.classList.toggle('openNav');
    this.nav.nativeElement.classList.remove('open-search');
  }

  closeNav() {
    this.nav.nativeElement.classList.remove('openNav');
    this.nav.nativeElement.classList.remove('open-search');
  }

  openSearch() {
    this.nav.nativeElement.classList.remove('openNav');
    this.nav.nativeElement.classList.toggle('open-search');
  }

  async getHeaderMenu() {
    let headerMenu = await this.localStorageService.getStorage(
      SESSION.FRONTEND_HEADER_MENU
    );

    if (headerMenu) {
      this.menuItems = JSON.parse(headerMenu);
    } else {
      this.menuItems$ = await this.headerMenuService.loadHeaderMenu();

      this.menuItems$.subscribe({
        next: (res) => {
          this.menuItems = res;
          this.localStorageService.setStorage(
            SESSION.FRONTEND_HEADER_MENU,
            JSON.stringify(res),
            86400
          );
        },
        error: (error) => {},
      });
    }
  }
  sideNavToggle() {
    this.sidenavStatus = !this.sidenavStatus;
    this.sideNavToggled.emit(this.sidenavStatus);
  }

  onSearch(search: any) {
    if (search != '') {
      this.router
        .navigate(['/search'], { queryParams: { s: search } })
        .then(() => {
          this.nav.nativeElement.classList.remove('open-search');
          this.searchInput.nativeElement.value = '';
        });
    }
  }
}
