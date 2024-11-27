import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertyLandingComponent } from './components/property-landing/property-landing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileModule } from 'src/app/shared/modules/file/file.module';
import { GridModule } from 'src/app/shared/modules/grid/grid.module';
import { FeaturedPropertiesCarouselComponent } from '../../shared/featured-properties-carousel/featured-properties-carousel.component';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [PropertyLandingComponent, PropertiesComponent],
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    SharedModule,
    FileModule,
    GridModule,
    FeaturedPropertiesCarouselComponent,
    BreadcrumbsComponent,
  ],
  providers:[DecimalPipe]
})
export class PropertiesModule {}
