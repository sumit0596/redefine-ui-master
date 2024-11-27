import { Component, EventEmitter, Input, Output, ViewContainerRef , ViewChild, ComponentFactoryResolver } from '@angular/core';
import { SharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { STATUS } from 'src/app/models/enum';
import { IPageDetails } from '../../model/interfaces';
import { PageBuilderService } from '../../services/page-builder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { HeaderComponent } from 'src/app/frontend/shared/header/header.component';
import { TickerComponent } from 'src/app/frontend/shared/ticker/ticker.component';
import { FooterComponent } from 'src/app/frontend/shared/footer/footer.component';
import { PageContainerComponent } from 'src/app/frontend/modules/custom-page-container/components/page-container/page-container.component';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-page-preview',
    templateUrl: './page-preview.component.html',
    styleUrls: ['./page-preview.component.scss'],
    standalone: true,
    imports: [CommonModule, SharedModule ,MatMenuModule,HeaderComponent,TickerComponent,FooterComponent],
    providers: [SafeHtmlPipe],

})
export class PagePreviewComponent {

    @Input() previewData : any;
    status = STATUS;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('page', { read: ViewContainerRef })
    page!: ViewContainerRef;
    pageConfig : any;
  
    constructor(
      private pageBuilderService  : PageBuilderService,
      private commonStoreService  : CommonStoreService,
      private toasterService      : ToastrService,
      public viewContainerRef     : ViewContainerRef,
    ) {}

    ngAfterViewInit() {
      this.page.clear();
      const containerComponentRef = this.page.createComponent(
        PageContainerComponent
      );
      containerComponentRef.instance.page = this.previewData;
      containerComponentRef.instance.isReplace = false;

      this.getConfig()
    }

    async getConfig() {
      this.pageConfig = await this.commonStoreService.getFormConfig();
    }
    onSave(status: STATUS) {
      let pageDetails: IPageDetails = {
        Title    : this.previewData.pageDetails.Title,
        Portal   : this.previewData.pageDetails.Portal,
        Route    : this.previewData.pageDetails.Route,
        ParentId : this.previewData.pageDetails.ParentId,
        Html     : this.previewData.details.Html,
        Css      : this.previewData.details.Css,
        Status   : this.previewData.pageDetails.Status ? this.previewData.pageDetails.Status : status,
      };
      
      if (this.previewData.pageConfig.id || this.pageConfig.id) {
        if(this.previewData.pageConfig.id){
          this.pageConfig.id = this.previewData.pageConfig.id;
        }
        this.pageBuilderService
          .updatePage(pageDetails, this.pageConfig.id)
          .subscribe({
            next: (res: any) => {
              this.toasterService.success(res.message);
            },
            error: (error: HttpErrorResponse) => {
              error.error.errors
                ? this.displayError(error.error.errors)
                : this.toasterService.error(error.error.message);
            },
          });
      } else {
        this.pageBuilderService.addPage(pageDetails).subscribe({
          next: (res: any) => {
            this.previewData.pageConfig = {
              ...this.previewData.pageConfig,
              id: res.data.MenuId,
            };
            this.commonStoreService.setFormConfig(this.previewData.pageConfig);
            this.toasterService.success(res.message);
          },
          error: (error: HttpErrorResponse) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
      }
      this.submitEvent.emit()
    }

    displayError(error: any) {
      let errors = JSON.parse(error);
      Object.keys(errors).forEach((err: any) => {
        this.toasterService.error(errors[err][0]);
      });
    }
}


