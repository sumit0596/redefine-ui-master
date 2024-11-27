import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE, CONSTANTS } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  constructor(private http: HttpClient) {}
  getSensList(): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/frontend/sens/list`;
    return this.http.get(url, {
      headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
    });
  }
}
