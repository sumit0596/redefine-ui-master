import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.dev';
import { CommonModule } from '@angular/common';
import {
  NgxExtendedPdfViewerModule,
  NgxExtendedPdfViewerService,
  PdfLoadedEvent,
  PdfLoadingStartsEvent,
} from 'ngx-extended-pdf-viewer';
import { LoaderService } from '../../services/loader/loader.service';
import { ContextContainer } from 'src/app/core/context/context-container';

@Component({
  selector: 'app-view-file',
  standalone: true,
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss'],
  imports: [CommonModule, NgxExtendedPdfViewerModule],
})
export class ViewFileComponent implements OnInit {
  fileUrl!: SafeResourceUrl | any;
  fileName!: string;
  page = 1;
  spreadMode: 'off' | 'even' | 'odd' = 'off';
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private contextService: ContextContainer,
    private pdfViewerService: NgxExtendedPdfViewerService
  ) {}

  async ngOnInit() {
    let slug = '';
    this.fileName = this.route.snapshot.params['slug'];
    this.fileName;
    if (this.fileName != '' && this.fileName != undefined) {
      slug = this.fileName;
    }
    const current = new Date();
    let url = `${environment.AZURE_FILE_PATH}/${slug}?time=${current.getTime()}`;
    this.fileUrl = url; //this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  pdfLoadingStarts(event: PdfLoadingStartsEvent) {
    this.contextService.loaderService.show();
  }
  pdfLoaded(event: PdfLoadedEvent) {
    this.contextService.loaderService.hide();
  }
  pdfLoadingFailed(event: Error) {
    this.contextService.toasterService.error('Failed to load the document');
    this.contextService.loaderService.hide();
  }

  onPageRendered(): void {
    if (!this.pdfViewerService.isRenderQueueEmpty()) {
      // try again later when the pages requested by the pdf.js core or the user have been rendered
      setTimeout(() => this.onPageRendered(), 100);
    }

    const pagesBefore = this.spreadMode === 'off' ? 2 : 2;
    const pagesAfter = this.spreadMode === 'off' ? 2 : 5;
    let startPage = Math.max(this.page - pagesBefore, 1);
    let endPage = Math.min(
      this.page + pagesAfter,
      this.pdfViewerService.numberOfPages()
    );

    const renderedPages = this.pdfViewerService.currentlyRenderedPages();

    for (let page = startPage; page <= endPage; page++) {
      const pageIndex = page - 1;
      if (!this.pdfViewerService.hasPageBeenRendered(pageIndex)) {
        this.pdfViewerService.addPageToRenderQueue(pageIndex);
        break; // break because you can request only one page at a time
      }
    }
  }
}
