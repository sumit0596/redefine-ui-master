import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { stripHtml } from 'string-strip-html';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  public transform(
    content: any,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(content);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(content);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(content);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(content);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(content);
      case 'clean':
        return stripHtml(content ? content : '').result;
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
