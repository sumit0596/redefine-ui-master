import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { API_ROUTE, SESSION } from 'src/app/models/constants';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  qualificationsSubject = new BehaviorSubject<any>([]);

  constructor(private httpCLient: HttpClient) {}

  getBanner(Name: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Name', Name);
    return this.httpCLient.get(
      `${environment.apiBaseUrl}${API_ROUTE.GET_FRONTEND_CAREER_BANNER}`,
      { params: queryParams }
    );
  }

  async getEducationalQualifications(): Promise<Observable<any>> {
    let qualifications = JSON.parse(
      sessionStorage.getItem(SESSION.QUALIFICATIONS) || '[]'
    );
    if (qualifications.length) {
      this.qualificationsSubject.next(qualifications);
      return of(qualifications);
    } else {
      await this.loadQualifications();
    }
    return this.qualificationsSubject.asObservable();
  }

  async loadQualifications() {
    let url = `${environment.apiBaseUrl + API_ROUTE.GET_QUALIFICATIONS}`;
    const loadQualifications$ = this.httpCLient.get(url).pipe(
      map((res: any) => res.data),
      catchError((error: any) => {
        return throwError(() => new error(error));
      }),
      tap((data: any) => {
        sessionStorage.setItem(SESSION.QUALIFICATIONS, JSON.stringify(data));
        this.qualificationsSubject.next(data);
      })
    );
    loadQualifications$.subscribe();
  }

  uploadApplicantInfo(payload: any) {
    let url = `${environment.apiBaseUrl}/applicant/add`;
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
    return this.httpCLient.post(url, formData);
  }

  uploadLearnershipApplicantInfoStep1(payload: any) {
    let url = `${environment.apiBaseUrl}/learnerships/add/step1`;
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
    return this.httpCLient.post(url, formData);
  }

  uploadLearnershipApplicantInfoStep2(payload: any, Id: number) {
    let url = `${environment.apiBaseUrl}/learnerships/add/step2/${Id}`;
    return this.httpCLient.put(url, payload);
  }

  uploadLearnershipApplicantInfoStep3(payload: any, Id: number) {
    let url = `${environment.apiBaseUrl}/learnerships/add/step3/${Id}`;
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
    return this.httpCLient.post(url, formData);
  }

  getJobDetails(slug: any) {
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_JOB_DETAILS
    }/${slug}`;
    return this.httpCLient.get(url);
  }

  getRecentJobs(slug: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Slug', slug);
    let url: string = `${
      environment.apiBaseUrl + API_ROUTE.GET_FRONTEND_RECENT_JOBS
    }`;
    return this.httpCLient.get(url, { params: queryParams });
  }
  getJobApplicationRouterLinks(name: any, slug?: any): any {
    switch (name) {
      case 'job-application':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/careers', Name: 'Careers / ' },
          { path: '/', Name: 'Career Opportunities / ' },
          { path: '/', Name: 'Receptionist / ' },
          { path: '/', Name: 'Facilities Administrator / ' },
          { path: '/careers/job-application', Name: 'Application' },
        ];
      case 'learnership-application':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/careers', Name: 'Careers / ' },
          { path: '/', Name: 'Learnership Programme / ' },
          { path: '/careers/learnership-application', Name: 'Application' },
        ];
      case 'job-details':
        return [
          { path: '/', Name: 'Home / ' },
          { path: '/careers', Name: 'Careers / ' },
          { path: '/', Name: 'Career Opportunities / ' },
          // { path: '/careers/Career Opportunities', Name: 'Receptionist' },
          { path: '/careers/Career Opportunities' + slug, Name: slug },
        ];
    }
  }
}
