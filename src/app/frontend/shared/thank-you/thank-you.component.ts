import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
  imports: [],
})
export class ThankYouComponent implements OnInit {
  data: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.data = history.state;
  }

  navigateTo() {
    this.router.navigate([this.data.prevRoute]);
  }
}
