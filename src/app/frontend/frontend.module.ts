import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontendRoutingModule } from './frontend-routing.module';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TickerComponent } from './shared/ticker/ticker.component';
import { FrontendComponent } from './frontend.component';
import { BreadcrumbsComponent } from "./shared/breadcrumbs/breadcrumbs.component";
import { PropertyeqSearchComponent } from './components/propertyeq-frontend/propertyeq-search/propertyeq-search.component';


@NgModule({
    declarations: [FrontendComponent, PropertyeqSearchComponent,],
    imports: [
        CommonModule,
        FrontendRoutingModule,
        TickerComponent,
        HeaderComponent,
        FooterComponent,
        BreadcrumbsComponent,
    ]
})
export class FrontendModule {}
