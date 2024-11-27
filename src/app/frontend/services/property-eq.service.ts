import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class PropertyEqService {

  constructor(private http: HttpClient) {}

  getPropertyEqFrontendList(filters: any = {}): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}${API_ROUTE.GET_PROPERTYEQ_LIST}`)
      .pipe(map((res: any) => res.data));
  }
  getPropertyEqFrontendSearchList(filters: any = {}): Observable<any> {
    const url = `${environment.apiBaseUrl}${API_ROUTE.GET_PROPERTYEQ_LIST}`;
    let params = new HttpParams();
    Object.keys(filters).forEach((key: string) => {
      if (filters[key] !== undefined && filters[key] != null) {
        params = params.append(key, filters[key]);
      }
    });

    return this.http.get(url, { params: params });
  }
  getAllPropertyEQPressRelease(payload: any, type: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_PRESS_RELEASE}`;
    let params = new HttpParams();
    params = params.append('TypeId', type);
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  propertyEQPressDetails(id: any,type:number): Observable<any> {
    let params = new HttpParams();
    params = params.append('Type', type);
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_PRESS_RELEASE_DETAILS
    }/${id}`;
    return this.http.get(url, { params: params });
  }

  propertyEQgetRecentPress(slug: any,type:number): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_RELATED}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Slug', slug);
    queryParams = queryParams.append('Type', type);
    return this.http.get(url, { params: queryParams });
  }

  propertyEQgetRecentarticle(slug: any,type:number): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_EQ_RELATED}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Slug', slug);
    queryParams = queryParams.append('Type', type);
    return this.http.get(url, { params: queryParams });
  }

  
  getPropertyEqVideos(){
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTYEQ_VIDEOSLIST}`;
    let queryParams = new HttpParams();
    let type = 1
    queryParams = queryParams.append('TypeId', type);
    return this.http.get(url, {params:queryParams}).pipe(map((res: any) => res.data));
  }

  getAllFrontendPropertyEq(filter: any): Observable<any> {
    const typeId = 1;
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTYEQ_VIDEOSLIST
    }`;
    let queryParams = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] !== undefined && filter[key] != null) {
        queryParams = queryParams.append(key, filter[key]);
      }
    });
    queryParams = queryParams.append('TypeId', typeId);
    return this.http
      .get(url, { params: queryParams })
      .pipe(map((res: any) => res.data));
  }

  getArticles(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ARTICLE_LIST}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key]) {
        params = params.append(key, filter[key]);
      }
    });

    return this.http
      .get(url, {
        params: params,
      })
      .pipe(map((res: any) => res.data));
  }

  getArticlesDetails(articleId: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ARTICLE_DETAILS}/${articleId}`;
    let params = new HttpParams();
    params = params.append("Type", 2);
    
    return this.http
      .get(url, {
        params: params,
      });
  }

  getVideoDetails(videoId: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ARTICLE_DETAILS}/${videoId}`;
    let params = new HttpParams();
    params = params.append("Type", 1);
    
    return this.http
      .get(url, {
        params: params,
      });
  }

  getCategoryDropdown():Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_CATEGORY_DROPDOWN}`;
    let params = new HttpParams();
    return this.http
    .get(url, {
      params: params,
    })
    .pipe(map((res: any) => res.data));
    }
    getAuthorDropdown():Observable<any> {
      let url = `${environment.apiBaseUrl + API_ROUTE.GET_AUTHOR_DROPDOWN}`;
      let params = new HttpParams();
      return this.http
      .get(url, {
        params: params,
      })
      .pipe(map((res: any) => res.data));
      }
      getTagDropdown():Observable<any> {
        let url = `${environment.apiBaseUrl + API_ROUTE.GET_TAG_DROPDOWN}`;
        let params = new HttpParams();
        return this.http
        .get(url, {
          params: params,
        })
        .pipe(map((res: any) => res.data));
        }
  
}
