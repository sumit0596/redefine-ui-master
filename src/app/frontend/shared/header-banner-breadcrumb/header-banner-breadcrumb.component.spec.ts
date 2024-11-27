import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBannerBreadcrumbComponent } from './header-banner-breadcrumb.component';

describe('HeaderBannerBreadcrumbComponent', () => {
  let component: HeaderBannerBreadcrumbComponent;
  let fixture: ComponentFixture<HeaderBannerBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderBannerBreadcrumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBannerBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
