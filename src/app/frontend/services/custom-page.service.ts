import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class CustomPageService {
  constructor(private httpCLient: HttpClient) {}

  getPageDetails(slug: any) {
    return this.httpCLient.get(
      `${environment.apiBaseUrl}${API_ROUTE.GET_FRONTEND_MENU_DETAILS}/${slug}`,
      {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      }
    );
  }
}
