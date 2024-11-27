import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FraudAlertsComponent } from './fraud-alerts/fraud-alerts.component';

@NgModule({
  declarations: [
    FraudAlertsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShareButtonsModule.withConfig({
      debug: true,
      // facebook: faFacebook,
      // twitter: faTwitter,
    }),
    FontAwesomeModule,
    ShareButtonsModule,
    ShareIconsModule,
    NgOptimizedImage,
  ],
  exports: [],
  providers: [TitleCasePipe],
})
export class SharedModule {}
