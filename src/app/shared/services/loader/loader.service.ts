import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ILoader, Loader_Type } from 'src/app/interfaces/loader';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loaderObj: ILoader = { isActive: false, data: '', type: 'API' };
  private loaderSubject = new BehaviorSubject<ILoader>(this.loaderObj);
  private loader$ = this.loaderSubject.asObservable();

  constructor() {}
  showLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {
    this.show();
    return obs$.pipe(finalize(() => this.hide()));
  }
  show(data?: any, type: Loader_Type = 'API') {
    this.loaderSubject.next({
      ...this.loaderObj,
      isActive: true,
      type: type,
      data: data,
    });
  }

  hide() {
    this.loaderSubject.next({ ...this.loaderObj, isActive: false });
  }
  getLoaderData() {
    return this.loader$;
  }
}
