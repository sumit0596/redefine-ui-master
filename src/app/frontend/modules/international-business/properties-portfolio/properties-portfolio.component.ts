import { Component } from '@angular/core';

@Component({
  selector: 'app-properties-portfolio',
  templateUrl: './properties-portfolio.component.html',
  styleUrls: ['./properties-portfolio.component.scss'],
})
export class PropertiesPortfolioComponent {
  propertyType = 2;

  constructor() {}

  ngOnInit(): void {}

  RedefineEurope() {
    window.open('https://www.redefineeurope.nl/', '_blank');
  }
}
