import { Component, ElementRef, Renderer2, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
  standalone : true
})
export class IframeComponent {

  private sanitizer = inject(DomSanitizer)
  trustedUrl : any = "";
  
  constructor(){
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://my.3dtours.co.za/tour/lakeview-office-park-virtual-tour");
  }

  

}
