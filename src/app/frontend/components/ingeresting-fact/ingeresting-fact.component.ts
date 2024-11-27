import {
  OnInit,
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FrontendService } from '../../services/frontend.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-ingeresting-fact',
  standalone: true,
  templateUrl: './ingeresting-fact.component.html',
  styleUrls: ['./ingeresting-fact.component.scss'],
  imports: [CommonModule, DatePipe],
})
export class IngerestingFactComponent implements AfterViewInit, OnInit {
  graphList: any[] = [];
  public updatedDate: Date = new Date();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private frontendService: FrontendService
  ) {
    this.updatedDate = new Date();
  }

  ngOnInit(): void {
    this.getHomeGraphData();
  }
  getHomeGraphData(): void {
    this.frontendService.getHomeGraphData().subscribe({
      next: (result: any) => {
        // Get the latest 4 entries
        this.graphList = result;
      },
      error: (error: any) => {},
    });
  }
  getUpdatedDate(): Date {
    return this.updatedDate;
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}
}
