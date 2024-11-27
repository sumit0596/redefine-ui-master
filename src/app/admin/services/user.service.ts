import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { MEDIA_TYPE } from 'src/app/models/enum';
import { userRole } from 'src/app/models/userRegistration';
import { environment } from 'src/environments/environment.dev';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  rolesSubject = new BehaviorSubject<any[]>([]);
  roles$ = this.rolesSubject.asObservable();

  propertiesSubject = new BehaviorSubject<any[]>([]);
  properties$ = this.propertiesSubject.asObservable();

  provincesSubject = new BehaviorSubject<any[]>([]);
  province$ = this.provincesSubject.asObservable();

  sectorsSubject = new BehaviorSubject<any[]>([]);
  sector$ = this.sectorsSubject.asObservable();

  areasSubject = new BehaviorSubject<any[]>([]);
  areas$ = this.areasSubject.asObservable();

  personalInterestsSubject = new BehaviorSubject<any[]>([]);
  personalInterest$ = this.personalInterestsSubject.asObservable();

  subscriptionPreferencesSubject = new BehaviorSubject<any[]>([]);
  subscriptionPreferences$ = this.subscriptionPreferencesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  async getRoles(): Promise<Observable<any>> {
    await this.loadRoles();
    return this.roles$;
  }
  async getProvinces(used?: number): Promise<Observable<any>> {
    await this.loadProvinces(used);
    return this.province$;
  }
  async getSectors(type: number): Promise<Observable<any>> {
    await this.loadSectors(type);
    return this.sector$;
  }
  async getSectorsCampaignDropdown(campaign: string): Promise<Observable<any>> {
    await this.loadCampaignSectors(campaign);
    return this.sector$;
  }
  async getAreas(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.AREAS)) {
      this.areasSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.AREAS) || '[]')
      );
    } else {
      await this.loadAreas();
    }
    return this.areas$;
  }
  async getPersonalInterests(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.PERSONAL_INTERESTS)) {
      this.personalInterestsSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.PERSONAL_INTERESTS) || '[]')
      );
    } else {
      await this.loadPersonalInterests();
    }
    return this.personalInterest$;
  }
  async getSubscriptionPreferences(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.SUBSCRIPTION_PREFERENCES)) {
      this.subscriptionPreferencesSubject.next(
        JSON.parse(
          sessionStorage.getItem(SESSION.SUBSCRIPTION_PREFERENCES) || '[]'
        )
      );
    } else {
      await this.loadSubscriptionPreferences();
    }
    return this.subscriptionPreferences$;
  }

  getAllUsers(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_USERS}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });

    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  async loadRoles() {
    let url: string = `${environment.apiBaseUrl}/role/list`;
    const loadRoles$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.USER_ROLES, JSON.stringify(data));
        this.rolesSubject.next(data);
      })
    );
    loadRoles$.subscribe();
  }

  async loadProvinces(used?: number) {
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', used);
    }
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_PROVINCES}`;
    const loadProvince$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.PROVINCES, JSON.stringify(data));
        this.provincesSubject.next(data);
      })
    );
    loadProvince$.subscribe();
  }

  async loadSectors(type: number) {
    let url: string = `${environment.apiBaseUrl}/sector/list`;
    let queryParams = new HttpParams();
    if (type == 1) {
      queryParams = queryParams.append('Type', type);
    }
    const loadSectors$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.SECTORS, JSON.stringify(data));
        this.sectorsSubject.next(data);
      })
    );
    loadSectors$.subscribe();
  }

  async loadCampaignSectors(campaign: string) {
    let url: string = `${environment.apiBaseUrl}/sector/list`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Campaign', campaign);

    const loadCampaignSectors$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.SECTORS, JSON.stringify(data));
        this.sectorsSubject.next(data);
      })
    );
    loadCampaignSectors$.subscribe();
  }


  async loadAreas() {
    let url: string = `${environment.apiBaseUrl}/area/list`;
    const loadAreas$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.AREAS, JSON.stringify(data));
        this.areasSubject.next(data);
      })
    );
    loadAreas$.subscribe();
  }

  async loadPersonalInterests() {
    let url: string = `${environment.apiBaseUrl}/personal_interest/list`;
    const loadPersonalInterests$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PERSONAL_INTERESTS,
          JSON.stringify(data)
        );
        this.personalInterestsSubject.next(data);
      })
    );
    loadPersonalInterests$.subscribe();
  }

  async loadSubscriptionPreferences() {
    let url: string = `${environment.apiBaseUrl}/subscription_preference/list`;
    const loadSubPreferences$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.SUBSCRIPTION_PREFERENCES,
          JSON.stringify(data)
        );
        this.subscriptionPreferencesSubject.next(data);
      })
    );
    loadSubPreferences$.subscribe();
  }

  getProperties(sectors: any) {
    let url: string = `${environment.apiBaseUrl}/property/propertiesbysectorid`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('SectorId', sectors);
    queryParams = queryParams.append('Type', 1);
    return this.http.get(url, { params: queryParams });
  }

  deleteUser(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/user/delete/${id}`;
    return this.http.delete(url);
  }
  postUserRegister(userRole: userRole) {
    let url: string = `${environment.apiBaseUrl}/user/register`;
    return this.http.post(url, userRole);
  }

  editUser(userRole: userRole, userId: any) {
    let url: string = `${environment.apiBaseUrl}/user/update/${userId}`;
    return this.http.put(url, userRole);
  }

  getUserById(userId: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/user/details/${userId}`;
    return this.http.get(url);
  }

  uploadCompanyLogo(file: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.MEDIA_UPLOAD}`;
    let formData = new FormData();
    formData.append(CONSTANTS.FILE, file, file.name);
    formData.append('Type', JSON.stringify(MEDIA_TYPE.COMPANY_LOGO));
    return this.http.post(url, formData);
  }

  deleteCompanyLogo(id: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_INTEGRATED_REPORT_MEDIA
    }/${id}`;
    return this.http.delete(url);
  }
}
