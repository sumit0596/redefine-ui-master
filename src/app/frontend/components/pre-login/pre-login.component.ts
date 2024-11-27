import {
  Component,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { AdAzureService } from 'src/app/services/adazure.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-pre-login',
  standalone: true,
  templateUrl: './pre-login.component.html',
  styleUrls: ['./pre-login.component.scss'],
  imports: [],
})
export class PreLoginComponent implements AfterViewInit {
  constructor(
    private adAzureService: AdAzureService,
    @Inject(DOCUMENT) private document: Document
  ) {
    /*setTimeout(()=>{ 
    this.adAzureService.adLogin();
	},3000);*/
  }

  ngAfterViewInit() {
    setTimeout(() => {
      /*const links = this.document?.querySelector(
      '#divClick'
    ) as HTMLElement;*/
      this.adAzureService.adLogin();
      //links?.click();
    }, 3000);
  }
}
