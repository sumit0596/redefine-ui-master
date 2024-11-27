import { Injectable } from '@angular/core';
import { DomSanitizer, Meta } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root',
})
export class CanonicalService {
  constructor(private sanitizer: DomSanitizer) {}

  setCanonicalURL(url: any) {
    let link: HTMLLinkElement | null = document.querySelector(
      'link[rel="canonical"]'
    );
    url = url?.replace("/need-space/", "/properties/");
    if (link) {
      link.href = url;
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
    }
    document.head.appendChild(link);
  }
}
