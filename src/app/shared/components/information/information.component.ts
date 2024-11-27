import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONSTANTS } from 'src/app/models/constants';

@Component({
  selector: 'app-information',
  standalone: true,
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  imports: [CommonModule],
})
export class InformationComponent {
  errorCode: any;
  constructor(private route: ActivatedRoute) {
    this.errorCode = this.route.snapshot.paramMap.get(CONSTANTS.ROUTE_ID);
  }
}
