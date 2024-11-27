import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { environment } from 'src/environments/environment.uat';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [AdminService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve menu items from API', () => {
    const data = [
      {
        name: 'Home',
        link: '/home',
        submenu: [],
      },
      {
        name: 'Properties',
        link: '/properties',
        submenu: [
          {
            name: 'All Properties',
            link: '/all-properties',
          },
        ],
      },
      {
        name: 'Page Builder',
        link: '/page-builder',
        submenu: [],
      },
      {
        name: 'Media Storage',
        link: '/media-storage',
        submenu: [],
      },
      {
        name: 'Help',
        link: '/help',
        submenu: [],
      },
    ];

    const url: string = `${environment.apiUrl}/redefine/public/api/adminleftmenu/list`;

    // service.loadMenu().subscribe((res:any) => {
    //   expect(res).toEqual(data);
    // });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });
});
