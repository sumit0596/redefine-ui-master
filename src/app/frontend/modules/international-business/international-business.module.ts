import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { InternationalBusinessRoutingModule } from './international-business-routing.module';
import { InternationalBusinessComponent } from '../international-business/international-business.component';
import { PropertiesPortfolioComponent } from './properties-portfolio/properties-portfolio.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InternationalPropertyDetailsComponent } from './international-property-details/international-property-details.component';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { GridModule } from 'src/app/shared/modules/grid/grid.module';
import { FeaturedPropertiesCarouselComponent } from '../../shared/featured-properties-carousel/featured-properties-carousel.component';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MapModule } from 'src/app/shared/modules/map/map.module';

@NgModule({
  declarations: [
    InternationalBusinessComponent,
    PropertiesPortfolioComponent,
    InternationalPropertyDetailsComponent,
  ],
  imports: [
    CommonModule,
    InternationalBusinessRoutingModule,
    SharedModule,
    FileModule,
    GridModule,
    FeaturedPropertiesCarouselComponent,
    BreadcrumbsComponent,
    MatTabsModule,
    MapModule,
  ],
  providers:[DecimalPipe]
})
export class InternationalBusinessModule {}
