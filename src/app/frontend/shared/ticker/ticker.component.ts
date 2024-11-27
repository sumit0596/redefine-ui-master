import { Component, OnDestroy } from '@angular/core';
import { HeaderMenuService } from '../../services/header-menu.service';
import { IMarket } from 'src/app/interfaces/market-data';
import { Subject, interval, takeUntil } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticker',
  standalone: true,
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
  imports: [CommonModule],
  animations: [
    trigger('valueChange', [
      transition('false => true', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition('true => false', [
        animate('500ms 3000ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class TickerComponent implements OnDestroy {
  currentIndex = 0;
  marketData!: IMarket[];
  shareData: IMarket | undefined;
  toggle: boolean = true;
  updatedOn!: string;
  destroy$: Subject<void> = new Subject<void>();
  constructor(private headerMenuService: HeaderMenuService) {}

  ngOnInit() {
    this.getMarketData();
    interval(120000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getMarketData();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMarketData() {
    this.headerMenuService
      .getMarketData()
      .pipe((res: any) => {
        this.updatedOn = new Date().toISOString();
        return res;
      })
      .subscribe({
        next: (res: any) => {
          this.marketData = res;
          localStorage.setItem('market-data', JSON.stringify(this.marketData));
        },
        error: (err: any) => {
          this.marketData = JSON.parse(
            localStorage.getItem('market-data') ?? '[]'
          );
        },
      });
  }
  next(event: any) {
    this.toggle = !this.toggle;
    if (event.fromState) {
      this.currentIndex = (this.currentIndex + 1) % this.marketData.length;
      this.shareData = this.marketData[this.currentIndex];
    }
  }
}
