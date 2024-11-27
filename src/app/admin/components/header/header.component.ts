import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'onClickOutSide($event)',
  },
})
export class HeaderComponent implements OnInit {
  user$!: Observable<any>;
  @Input() sidenavStatus!: boolean;
  @Output() sideNavToggled = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userStore: UserStoreService,
    private _eref: ElementRef,
    private renderer: Renderer2,
  ) { }
  async ngOnInit() {
    this.user$ = await this.userStore.getUser();
    // this.user$ = await this.loginService.getUser();
  }
  sideNavToggle() {
    this.sidenavStatus = !this.sidenavStatus;
    this.sideNavToggled.emit(this.sidenavStatus);
    this.stickyHeaderPosition(this.sidenavStatus);
  }
  async logout() {
    await this.loginService.logout();
    this.router.navigate(['login']);
  }
  profile() {
    this.router.navigate(['admin/profile']);
  }
  onClickOutSide(event: any) {
    if (!event.target.classList.contains('menu-icon')) {
      this.sideNavToggled.emit(false);
      this.stickyHeaderPosition(false);
    }
  }
  
  stickyHeaderPosition(st: boolean) {
    const headers = document.querySelectorAll('.scroll-fixed');
    headers.forEach(header => {
      if (st) {
        this.renderer.addClass(header, 'sideBaropenHeader');
      } else {
        this.renderer.removeClass(header, 'sideBaropenHeader');
      }
    });
  }
}
