import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss'],
})
export class FrontendComponent {
  showScrollButton = false;

  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    themeService.setUserTheme();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show the button when scrolled down by 30% of the viewport height
    this.showScrollButton = window.scrollY > window.innerHeight * 0.5;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
