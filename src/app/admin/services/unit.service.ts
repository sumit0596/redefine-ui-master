import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private unitDetailsSubject = new BehaviorSubject<any>('');
  public unitDetails$ = this.unitDetailsSubject.asObservable();

  accessNoteSubject = new BehaviorSubject<any[]>([]);
  accessNote$ = this.accessNoteSubject.asObservable();

  tenantIncentivesSubject = new BehaviorSubject<any[]>([]);
  tenantIncentives$ = this.tenantIncentivesSubject.asObservable();

  unitFeaturesAmenitiesSubject = new BehaviorSubject<any>([]);

  leaseValues = {
    threeYearsLease: '',
    fiveYearsLease: '',
    threeYearsmSquare: '',
    fiveYearsmSquare: '',
  };
  unitValues: any = {};

  constructor(private http: HttpClient) {}

  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }

  setUnitDetails(unitDetails: any) {
    sessionStorage.setItem(SESSION.UNIT_DETAILS, JSON.stringify(unitDetails));
    this.unitDetailsSubject.next(unitDetails);
  }
  getUnitDetails(): Observable<any> {
    let unitDetails = JSON.parse(
      sessionStorage.getItem(SESSION.UNIT_DETAILS) || 'false'
    );
    if (unitDetails) {
      this.unitDetailsSubject.next(unitDetails);
    }
    return this.unitDetails$;
  }

  uploadUnitMedia(
    file: any,
    propertyId: any,
    propertyUnitId: any
  ): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA}`;
    let formData = new FormData();
    formData.append(CONSTANTS.PROPERTY_ID, propertyId);
    formData.append(CONSTANTS.PROPERTY_UNIT_ID, propertyUnitId);
    Object.keys(file).forEach((key) => {
      if (typeof file[key] == 'object' && file[key] != '') {
        formData.append(key, file[key], file[key].name);
      } else if (
        (typeof file[key] == 'string' || typeof file[key] == 'number') &&
        file[key] != ''
      ) {
        formData.append(key, file[key]);
      }
    });
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  reorderUnitImages(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA_REORDER}`;
    return this.http.post(url, payload);
  }

  deleteUnitMedia(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA_DELETE
    }/${id}`;
    return this.http.delete(url);
  }
  getUnitDetailsById(id: number): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_UNIT_BY_ID
    }/${id}`;
    return this.http.get(url);
  }

  createUnit(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.CREATE_UNIT_STEP_1
    }`;
    return this.http.post(url, payload);
  }
  updateUnit(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_STEP_1
    }/${payload.PropertyUnitId}`;
    return this.http.put(url, payload);
  }

  async getAccessNotes(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.ACCESS_NOTES)) {
      this.accessNoteSubject.next(
        JSON.parse(sessionStorage.getItem(SESSION.ACCESS_NOTES) || '[]')
      );
    } else {
      await this.loadAccessNoteValues();
    }
    return this.accessNote$;
  }

  async loadAccessNoteValues() {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_UNIT_ACCESS_LIST
    }`;
    const loadAccessNotes$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.accessNoteSubject.next(data);
      })
    );
    loadAccessNotes$.subscribe();
  }

  async getTenantIncentives(): Promise<Observable<any>> {
    await this.loadTenantIncentives();
    return this.tenantIncentives$;
  }

  async loadTenantIncentives() {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_TENANT_INCENTIVES_LIST
    }`;
    const loadTenantIncentives$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        this.tenantIncentivesSubject.next(data);
      })
    );
    loadTenantIncentives$.subscribe();
  }

  unitStatusUpdate(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_STATUS
    }`;
    return this.http.post(url, payload);
  }

  unitBrokerCommissionIncentiveUpdate(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_BROKER_COMMISSION_INCENTIVE
    }`;
    return this.http.post(url, payload);
  }

  unittenantIncentiveUpdate(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_TENANT_INCENTIVE
    }`;
    return this.http.post(url, payload);
  }

  async getFeaturesAmenitiesByProperty(
    propertyId: any
  ): Promise<Observable<any>> {
    // let propertyUnitFeaturesAmenities = JSON.parse(
    //   sessionStorage.getItem(SESSION.PROPERTY_UNIT_FEATURES_AMENITIES) || '[]'
    // );
    // if (propertyUnitFeaturesAmenities.length) {
    //   this.unitFeaturesAmenitiesSubject.next(propertyUnitFeaturesAmenities);
    //   return of(propertyUnitFeaturesAmenities);
    // } else {
    await this.loadFeaturesAmenitiesBySector(propertyId);
    // }
    return this.unitFeaturesAmenitiesSubject.asObservable();
  }
  async loadFeaturesAmenitiesBySector(propertyId: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_UNIT_FEATURES_AMENITIES
    }/${propertyId}`;
    const loadPropertyFeaturesAmenities$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_UNIT_FEATURES_AMENITIES,
          JSON.stringify(data)
        );
        this.unitFeaturesAmenitiesSubject.next(data);
      })
    );
    return loadPropertyFeaturesAmenities$.subscribe();
  }

  addUpdateUnitFeatures(features: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_FEATURES_AMENITIES
    }`;
    return this.http.put(url, features);
  }

  yearOneCalculation() {
    const unitValues = this.getFormValues(
      this.unitValues['baseRental'],
      this.unitValues['operationalCost'],
      this.unitValues['rates'],
      this.unitValues['unitSize'],
      this.unitValues['netRental'],
      this.unitValues['opsRental']
    );
    const monthValue =
      unitValues.baseRental * unitValues.unitSize +
      unitValues.operationalCost * unitValues.unitSize +
      unitValues.rates * unitValues.unitSize;

    return (monthValue * 12)?.toFixed(2);
  }

  yearTwoCalculation() {
    const unitValues = this.getFormValues(
      this.unitValues['baseRental'],
      this.unitValues['operationalCost'],
      this.unitValues['rates'],
      this.unitValues['unitSize'],
      this.unitValues['netRental'],
      this.unitValues['opsRental']
    );
    const baseRentalSize = unitValues.baseRental * unitValues.unitSize;
    const operationalCostSize =
      unitValues.operationalCost * unitValues.unitSize;

    const monthValue =
      (baseRentalSize * unitValues.netRental) / 100 +
      baseRentalSize +
      ((operationalCostSize * unitValues.opsRental) / 100 +
        operationalCostSize) +
      unitValues.rates * unitValues.unitSize;

    return (monthValue * 12)?.toFixed(2);
  }

  toatalLeaseValue(percent: number) {
    return (
      ((this.getFieldValues(this.yearOneCalculation()) +
        this.getFieldValues(this.yearTwoCalculation())) *
        percent) /
      100
    )?.toFixed(2);
  }

  ratePerMeter(percent: number) {
    const unitValues = this.getFormValues(
      this.unitValues['baseRental'],
      this.unitValues['operationalCost'],
      this.unitValues['rates'],
      this.unitValues['unitSize'],
      this.unitValues['netRental'],
      this.unitValues['opsRental']
    );
    return (
      this.getFieldValues(this.toatalLeaseValue(percent)) / unitValues.unitSize
    ).toFixed(2);
  }

  getFieldValues(data: any) {
    return isNaN(parseFloat(data))
      ? parseFloat('0.0')
      : parseFloat(parseFloat(data).toFixed(2));
  }

  getFormValues(
    baseRental?: any,
    operationalCost?: any,
    rates?: any,
    unitSize?: any,
    netRental?: any,
    opsRental?: any
  ) {
    this.unitValues['baseRental'] = this.getFieldValues(baseRental);
    this.unitValues['operationalCost'] = this.getFieldValues(operationalCost);
    this.unitValues['rates'] = this.getFieldValues(rates);
    this.unitValues['unitSize'] = unitSize;
    this.unitValues['netRental'] = netRental?.replace('%', '');
    this.unitValues['opsRental'] = opsRental?.replace('%', '');

    return this.unitValues;
  }

  onNetRentalSelect(
    baseRental?: any,
    operationalCost?: any,
    rates?: any,
    unitSize?: any,
    netRental?: any,
    opsRental?: any
  ): any {
    const unitValues = this.getFormValues(
      baseRental,
      operationalCost,
      rates,
      unitSize,
      netRental,
      opsRental
    );
    if (
      unitValues.netRental != '0.00' &&
      unitValues.netRental !== undefined &&
      unitValues.opsRental != '0.00' &&
      unitValues.opsRental !== undefined &&
      unitValues.unitSize != '' &&
      unitValues.baseRental != '0' &&
      unitValues.netRental != '0' &&
      unitValues.rates != '0'
    ) {
      this.leaseValues.threeYearsLease = this.toatalLeaseValue(30);
      this.leaseValues.fiveYearsLease = this.toatalLeaseValue(50);
      this.leaseValues.threeYearsmSquare = this.ratePerMeter(30);
      this.leaseValues.fiveYearsmSquare = this.ratePerMeter(50);
      return this.leaseValues;
    }
  }
}
