import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';

@Injectable({
  providedIn: 'root',
})

//Singleton class for holding elements/services across the application
export class ContextContainer {
  loaderService: LoaderService;
  toasterService: ToastrService;
  commonStoreService: CommonStoreService;
  commonService: CommonService;

  constructor(
    loaderService: LoaderService,
    toasterService: ToastrService,
    commonStoreService: CommonStoreService,
    commonService: CommonService
  ) {
    this.loaderService = loaderService;
    this.toasterService = toasterService;
    this.commonStoreService = commonStoreService;
    this.commonService = commonService;
  }
}
