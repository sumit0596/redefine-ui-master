import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { PropertyEqService } from '../../../services/property-eq.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-propertyeq-video-dialog',
  templateUrl: './propertyeq-video-dialog.component.html',
  styleUrls: ['./propertyeq-video-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, 
    SharedModule, 
    YouTubePlayerModule, 
    MatButtonModule,
    MatDialogModule, 
    MatButtonModule,
    MatIconModule]
})
export class PropertyeqVideoDialogComponent {
  @Output() closeDialog = new EventEmitter<void>();
  slug: string;
  Title!: string;
  Content!: string;
  YoutubeLinkId: any;
  YoutubeLinkNotFound: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private videoDetails: PropertyEqService,
    private toasterService: ToastrService,
    private seoService : SeoService
  ) {
    this.slug = data.slug;
    this.seoService.updatePropertyEQSeo(this.slug); 
  }

  ngOnInit() {
    this.getPressDetails(this.slug);
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(scriptTag);
  }

  getPressDetails(slug: any) {
    this.videoDetails.propertyEQPressDetails(slug, 1).subscribe({
      next: (res: any) => {
        this.Title = res.data.Title;
        this.Content = res.data.Content;
        this.getYoutubeVideoId(res.data.YoutubeLink);
      },
      error: (error: any) => {
        this.toasterService.error(error.error.message);
      },
    });
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
  onClose() {
    this.closeDialog.emit();
  }
}
