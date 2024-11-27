import { Injectable } from '@angular/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MytoasterService extends ToastrService{

  toast! : ActiveToast<any>;

  override error<ConfigPayload = any>(message?: string, title?: string, override?: Partial<IndividualConfig<ConfigPayload>>): ActiveToast<any> {
    if(message!=''){
      super.error(message);
    }
    return this.toast;
  }

}
 

