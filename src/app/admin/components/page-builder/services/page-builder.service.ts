import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';
import {
  IMenu,
  IPage,
  IPageDetails,
  IPageTableFilter,
} from '../model/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PageBuilderService {
  page: IPageDetails = {
    Title: 'Title of Page',
    Route: '',
    Html: '',
    Css: '',
    Icon: '',
    ParentId: 0,
    Portal: 0,
    Status: 0,
  };

  pageSubject: BehaviorSubject<IPageDetails> =
    new BehaviorSubject<IPageDetails>(this.page);
  page$: Observable<IPageDetails> = this.pageSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getPage(): Observable<IPageDetails> {
    return this.page$;
  }
  setPage(page: IPageDetails) {
    this.pageSubject.next(page);
  }
  getMenuList(portalId: number): Observable<IMenu[]> {
    let url = `${environment.apiBaseUrl}/${API_ROUTE.GET_ALL_MENU_LIST}`;
    let params = new HttpParams();
    params = params.append('Portal', portalId);
    return this.httpClient
      .get<IMenu[]>(url, { params: params })
      .pipe(map((res: any) => res.data));
  }
  getPageList(filter: IPageTableFilter): Observable<IPage[]> {
    let url = `${environment.apiBaseUrl}/${API_ROUTE.GET_PAGES_LIST}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      const element = filter[key as keyof typeof filter];
      if (element) {
        params = params.append(key, element);
      }
    });
    return this.httpClient
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }
  getPageDetails(pageId: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/${API_ROUTE.GET_MENU_DETAILS}/${pageId}`;
    return this.httpClient.get(url);
  }
  addPage(pageDetails: any) {
    let url = `${environment.apiBaseUrl}/${API_ROUTE.ADD_MENU}`;
    return this.httpClient.post(url, pageDetails);
  }
  updatePage(pageDetails: any, pageId: number) {
    let url = `${environment.apiBaseUrl}/${API_ROUTE.UPDATE_MENU}/${pageId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put(url, pageDetails, { headers: headers });
  }
  uploadMedia(file: any, type: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    formData.append(CONSTANTS.FILE, file, file.name);
    formData.append('Type', JSON.stringify(type));
    return this.httpClient
      .post(url, formData)
      .pipe(map((res: any) => res.data));
  }
  deleteMedia(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_MEDIA
    }/${id}`;
    return this.httpClient.delete(url);
  }
  duplicatePage(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DUPLICATE_PAGE}`;
    let formData = new FormData();
    formData.append('MenuId', JSON.stringify(id));
    return this.httpClient.post(url, formData);
  }
  deletePage(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DELETE_PAGE}/${id}`;
    let formData = new FormData();
    return this.httpClient.delete(url);
  }
  getIcons() {
    return this.httpClient.get('/assets/json/icons.json');
  }

}
