import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, CONSTANTS, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private propertyDetailsSubject = new BehaviorSubject<any>('');
  public propertyDetails$ = this.propertyDetailsSubject.asObservable();

  private internationalPropertyDetailsSubject = new BehaviorSubject<any>('');
  public internationalPropertyDetails$ =
    this.internationalPropertyDetailsSubject.asObservable();

  propertyAttributesSubject = new BehaviorSubject<any>([]);
  propertyAdvertisementSubject = new BehaviorSubject<any>([]);
  leasingExecutiveSubject = new BehaviorSubject<any>([]);
  brokerLiaisonSubject = new BehaviorSubject<any>([]);
  propertyFeaturesAmenitiesSubject = new BehaviorSubject<any>([]);
  sectorFeaturesAmenitiesSubject = new BehaviorSubject<any>([]);
  propertyGradeSubject = new BehaviorSubject<any>([]);
  propertyEsgFeaturesSubject = new BehaviorSubject<any>([]);
  propertyHoldingCompaniesSubject = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) {}

  setPropertyDetails(propertyDetails: any) {
    sessionStorage.setItem(
      SESSION.PROPERTY_DETAILS,
      JSON.stringify(propertyDetails)
    );
    this.propertyDetailsSubject.next(propertyDetails);
  }
  getPropertyDetails(): Observable<any> {
    let propertyDetails = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_DETAILS) || 'false'
    );
    if (propertyDetails) {
      this.propertyDetailsSubject.next(propertyDetails);
    }
    return this.propertyDetails$;
  }

  setInternationalPropertyDetails(propertyDetails: any) {
    sessionStorage.setItem(
      SESSION.INTERNATIONAL_PROPERTY_DETAILS,
      JSON.stringify(propertyDetails)
    );
    this.internationalPropertyDetailsSubject.next(propertyDetails);
  }
  getInternationalPropertyDetails(): Observable<any> {
    let internationalPropertyDetails = JSON.parse(
      sessionStorage.getItem(SESSION.INTERNATIONAL_PROPERTY_DETAILS) || 'false'
    );
    if (internationalPropertyDetails) {
      this.propertyDetailsSubject.next(internationalPropertyDetails);
    }
    return this.internationalPropertyDetails$;
  }

  getAllProperties(
    pageSize: any,
    pageNumber: any,
    Type?: any,
    sectorIds?: any,
    propertyIds?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/list`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
    if (sectorIds != undefined) {
      queryParams = queryParams.append('SectorId', sectorIds);
    }
    if (propertyIds != undefined) {
      queryParams = queryParams.append('PropertyId', propertyIds);
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
    if (Type != undefined) {
      queryParams = queryParams.append('Type', Type);
    }
    return this.http.get(url, { params: queryParams });
  }

  getAllInternationalProperties(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/property/list`;
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

  getPropertyDetailsById(id: number): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_BY_ID
    }/${id}`;
    return this.http.get(url).pipe(shareReplay());
  }
  createProperty(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.CREATE_PROPERTY_STEP_1
    }`;
    return this.http.post(url, payload);
  }
  updateProperty(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PROPERTY_STEP_1
    }/${payload.PropertyId}`;
    return this.http.put(url, payload);
  }
  deleteProperty(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/delete/${id}`;
    return this.http.delete(url);
  }
  uploadPropertyMedia(file: any, propertyId: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA}`;
    let formData = new FormData();
    formData.append(CONSTANTS.PROPERTY_ID, propertyId);
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
  uploadPropertyMediaLink(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA_LINK}`;
    return this.http.post(url, payload);
  }
  deletePropertyMedia(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA_DELETE
    }/${id}`;
    return this.http.delete(url);
  }
  reorderPropertyImages(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.PROPERTY_MEDIA_REORDER}`;
    return this.http.post(url, payload);
  }
  getPropertySeodata(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/details/meta/${id}`;
    return this.http.get(url);
  }

  updateSeo(id: any, payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/update/meta/${id}`;
    return this.http.put(url, payload);
  }

  getVacancydata(): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/setting/details?Name=VACANCY_SCHEDULE_TEXT`;
    return this.http.get(url);
  }

  updateVacancy(id: any, payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/setting/update`;
    return this.http.put(url, payload);
  }

  propertyPreviewDetails(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/confirmation/${id}`;
    return this.http.get(url);
  }
  async getPropertyAttributes(): Promise<Observable<any>> {
    let attributes = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_ATTRIBUTES) || '[]'
    );
    if (attributes.length) {
      this.propertyAttributesSubject.next(attributes);
      return of(attributes);
    } else {
      await this.loadPropertyAttributes();
    }
    return this.propertyAttributesSubject.asObservable();
  }
  async loadPropertyAttributes() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_ATTRIBUTES}`;
    const loadPropertyAttributes$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_ATTRIBUTES,
          JSON.stringify(data)
        );
        this.propertyAttributesSubject.next(data);
      })
    );
    return loadPropertyAttributes$.subscribe();
  }

  async getAdvertisementTypes(): Promise<Observable<any>> {
    let advertisements = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_ADVERTISEMENT) || '[]'
    );
    if (advertisements.length) {
      this.propertyAdvertisementSubject.next(advertisements);
      return of(advertisements);
    } else {
      await this.loadAdvertisementTypes();
    }
    return this.propertyAdvertisementSubject.asObservable();
  }
  async loadAdvertisementTypes() {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_ADVERTISING_TYPES
    }`;
    const loadAdvertisementTypes$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_ADVERTISEMENT,
          JSON.stringify(data)
        );
        this.propertyAdvertisementSubject.next(data);
      })
    );
    return loadAdvertisementTypes$.subscribe();
  }
  addAdvertisingOpportunities(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.ADD_PROPERTY_ADVERTISING}`;
    let formData = new FormData();
    for (const key in payload) {
      if (typeof payload[key] == 'object' && payload[key] != '') {
        formData.append(key, payload[key], payload[key].name);
      } else if (
        (typeof payload[key] == 'string' || typeof payload[key] == 'number') &&
        payload[key] != ''
      ) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(url, formData);
  }
  updateAdvertisingOpportunities(payload: any, id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_PROPERTY_ADVERTISING
    }/${id}`;
    let formData = new FormData();
    for (const key in payload) {
      if (typeof payload[key] == 'object' && payload[key] != '') {
        formData.append(key, payload[key], payload[key].name);
      } else if (
        (typeof payload[key] == 'string' || typeof payload[key] == 'number') &&
        payload[key] != ''
      ) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(url, formData);
  }
  deletePropertyAdvertisement(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_PROPERTY_ADVERTISING
    }/${id}`;
    return this.http.delete(url);
  }
  deleteAdvertisementFile(id: number): Observable<any> {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.DELETE_ADVERTISEMENT_FILE
    }/${id}`;
    return this.http.delete(url);
  }
  async getLeasingExecutive(propertyId: number): Promise<Observable<any>> {
    let leasingExecutive = JSON.parse(
      sessionStorage.getItem(SESSION.LEASING_EXECUTIVES) || '[]'
    );
    if (leasingExecutive.length) {
      this.leasingExecutiveSubject.next(leasingExecutive);
      return of(leasingExecutive);
    } else {
      await this.loadLeasingExecutive(propertyId);
    }
    return this.leasingExecutiveSubject.asObservable();
  }
  async loadLeasingExecutive(propertyId: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_LEASING_EXECUTIVE
    }/${propertyId}`;
    const loadLeasingExecutive$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.LEASING_EXECUTIVES,
          JSON.stringify(data)
        );
        this.leasingExecutiveSubject.next(data);
      })
    );
    return loadLeasingExecutive$.subscribe();
  }
  async getBrokerLiaison(propertyId: number): Promise<Observable<any>> {
    let brokerLiaison = JSON.parse(
      sessionStorage.getItem(SESSION.BROKER_LIAISONS) || '[]'
    );
    if (brokerLiaison.length) {
      this.brokerLiaisonSubject.next(brokerLiaison);
      return of(brokerLiaison);
    } else {
      await this.loadBrokerLiaison(propertyId);
    }
    return this.brokerLiaisonSubject.asObservable();
  }
  async loadBrokerLiaison(propertyId: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_BROKER_LIAISON
    }/${propertyId}`;
    const loadBrokerLiaison$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.BROKER_LIAISONS, JSON.stringify(data));
        this.brokerLiaisonSubject.next(data);
      })
    );
    return loadBrokerLiaison$.subscribe();
  }
  async getFeaturesAmenitiesByProperty(
    propertyId: number
  ): Promise<Observable<any>> {
    let featuresAmenities = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_FEATURES_AMENITIES) || '[]'
    );
    if (featuresAmenities.length) {
      this.propertyFeaturesAmenitiesSubject.next(featuresAmenities);
      return of(featuresAmenities);
    } else {
      await this.loadFeaturesAmenitiesByProperty(propertyId);
    }
    return this.propertyFeaturesAmenitiesSubject.asObservable();
  }
  async loadFeaturesAmenitiesByProperty(propertyId: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_PROPERTY_FEATURES_AMENITIES
    }/${propertyId}`;
    const loadPropertyFeaturesAmenities$ = this.http.get(url).pipe(
      shareReplay(),
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_FEATURES_AMENITIES,
          JSON.stringify(data)
        );
        this.propertyFeaturesAmenitiesSubject.next(data);
      })
    );
    return loadPropertyFeaturesAmenities$.subscribe();
  }
  async getEsgFeatures(): Promise<Observable<any>> {
    let esgFeatures = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_ESG_FEATURES) || '[]'
    );
    if (esgFeatures.length) {
      this.propertyEsgFeaturesSubject.next(esgFeatures);
      return of(esgFeatures);
    } else {
      await this.loadEsgFeatures();
    }
    return this.propertyEsgFeaturesSubject.asObservable();
  }
  async loadEsgFeatures() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_ESG_FEATURES}`;
    const loadEsgFeatures$ = this.http.get(url).pipe(
      shareReplay(),
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_ESG_FEATURES,
          JSON.stringify(data)
        );
        this.propertyEsgFeaturesSubject.next(data);
      })
    );
    return loadEsgFeatures$.subscribe();
  }

  async getFeaturesAmenitiesBySector(
    sectorId: number
  ): Promise<Observable<any>> {
    let sectorFeaturesAmenities = JSON.parse(
      sessionStorage.getItem(SESSION.SECTOR_FEATURES_AMENITIES) || '[]'
    );
    if (sectorFeaturesAmenities.length) {
      this.sectorFeaturesAmenitiesSubject.next(sectorFeaturesAmenities);
      return of(sectorFeaturesAmenities);
    } else {
      await this.loadFeaturesAmenitiesBySector(sectorId);
    }
    return this.sectorFeaturesAmenitiesSubject.asObservable();
  }
  async loadFeaturesAmenitiesBySector(sectorId: number) {
    let url = `${
      environment.apiBaseUrl + API_ROUTE.GET_SECTOR_FEATURES_AMENITIES
    }/${sectorId}`;
    const loadSectorFeaturesAmenities$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.SECTOR_FEATURES_AMENITIES,
          JSON.stringify(data)
        );
        this.sectorFeaturesAmenitiesSubject.next(data);
      })
    );
    return loadSectorFeaturesAmenities$.subscribe();
  }
  async getPropertyGrade(): Promise<Observable<any>> {
    let propertyGrade = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_GRADES) || '[]'
    );
    if (propertyGrade.length) {
      this.propertyGradeSubject.next(propertyGrade);
      return of(propertyGrade);
    } else {
      await this.loadPropertyGrade();
    }
    return this.propertyGradeSubject.asObservable();
  }

  async loadPropertyGrade() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_GRADE_LIST}`;
    const loadPropertyGrades$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.PROPERTY_GRADES, JSON.stringify(data));
        this.propertyGradeSubject.next(data);
      })
    );
    return loadPropertyGrades$.subscribe();
  }

  addPropertyContactDetails(
    propertyId: any,
    contactDetails: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/add/step3/${propertyId}`;
    return this.http.put(url, contactDetails);
  }

  addUpdatePropertyFeatures(features: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.ADD_FEATURES}`;
    return this.http.put(url, features);
  }

  addUpdatePropertyEsgFeatures(payload: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl + API_ROUTE.ADD_ESG_FEATURES}`;
    return this.http.post(url, payload);
  }

  mdaLookupPropertyDetails(buildingCode: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_MDA_PROPERTY_DETAILS}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('BuildingCode', buildingCode);
    return this.http.get(url, { params: queryParams });
  }
  updatePropertyStatus(propertyId: any, status: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.PROPERTY_STATUS_UPDATE
    }`;
    let formData = new FormData();
    formData.append('PropertyId', propertyId);
    formData.append('Status', status);
    return this.http.post(url, formData);
  }

  getAllUnitsbyProperty(
    pageSize: any,
    pageNumber: any,
    //sectorIds?: any,
    propertyId?: any,
    searchValue?: any,
    sortBy?: any,
    sortOrder?: any
  ): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/unit/list`;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PageNo', pageNumber);
    queryParams = queryParams.append('PerPage', pageSize);
    // if (sectorIds != undefined) {
    //   queryParams = queryParams.append('SectorId', sectorIds);
    // }
    if (propertyId != undefined) {
      queryParams = queryParams.append('PropertyId', propertyId);
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

  deleteUnit(id: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/unit/delete/${id}`;
    return this.http.delete(url);
  }

  propertyIsFeatured(id: any, IsFeatured: any, type: any): Observable<any> {
    let url: string = `${environment.apiBaseUrl}/property/updatefeatured/${id}`;
    let formData = new FormData();
    formData.append('IsFeatured', IsFeatured);
    formData.append('Type', type);
    return this.http.post(url, formData);
  }

  async getPropertyHoldingCompanies(): Promise<Observable<any>> {
    let companies = JSON.parse(
      sessionStorage.getItem(SESSION.PROPERTY_HOLDING_COMPANIES) || '[]'
    );
    if (companies.length) {
      this.propertyHoldingCompaniesSubject.next(companies);
      return of(companies);
    } else {
      await this.loadHoldingCompanies();
    }
    return this.propertyHoldingCompaniesSubject.asObservable();
  }
  async loadHoldingCompanies() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_HOLDING_COMPANIES}`;
    const holdingCompanies$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_HOLDING_COMPANIES,
          JSON.stringify(data)
        );
        this.propertyHoldingCompaniesSubject.next(data);
      })
    );
    return holdingCompanies$.subscribe();
  }

  getAllLeads(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_LEADS_LIST}`;
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

  createLead(payload: any): Observable<any> {
    let url = `${environment.apiBaseUrl}/lead/add`;
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

  getLeadCompaigns() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_COMPAIGN_LIST}`;
    return this.http.get(url);
  }

  getLeadSources() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_SOURCE_LIST}`;
    return this.http.get(url);
  }

  getLeadMedium() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_MEDIUM_LIST}`;
    return this.http.get(url);
  }

  getLeadStatus() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_LEAD_STATUS_LIST}`;
    return this.http.get(url);
  }

  getLeadDetails(id: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_LEAD_DETAILS}/${id}`;
    return this.http.get(url);
  }

  updateEnquiryStatus(payload: any, id: number) {
    let url = `${environment.apiBaseUrl + API_ROUTE.LEAD_STATUS_UPDATE}/${id}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  sendMessage(payload: any) {
    let url = `${environment.apiBaseUrl + API_ROUTE.LEAD_RESPONSE_MESSAGE}`;
    let formData = new FormData();
    Object.keys(payload).forEach((key: any) => {
      formData.append(key, payload[key]);
    });
    return this.http.post(url, payload);
  }

  unitStatusUpdate(payload: any): Observable<any> {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.UPDATE_UNIT_STATUS
    }`;
    return this.http.post(url, payload);
  }

  CategoryTypesSubject = new BehaviorSubject<any[]>([]);

  CategoryTypes$ = this.CategoryTypesSubject.asObservable();
  private checkSession(key: string) {
    return sessionStorage.getItem(key) != undefined;
  }
  async getCategories(): Promise<Observable<any>> {
    if (this.checkSession(SESSION.PROPERTY_CATEGORY_TYPES)) {
      this.CategoryTypesSubject.next(
        JSON.parse(
          sessionStorage.getItem(SESSION.PROPERTY_CATEGORY_TYPES) || '[]'
        )
      );
    } else {
      await this.loadPrsentationCategoryTypes();
    }
    return this.CategoryTypes$;
  }

  async loadPrsentationCategoryTypes() {
    let url: string = `${environment.apiBaseUrl}/frontend/property/dropdown`;
    const loadCategories$ = this.http.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(
          SESSION.PROPERTY_CATEGORY_TYPES,
          JSON.stringify(data)
        );
        this.CategoryTypesSubject.next(data);
      })
    );
    loadCategories$.subscribe();
  }

  getUnits(propertyId: number) {
    let queryParams = new HttpParams();
    let url: string = `${environment.apiBaseUrl}/frontend/propertyunit/dropdown`;

    queryParams = queryParams.append('PropertyId', propertyId);
    return this.http.get(url, { params: queryParams });
  }
}
