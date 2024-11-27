import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreadcrumbsComponent } from 'src/app/frontend/shared/breadcrumbs/breadcrumbs.component';
import { BannerBreadcrumbComponent } from 'src/app/frontend/shared/banner-breadcrumb/banner-breadcrumb.component';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuickLinksComponent } from 'src/app/frontend/shared/quick-links/quick-links.component';
import { ShareButtonComponent } from 'src/app/frontend/shared/share-button/share-button.component';
import { CONSTANTS } from 'src/app/models/constants';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from 'src/app/frontend/services/career.service';
import { PropertyEqService } from 'src/app/frontend/services/property-eq.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { HeaderBannerBreadcrumbComponent } from 'src/app/frontend/shared/header-banner-breadcrumb/header-banner-breadcrumb.component';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { MatDialog } from '@angular/material/dialog';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SharedModule } from "../../../../shared/shared.module";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-propertyeq-video-details',
    templateUrl: './propertyeq-video-details.component.html',
    styleUrls: ['./propertyeq-video-details.component.scss'],
    standalone: true,
    imports: [
    BreadcrumbsComponent,
    HeaderBannerBreadcrumbComponent,
    BannerBreadcrumbComponent,
    CommonModule,
    QuickLinksComponent,
    ShareButtonComponent,
    RouterModule,
    MatTooltipModule,
    YouTubePlayerModule,
    SharedModule
]
})

export class PropertyeqVideoDetailsComponent implements OnInit {
  filter:any;
  bannerDetails: any;
  bannerText = 'Videos';
  breadcrumbLinks: any;
  videoId: string = '';
  bannerFullText: string = '';
  videoDetails: any;
  urlData: any;
  recentVideoDetails: any;
  showShareIcon: boolean = false;
  slug: any;
  imagePlaceholder: string = 'assets/images/property-default-image.jpg';
  imagePlaceholderImage: string = 'assets/images/image-placeholder.png';
  styleString: string = '';
  bannerCss: string = '';
  videoCss: string = '';
  buttonCss: string = '';
  layoutCss: string = '';
  typographyCss: string = '';
  bannerimage: string = '';
  loadingData: boolean = true;
  YoutubeLinkId: any;
  YoutubeLinkNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: PropertyEqService,
    private toasterService: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private encryptionService: EncryptionService,
    private careerService: CareerService,
    private sanitizer: DomSanitizer
  ) {
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(scriptTag);
      this.slug = params.get(CONSTANTS.ROUTE_ID);
      this.getVideoDetails(this.slug);
      this.getRecentVideo();
      this.getBanner();
    });
  }

  getBanner() {
    this.careerService
    .getBanner('PEQ_VIDEO_PAGE_BANNER')
    .subscribe((res: any) => (this.bannerDetails = res.data.Value));
}


  getYoutubeVideoId(link: string): void {
    if (link && link.includes('https://www.youtube.com/')) {
      const videoId = link.split('v=')[1]?.split('&')[0];
      this.YoutubeLinkId = videoId
        ? videoId
        : (this.YoutubeLinkNotFound = true);
    } else {
      this.YoutubeLinkNotFound = true;
    }
  }

  getVideoDetails(slug: any) {
    this.videoService.getVideoDetails(slug).subscribe({
      next: (res: any) => {
        this.urlData = {
          url: res.data.Slug,
          replacedUrl: res.data.Title,
        };
        // this.bannerDetails = res.data.MediaUrl;
        const el = document.createElement('div'); 
        el.innerHTML = res.data.Content; 
        const allImg = el.querySelectorAll('img'); 
        const alla = el.querySelectorAll('a'); 
        allImg.forEach(img => { 
          img.setAttribute('alt','press') 
        });
        alla.forEach(a => { 
        if(a.attributes.length==0){ 
              const spanElement = document.createElement('span'); 
              spanElement.innerHTML = a.innerHTML; 
              a.parentNode?.replaceChild(spanElement, a); 
        } 
        }); 
        res.data.Content = el.outerHTML; 
        this.bannerText = res.data.Title;
        this.videoDetails = res.data;
        this.getYoutubeVideoId(res.data.YoutubeLink);
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
    
  }

  getRecentVideo() {
    this.videoService.propertyEQgetRecentarticle(this.slug, 1).subscribe({
      next: (res) => {
        this.videoData(res);
      },
      error: (error) => {
        this.toasterService.error(error.error.message);
      },
      complete: () => {},
    });
  }

  videoData(res: any) {
    if (res) {
      this.loadingData = false;
      res.data.forEach((element: any) => {
        element.show = true;
      });
      this.recentVideoDetails = res.data;
    }
  }

  getHovercolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#fa0a0a';
    ele.style.marginLeft = '10px';
    ele.style.transition = '0.5s';
  }
  getLeavecolor(index: any) {
    let ele = document.getElementById('sens-data' + index) as HTMLElement;
    ele.style.color = '#000000';
    ele.style.marginLeft = '0px';
  }

  videoDetailsPage(video: any) {
    let formConfig = {
      id: video.Slug,
    };
    this.recentVideoDetails.forEach((x: any) => {
      if (x == video) {
        x.show = false;
      } else {
        x.show = true;
      }
    });
    this.router.navigate(['/propertyeq/videos/' + video.Slug]);
    this.getVideoDetails(video.Slug);
  }

  mediaQuery() {
    let data: any = {};
    data['pageName'] = 'aticles-details';
    /*this.router.navigate(['/press-office/media-enquiries'], {
      // relativeTo: this.route,
      state: { data },
    });*/
  }
  
  onFilterTags(tagid: any, str:any) {
    this.filter = {...this.filter,
      Type: 2,
      PropertyEqCategoryId: str == 'EqCategoryId' ? tagid : null,
      Author: str == 'Author' ? tagid : null,
      PropertyEqTagId: str == 'PropertyEqTag' ? tagid : null,
    }
    const encryptedTagId = this.encryptionService.encrypt(this.filter);
    this.router.navigate(['/propertyeq'], { queryParams: { f: encryptedTagId } });
  }
}