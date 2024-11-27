import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTE } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private http: HttpClient) {}

  getAllTestimonials(
    pageSize: any,
    pageNumber: any,
    yearsIds?: any,
    type?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_TESTIMONIALS}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);

    if (type != undefined) {
      queryParams = queryParams.append('Type', type);
    }

    if (yearsIds != undefined) {
      queryParams = queryParams.append('Year', yearsIds);
    }
    if (searchValue != undefined) {
      queryParams = queryParams.append('Search', searchValue);
    }
    if (sortBy != undefined) {
      queryParams = queryParams.append('SortBy', sortBy);
    }
    if (sortOrder != undefined) {
      queryParams = queryParams.append('SortOrder', sortOrder);
    }
    return this.http.get(url, { params: queryParams });
  }

  createTestimonial(payload: any) {
    let url = `${environment.apiBaseUrl}/testimonials/add`;
    let formData = new FormData();
    for (const key in payload) {
      if (payload[key] != null && payload[key] instanceof File) {
        formData.append(key, payload[key], payload[key].name);
      } else if (
        (typeof payload[key] == 'string' || typeof payload[key] == 'number') &&
        payload[key] != null
      ) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(url, formData);
  }

  updateTestimonial(payload: any, id: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.UPDATE_TESTIMONIAL}/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.put(url, payload);
  }

  getTestimonial(id: any) {
    let url: string = `${environment.apiBaseUrl}/testimonials/details/${id}`;
    return this.http.get(url);
  }

  deleteTestimonial(id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.DELETE_TESTIMONIAL}/${id}`;
    return this.http.delete(url);
  }
}
