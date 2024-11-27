import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var gtag: any;

@Injectable({
  providedIn: 'root',
})
export class TagManagerService {
  constructor(private router: Router) {}

  initialize(googleTagId: string, koiTagId: string): void {
    this.googleHeader(googleTagId);
    this.koiHeader(koiTagId);
    //we can add code here for first load
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //we can add code here for first load
      }
    });
  }
  koiHeader(koiTagId: any) {
    const script = document.createElement('script');
    script.innerHTML = ` var _ss = _ss || [];
    _ss.push(['_setDomain', 'https://koi-3RG1LTQHEC.marketingautomation.services/net']);
    _ss.push(['_setAccount', '${koiTagId}']);
    _ss.push(['_trackPageView']);
    window._pa = window._pa || {};
(function() {
    var ss = document.createElement('script');
    ss.type = 'text/javascript'; ss.async = true;
    ss.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'koi-3RG1LTQHEC.marketingautomation.services/client/ss.js?ver=2.4.0';
    var scr = document.getElementsByTagName('script')[0];
    scr.parentNode.insertBefore(ss, scr);
})();
      `;
    document.head.appendChild(script);
  }
  googleTagBody(googleTagId: any) {
    const script4 = document.createElement('noscript');
    const script5 = document.createElement('iframe');
    script5.height = '0';
    script5.width = '0';
    script5.style.cssText = 'display:none;visibility:hidden';
    script5.src = 'https://www.googletagmanager.com/ns.html?id=' + googleTagId;
    script4.appendChild(script5);
    document.body.appendChild(script4);
  }
  googleHeader(googleTagId: any) {
    const script3 = document.createElement('script');
    script3.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagId}');
      `;
    document.head.appendChild(script3);
    const script6 = document.createElement('script');
    script6.innerHTML =
      `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '` +
      googleTagId +
      `');
      `;
    document.head.appendChild(script6);
    this.googleTagBody(googleTagId);
  }
}
