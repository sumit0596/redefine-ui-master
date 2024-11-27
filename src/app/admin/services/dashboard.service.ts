import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { environment } from 'src/environments/environment.dev';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  propertyCount: any;
  updatePropCount = new Subject<any>();
  data$ = this.updatePropCount.asObservable();

  citySubject = new BehaviorSubject<any[]>([]);
  city$ = this.citySubject.asObservable();

  suburbSubject = new BehaviorSubject<any[]>([]);
  suburb$ = this.suburbSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private toasterService: ToastrService
  ) {}

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  getRecentlyUpdatedUnits(filter: any): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_RECENTLY_UPDATED_UNITS
    }`;
    let params = new HttpParams();
    params = params.append('Type', filter);
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }
  getPropertyExcelExport(): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTYMEDIA_DOWNLOAD
    }`;
    let params = new HttpParams().set('Type', '1');

    return this.http
      .get<any[]>(url, { params })
      .pipe(map((res: any) => res.data));
  }
  downloadPropertyExcel(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { Sheet1: ws },
      SheetNames: ['Sheet1'],
    };
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  // getPropertyExcelExport(): Observable<any> {
  //   let url = `${
  //     environment.apiBaseUrl + API_ROUTE.GET_PROPERTYMEDIA_DOWNLOAD
  //   }`;
  //   let params = new HttpParams();
  //   params = params.append('Type', '1');
  //   return this.http
  //     .get(url, { params: params })
  //     .pipe(map((res: any) => res));
  // }

  getPropertyCount(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_COUNT}`;
    let params = new HttpParams();
    params = params.append('Type', filter);
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return { label: filter, data: res.data };
      })
    );
    // .subscribe({
    //   next: (result: any) => {
    //     this.loaderService.hide();
    //     // this.propertyCount = Object.entries(result).map(
    //     //   ([category, value]) => {
    //     //     return {
    //     //       category: category,
    //     //       label: this.getCountLabel(category),
    //     //       value: typeof value === 'string' ? parseInt(value) : value,
    //     //     };
    //     //   }
    //     // );
    //     this.updatePropCount.next({ label: filter, data: result });
    //   },
    //   error: (error: any) => {
    //     this.loaderService.hide();
    //     error.error.errors
    //       ? this.displayError(error.error.errors)
    //       : this.toasterService.error(error.error.message);
    //   },
    // });
  }
  private getCountLabel(key: string) {
    switch (key) {
      case 'AvailableUnitCount':
        return 'Available Units';
      case 'PropertyCount':
        return 'Properties';
      case 'UnavailableUnitCount':
        return 'Unavailable Units';
      default:
        return 'Label';
    }
  }
  getAllPropertyUnits(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ALL_PROPERTY_UNIT}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }

  getPropListDropdown(): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROP_LIST_DROPDOWN}`;
    let params = new HttpParams();
    return this.http
      .get(url, {
        params: params,
      })
      .pipe(map((res: any) => res.data));
  }
  
 
  getBrokpPropListDropdown(type: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_BROK_PROP_LIST_DROPDOWN}?Type=${type}`;  
    return this.http
      .get(url, {
        headers: new HttpHeaders({ [CONSTANTS.SKIP_LOADER]: 'true' }),
      })
      .pipe(map((res: any) => res.data));
  }
  

  getPropTypeDropdown(type: any) {
    let queryParams = new HttpParams();
    if (type == 1 || type == 'need-space') {
      type = 1;
      queryParams = queryParams.append('Type', type);
    }
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROP_TYPE_DROPDOWN}`;
    return this.http.get(url, { params: queryParams });
  }

  getPropAttributeDropdown(used?: any) {
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', used);
    }
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROP_ATTRIBUTE_DROPDOWN
    }`;
    return this.http.get(url, { params: queryParams });
  }

  getPropertyIncentiveDropdown(visibility?: any) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROP_INCENTIVES_DROPDOWN
    }`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Used', 1);
    if (visibility != undefined) {
      queryParams = queryParams.append('Visibility', visibility);
    }
    return this.http.get(url, { params: queryParams });
  }

  async getCities(used?: number): Promise<Observable<any>> {
    await this.loadCities(used);
    return this.city$;
  }

  async loadCities(used?: number) {
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', used);
    }
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_CITIES}`;
    const loadCity$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.CITY, JSON.stringify(data));
        this.citySubject.next(data);
      })
    );
    loadCity$.subscribe();
  }

  async getSuburb(used?: any): Promise<Observable<any>> {
    await this.loadSuburb(used);
    return this.suburb$;
  }

  async loadSuburb(used?: any) {
    let queryParams = new HttpParams();
    if (used != undefined) {
      queryParams = queryParams.append('Used', used);
    }
    let url: string = `${environment.apiBaseUrl + API_ROUTE.GET_SUBURB}`;
    const loadSuburb$ = this.http.get(url, { params: queryParams }).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.SUBURB, JSON.stringify(data));
        this.suburbSubject.next(data);
      })
    );
    loadSuburb$.subscribe();
  }

  getVacancyExcelData(propertyUnitIds: any, type: any) {
    let fd = new FormData();
    fd.append('PropertyUnitId', propertyUnitIds);
    fd.append('Type', type);
    return this.http
      .post(`${environment.apiBaseUrl + API_ROUTE.GET_UNIT_EXPORT}`, fd)
      .pipe(map((res: any) => res.data));
  }

  getSessions(payload: any) {
    let url: string = `${environment.apiBaseUrl}/analytics/totalsession`;
    return this.addParams(url, payload);
  }
  getPageViews(payload: any) {
    let url = `${environment.apiBaseUrl}/analytics/pageviews`;
    return this.addParams(url, payload);
  }

  getDownloads(payload: any) {
    let url: string = `${environment.apiBaseUrl}/analytics/downloads`;
    return this.addParams(url, payload);
  }

  getStakeholders(filter: any, label: string): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_STAKE_HOLDERS}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return { label: label, data: res.data };
      })
    );
  }

  getStakeholdersSession(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_STAKE_HOLDERS_SESSION}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return { data: res.data };
      })
    );
  }

  getRecentEnquiries(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_RECENT_ENQUIRIES}`;

    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data.res));
  }

  getRecentJobs(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_RECENT_JOBS}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data.res));
  }

  getRecentEvents(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_RECENT_EVENTS}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data.res));
  }

  getRecentUnits(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_RECENT_UNITS}`;
    let params = new HttpParams();
    Object.keys(payload).forEach((key: string) => {
      if (payload[key] != undefined) {
        params = params.append(key, payload[key]);
      }
    });
    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data.res));
  }

  getFinancialResultsDashboard(payload: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FINANCIAL_RESULTS
    }`;
    return this.addParams(url, payload);
  }

  getLearnershipDashboard(payload: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_LEARNERSHIP_PROGRAM
    }`;
    return this.addParams(url, payload);
  }

  getJobApplicants(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_JOB_APPLICANTS}`;
    return this.addParams(url, payload);
  }

  getJobViews(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_JOB_VIEWS}`;
    return this.addParams(url, payload);
  }

  getPropertyConversion(payload: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_CONVERSION
    }`;
    return this.addParams(url, payload);
  }

  getPropertyEqPerformance(payload: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTYEQ_PERFORMANCE
    }`;
    return this.addParams(url, payload);
  }

  getReportDownloads(payload: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_REPORT_DOWNLOADS
    }`;
    return this.addParams(url, payload);
  }

  getPropertyMedia() {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_MEDIA
    }`;
    let params = new HttpParams();
    params = params.append('Type', 1);

    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  getAllPropertyConversions(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_CONVERSION}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    // Ensure that PageNo and PerPage parameters are set to fetch all data
    params = params.set('PageNo', '1'); // Assuming the first page
    params = params.set('PerPage', '1000'); // Assuming a large number to get all records

    return this.http
      .get(url, { params: params })
      .pipe(map((res: any) => res.data));
  }

  addParams(url: string, payload: any) {
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
  

  getDeviceSplit(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_DEVICE_SPLIT}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return {  data: res.data };
      })
    );
  }

  getOSSplit(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_OS_SPLIT}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return {  data: res.data };
      })
    );
  }

  getSourceSplit(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_SOURCE_SPLIT}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return {  data: res.data };
      })
    );
  }

  getBrowserSplit(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_BROWSER_SPLIT}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return {  data: res.data };
      })
    );
  }

  getInsightsAnalytics(filter: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_INSIGHTS_ANALYTICS}`;
    let params = new HttpParams();
    Object.keys(filter).forEach((key: string) => {
      if (filter[key] != undefined) {
        params = params.append(key, filter[key]);
      }
    });
    return this.http.get(url, { params: params }).pipe(
      map((res: any) => {
        return {  data: res.data };
      })
    );
  }
}
