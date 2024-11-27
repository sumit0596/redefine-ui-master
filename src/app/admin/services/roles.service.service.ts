import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Role } from '../../models/roles';

@Injectable({
  providedIn: 'root',
})
export class RolesServiceService {
  constructor(private http: HttpClient) {}

  createRole(role: any) {
    let url: string = `${environment.apiBaseUrl}/role/add`;
    return this.http.post(url, role);
  }

  deleteRole(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/role/delete/${id}`;
    return this.http.delete(url);
  }

  getAllRoles(
    pageSize: any,
    pageNumber: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/role/listing`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
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

  getPermissionList(): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/permission/list`;
    return this.http.get(url);
  }

  getRoleById(id: number): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/role/details/${id}`;
    return this.http.get(url);
  }

  editRole(role: Role, roleId: any) {
    let url: string = `${environment.apiBaseUrl}/role/update/${roleId}`;
    return this.http.put(url, role);
  }
}
