import { Component } from '@angular/core';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@Component({
  selector: 'app-share-button',
  standalone: true,
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
  imports: [ShareButtonsModule, ShareIconsModule],
})
export class ShareButtonComponent {
  constructor() {
    this.test();
  }
  test() {
    setTimeout(() => {
      const buttons = document.querySelectorAll(
        'share-button'
      ) as NodeListOf<HTMLElement>;
      const colors = ['#0a66c2', '#4267B2', '#25D366'];

      buttons.forEach((button, index) => {
        const color = colors[index % colors.length];
        button.style.background = color;
        button.style.margin = '0px 0px 0px 3px';
        button.style.borderRadius = '5%';
      });
    }, 100);
  }
}
