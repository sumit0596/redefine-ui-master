import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import { GridModule } from 'src/app/shared/modules/grid/grid.module';
import { FeaturedPropertiesCarouselComponent } from '../../shared/featured-properties-carousel/featured-properties-carousel.component';

@Component({
  selector: 'app-needspace',
  standalone: true,
  templateUrl: './needspace.component.html',
  styleUrls: ['./needspace.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    GridModule,
    FeaturedPropertiesCarouselComponent,
  ],
  providers: [DecimalPipe],
})
export class NeedspaceComponent implements OnInit {
  propertyUnits: any;
  propertyType = 'need-space';

  constructor() {}

  ngOnInit(): void {}
}
