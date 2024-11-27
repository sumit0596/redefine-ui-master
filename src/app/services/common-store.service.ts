import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SESSION } from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class CommonStoreService {
  formConfig: any = {
    id: undefined,
    mode: '',
    label: '',
    data: '',
    access: undefined,
  };

  formConfigSubject = new BehaviorSubject<any>(undefined);
  formConfig$: Observable<any> = this.formConfigSubject.asObservable();

  constructor() {}

  async getFormConfig(): Promise<Observable<any>> {
    if (this.formConfigSubject.value) {
      return this.formConfigSubject.value;
    } else {
      this.formConfig = JSON.parse(
        sessionStorage.getItem(SESSION.FORM_CONFIG) ||
          JSON.stringify(this.formConfig)
      );
      this.formConfigSubject.next(this.formConfig);
    }
    return this.formConfigSubject.value;
  }

  async setFormConfig(formConfig: any) {
    sessionStorage.setItem(SESSION.FORM_CONFIG, JSON.stringify(formConfig));
    this.formConfigSubject.next(formConfig);
  }
}
